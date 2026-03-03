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
  Trash2,
  Loader2
} from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import ArticleCard from "@/app/components/ArticleCard";
import { Article } from "@/app/types";

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
  const [followersCount, setFollowersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempBio, setTempBio] = useState("");
  const [links, setLinks] = useState<{ platform: string; url: string }[]>([]);

  const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  // ─── 🟢 FETCH USER ACTIVITIES ───
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 1. Fetch current user data (Following list AND Followers count)
    const userRef = doc(db, "users", currentUser.uid);
    const unsubUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFollowingList(data.following || []);
        setFollowersCount(data.followersCount || 0);
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
      setLoading(false);
    });

    return () => {
      unsubUser();
      unsubArticles();
    };
  }, []);

  // ─── 🟢 AI FIX: AVATAR AND BIO UPLOAD HANDLERS ───
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      updateUser({ avatar: base64 }); // update local state

      // ✅ Also persist to Firestore so ArticleCard can read it
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          await updateDoc(userRef, { avatar: base64 });
        } catch (err) {
          console.error("Avatar save error:", err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBio = async () => {
    updateUser({ name: tempName, bio: tempBio });
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await updateDoc(userRef, { 
          name: tempName, 
          bio: tempBio,
          avatar: user.avatar  // ✅ ensure the image isn't lost during a name change
        });
      } catch (err) {
        console.error("Firestore Update Error:", err);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ paddingBottom: 60 }} className="font-lato">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

      <p className="font-bold text-[15px] text-gray-900 mb-5 uppercase tracking-widest">Profile Dashboard</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-4">
        {/* Profile Details */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div className="flex gap-5 items-start mb-5">
            <div className="relative shrink-0">
              <div className="w-[92px] h-[92px] rounded-[18px] overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-[#00897B]">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-[#00897B]">{firstInitial}</span>
                )}
              </div>
              <div onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#00897B] rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-md">
                <Plus size={14} color="#fff" />
              </div>
            </div>

            <div className="pt-1">
              <p className="font-black text-xl text-gray-900 leading-tight">{user.name}</p>
              <p className="text-sm text-gray-400 mb-3 font-bold">{auth.currentUser?.email}</p>
              <button 
                onClick={() => { setTempName(user.name); setTempBio(user.bio); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-5 py-2 rounded-full border border-gray-100 bg-white text-[10px] font-black uppercase tracking-wide hover:bg-gray-50 transition-all shadow-sm"
              >
                Update Bio <Pencil size={12} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-4 pt-4 border-t border-gray-50 text-center">
            <div>
              <p className="font-black text-sm text-gray-900">{followingList.length}</p>
              <p className="text-[8px] text-gray-400 uppercase font-black">Following</p>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">{followersCount}</p>
              <p className="text-[8px] text-gray-400 uppercase font-black">Followers</p>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">0</p>
              <p className="text-[8px] text-gray-400 uppercase font-black">Views</p>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">0</p>
              <p className="text-[8px] text-gray-400 uppercase font-black">Likes</p>
            </div>
          </div>
        </div>

        {/* Public Links */}
        <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center justify-center gap-4">
          <p className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Public Links</p>
          <button className="px-6 py-3 rounded-full border-2 border-dashed border-gray-200 text-[10px] font-black text-gray-400 hover:border-[#00897B] hover:text-[#00897B] transition-all">
            Add Link +
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-3">
          {quickActions.map(({ label, icon: Icon }) => (
            <button key={label} className="flex items-center justify-between px-6 py-4 rounded-full border border-gray-50 text-[10px] font-black uppercase bg-white hover:bg-teal-50 hover:border-[#00897B] transition-all group">
              {label} <Icon size={14} className="text-gray-300 group-hover:text-[#00897B]" />
            </button>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="mt-12">
        <p className="font-black text-[10px] text-gray-400 uppercase mb-4 tracking-widest">Performance Highlights</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-[24px] border border-gray-50 shadow-sm">
              <div className="w-10 h-10 bg-[#00897B] rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-900/10">
                <Icon size={18} color="#fff" />
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed pt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full border-t border-dashed border-gray-200 my-12" />

      {/* ─── 🟢 ACTIVITIES GRID ─── */}
      <div className="max-w-3xl">
        <h3 className="text-2xl font-black text-gray-900 mb-1">Your Inkwell</h3>
        <p className="text-xs font-bold text-[#00897B] uppercase mb-10">Stories Published by You</p>
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center py-20 text-gray-200">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-black text-[10px] uppercase tracking-widest">Opening your feed...</p>
            </div>
          ) : myArticles.length > 0 ? (
            myArticles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                currentUserFollowing={followingList} 
                isOwner={true}
              />
            ))
          ) : (
            <div className="p-20 border-2 border-dashed border-gray-100 rounded-[40px] text-center bg-white shadow-sm">
              <BookOpen size={40} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-400 font-bold text-sm">Your stories will appear here. Start writing!</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[100] animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] p-8 rounded-[40px] w-full max-w-md shadow-2xl border-4 border-white animate-in zoom-in-95 duration-300">
            <div className="flex justify-end mb-4">
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
                <X size={20} className="text-gray-900" />
              </button>
            </div>
            
            <div className="space-y-6">
               <div className="text-center">
                 <h2 className="text-2xl font-black text-gray-900">Edit Profile</h2>
                 <p className="text-xs font-bold text-gray-400 uppercase mt-1">Keep your info up to date</p>
               </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Full Name</label>
                <input 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)} 
                  className="w-full p-5 rounded-[24px] border border-gray-100 outline-none focus:border-[#00897B] text-sm font-bold bg-white shadow-inner" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-4">About You</label>
                <textarea 
                  value={tempBio} 
                  onChange={(e) => setTempBio(e.target.value)} 
                  className="w-full p-5 rounded-[24px] border border-gray-100 outline-none focus:border-[#00897B] text-sm font-bold bg-white h-32 resize-none shadow-inner" 
                />
              </div>
              
              <button 
                onClick={handleSaveBio} 
                className="w-full py-5 bg-[#00897B] text-white font-black rounded-full shadow-xl hover:bg-teal-800 transition-all uppercase tracking-widest text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}