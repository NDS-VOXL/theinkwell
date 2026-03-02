"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { useProfile } from "@/app/profile/profileContent"; 
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ArticleCard from "@/app/components/ArticleCard";
import RightSidebar from "@/app/components/RightSidebar";
import { Article } from "@/app/types"; // 🟢 Ensure your types are imported

export default function HomePage() {
  const { user } = useProfile();
  const [articles, setArticles] = useState<Article[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the logged-in user's following list to sync "Follow" buttons
    const fetchUserStats = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFollowingList(userSnap.data().following || []);
        }
      }
    };

    // 2. Real-time Feed: Fetch ALL articles from EVERYONE, newest first
    const articlesQuery = query(
      collection(db, "articles"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(articlesQuery, (snapshot) => {
      const fetchedArticles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      
      setArticles(fetchedArticles);
      setLoading(false);
    });

    fetchUserStats();
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto font-lato">
      
      <div className="flex justify-between gap-10 mt-2 w-full">
        
        {/* LEFT/CENTER: Article Feed */}
        <div className="flex-1 max-w-[800px]">
          
          {/* "What's on your mind" Input */}
          <Link href="/home/create-article">
            <div className="flex items-center gap-4 p-4 bg-white rounded-full border border-gray-100 mb-10 shadow-sm hover:border-[#00897B]/30 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 border border-gray-100">
                 <Image 
                    src={user?.avatar || "/user-avatar.jpg"} 
                    alt="User" 
                    width={40} 
                    height={40} 
                    className="object-cover w-full h-full" 
                 />
              </div>
              <p className="flex-1 text-sm text-gray-400">What's on your mind, {user?.name?.split(' ')[0]}?</p>
              <button className="w-10 h-10 bg-[#00897B] rounded-full flex items-center justify-center text-white group-hover:bg-teal-800 transition-colors">
                <ImageIcon size={18} />
              </button>
            </div>
          </Link>

          {/* Feed Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Article feed</h2>
            <div className="h-[2px] flex-1 bg-gray-100 ml-4 rounded-full" />
          </div>

          {/* 🟢 THE DYNAMIC FEED */}
          <div className="flex flex-col gap-6">
            {loading ? (
              <div className="flex flex-col items-center py-20 text-gray-300">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p className="font-bold text-sm">Loading the latest stories...</p>
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
              <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">The Inkwell is empty. Be the first to share a story!</p>
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