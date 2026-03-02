"use client";

import { useProfile } from "@/app/profile/profileContent";
import { auth, db } from "@/app/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc,
  orderBy 
} from "firebase/firestore";
import {
  Bookmark,
  BookOpen,
  ExternalLink,
  FileText,
  FolderOpen,
  Pencil,
  Plus,
  Share2,
  TrendingUp,
  Users,
  X,
  Trash2
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ArticleCard from "@/app/components/ArticleCard";
import { Article } from "@/app/types"; // Ensure this import exists

const highlights = [
  { icon: TrendingUp, text: <>Your articles engagements went up by <strong>2%</strong> yesterday</> },
  { icon: Users, text: <>Your profile gained <strong>14</strong> new followers</> },
  { icon: Share2, text: <>Your post where shared by <strong style={{ color: "#00897B" }}>62</strong> new people</> },
];

const quickActions = [
  { label: "Create New Project", icon: ExternalLink },
  { label: "Create New Article", icon: FileText },
  { label: "My Drafts", icon: FolderOpen },
  { label: "Saved Articles", icon: Bookmark },
  { label: "My Articles", icon: BookOpen },
];

export default function ProfilePage() {
  const { user, updateUser } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for dynamic data
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);

  const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  // ─── 🟢 FETCH USER ACTIVITIES ───
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 1. Fetch current user's following list (to pass to ArticleCard)
    const userRef = doc(db, "users", currentUser.uid);
    const unsubUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setFollowingList(doc.data().following || []);
      }
    });

    // 2. Fetch only articles written by THIS user
    const q = query(
      collection(db, "articles"), 
      where("authorId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubArticles = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setMyArticles(docs);
    });

    return () => {
      unsubUser();
      unsubArticles();
    };
  }, []);

  // ─── HANDLERS ───
  const handleSaveBio = async () => {
    updateUser({ name: tempName, bio: tempBio });
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { name: tempName, bio: tempBio });
      } catch (err) {
        console.error("Firestore Update Error:", err);
      }
    }
    setIsModalOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateUser({ avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ paddingBottom: 60 }} className="font-lato">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <p className="font-bold text-[15px] text-gray-900 mb-5">Your Profile</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-4">
        {/* Profile Details */}
        <div>
          <div className="flex gap-5 items-start mb-5">
            <div className="relative shrink-0">
              <div className="w-[92px] h-[92px] rounded-[18px] overflow-hidden bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-gray-400">{firstInitial}</span>
                )}
              </div>
              <div onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00897B] rounded-full border-2 border-white flex items-center justify-center cursor-pointer">
                <Plus size={14} color="#fff" />
              </div>
            </div>

            <div className="pt-1">
              <p className="font-black text-xl text-gray-900 leading-tight">{user.name}</p>
              <p className="text-sm text-gray-400 mb-3">{auth.currentUser?.email}</p>
              <button 
                onClick={() => { setTempName(user.name); setTempBio(user.bio); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-300 bg-white text-xs font-bold hover:bg-gray-50 transition-all"
              >
                Edit bio <Pencil size={12} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 pt-4 border-t border-gray-100">
            {[["0", "Following"], [followingList.length.toString(), "Followers"], ["0", "Views"], ["0", "Likes"]].map(([val, lbl]) => (
              <div key={lbl}>
                <p className="font-black text-sm text-gray-900">{val}</p>
                <p className="text-[9px] text-gray-400 uppercase font-bold">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Links */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="font-black text-sm text-gray-900 mb-4">Public Links</p>
          {links.length === 0 ? (
            <p className="text-[11px] text-gray-400 italic">No links added</p>
          ) : (
            <div className="w-full space-y-2">
              {links.map((link, i) => (
                <div key={i} className="flex justify-between items-center p-2 border rounded-lg bg-gray-50">
                  <span className="text-xs font-bold text-gray-700">{link.platform}</span>
                  <Trash2 size={12} className="text-red-400 cursor-pointer" onClick={() => setLinks(links.filter((_, idx) => idx !== i))} />
                </div>
              ))}
            </div>
          )}
          <button className="mt-4 px-5 py-2 rounded-full border border-gray-200 text-[10px] font-bold bg-white hover:bg-gray-50 transition-all">
            Add link +
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3 items-end">
          {quickActions.map(({ label, icon: Icon }) => (
            <button key={label} className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-xs font-bold bg-white hover:bg-teal-50 hover:border-[#00897B] transition-all group">
              {label} <Icon size={14} className="text-gray-300 group-hover:text-[#00897B]" />
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-10">
        <p className="font-bold text-sm text-gray-900 mb-4">Your Highlights</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#00897B] rounded-xl flex items-center justify-center shrink-0">
                <Icon size={18} color="#fff" />
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t-2 border-dashed border-gray-200 my-10" />

      {/* ─── 🟢 ACTIVITIES GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h3 className="text-xl font-black text-gray-900 mb-1">Your Activities</h3>
          <p className="text-xs text-gray-400 mb-8">Shared by you</p>
          
          <div className="space-y-6">
            {myArticles.length > 0 ? (
              myArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  currentUserFollowing={followingList} 
                />
              ))
            ) : (
              <div className="p-10 border-2 border-dashed border-gray-200 rounded-[32px] text-center">
                <p className="text-gray-400 font-bold text-sm">You haven't posted any articles yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] animate-in fade-in duration-300">
          <div className="bg-[#FDFBF7] p-8 rounded-[32px] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-end mb-2">
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl overflow-hidden mb-4 border-2 border-[#00897B] bg-gray-200 flex items-center justify-center">
                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <span className="text-2xl font-black text-[#00897B]">{firstInitial}</span>}
              </div>
              <h3 className="text-xl font-black text-gray-900">{user.name}</h3>
              <p className="text-xs font-bold text-[#00897B] mt-1">{auth.currentUser?.email}</p>
            </div>
            <div className="space-y-5">
              <input value={tempName} onChange={(e) => setTempName(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] text-sm font-bold bg-white" placeholder="Update Name" />
              <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} className="w-full p-4 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] text-sm font-bold bg-white h-24 resize-none" placeholder="Update Bio" />
            </div>
            <button onClick={handleSaveBio} className="w-full mt-8 py-4 bg-[#00897B] text-white font-black rounded-full hover:bg-teal-800 transition-all shadow-lg shadow-teal-900/20">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}