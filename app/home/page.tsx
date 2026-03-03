"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/app/firebase";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc 
} from "firebase/firestore";
import ArticleCard from "@/app/components/ArticleCard";
import RightSidebar from "@/app/components/RightSidebar";
import Image from "next/image";
import { useProfile } from "@/app/profile/profileContent"; 
import { ImageIcon, Loader2 } from "lucide-react";
import { Article } from "@/app/types";

export default function HomePage() {
  const { user } = useProfile();
  const [articles, setArticles] = useState<Article[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to the global Article Feed
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const unsubArticles = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(docs);
      setLoading(false);
    });

    // 2. Listen to the Current User's following list
    // This ensures the "Follow" buttons on ArticleCards stay synced
    const currentUser = auth.currentUser;
    let unsubUser = () => {};
    
    if (currentUser) {
      unsubUser = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        if (doc.exists()) {
          setFollowingList(doc.data().following || []);
        }
      });
    }

    return () => {
      unsubArticles();
      unsubUser();
    };
  }, []);

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 lg:px-0">
      
      <div className="flex justify-between gap-10 mt-2 w-full">
        
        {/* LEFT/CENTER: Article Feed */}
        <div className="flex-1 max-w-[800px]">
          
          {/* "What's on your mind" Input */}
          <div className="flex items-center gap-4 p-4 bg-white rounded-full border border-gray-100 mb-10 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-50">
               <Image 
                  src={user?.avatar || "/user-avatar.jpg"} 
                  alt="User" 
                  width={40} 
                  height={40} 
                  className="object-cover w-full h-full" 
                />
            </div>
            <input 
              type="text" 
              placeholder="What's on your mind?" 
              className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder-gray-400 bg-transparent" 
            />
            <button className="w-10 h-10 bg-[#00897B] rounded-full flex items-center justify-center text-white hover:bg-teal-800 transition-all active:scale-90">
              <ImageIcon size={18} />
            </button>
          </div>

          {/* Feed Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 font-lato uppercase tracking-tight">Article feed</h2>
            <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span className="text-[#00897B] cursor-pointer">Relevant</span>
                <span className="hover:text-gray-600 cursor-pointer">Latest</span>
            </div>
          </div>

          {/* Feed Cards */}
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="flex flex-col items-center py-20 text-gray-300">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold text-xs uppercase tracking-widest">Loading the latest stories...</p>
              </div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  currentUserFollowing={followingList} 
                />
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No articles found in the feed.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="hidden xl:block">
           <RightSidebar />
        </div>

      </div>
    </div>
  );
}