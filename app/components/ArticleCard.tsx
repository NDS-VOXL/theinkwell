"use client";

import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, MoreVertical, Share2, ThumbsDown } from 'lucide-react';
import Link from 'next/link';
import { db, auth } from "@/app/firebase";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

// 🟢 Define the shape of your article for full Type Safety
interface Article {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  categories: string[];
  imageUrl: string;
  likesCount: number;
  commentsCount: number;
  readTime: string;
}

interface ArticleCardProps {
  article: Article;
  currentUserFollowing: string[]; // Pass this from the Home feed parent
}

export default function ArticleCard({ article, currentUserFollowing }: ArticleCardProps) {
  // Local state for immediate UI feedback
  const [isFollowing, setIsFollowing] = useState(currentUserFollowing?.includes(article.authorId));

  // Helper to format counts (e.g., 1200 -> 1.2k)
  const formatCount = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return num.toString();
  };

  // Logic to handle follow actions
  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the button from triggering the Link
    if (!auth.currentUser) return;

    try {
      const myRef = doc(db, "users", auth.currentUser.uid);
      const authorRef = doc(db, "users", article.authorId);

      // Atomically update both users
      await updateDoc(myRef, { following: arrayUnion(article.authorId) });
      await updateDoc(authorRef, { followersCount: increment(1) });
      
      setIsFollowing(true);
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  return (
    <div className="w-full bg-[#FDFBF7] rounded-[32px] p-6 mb-6 shadow-sm border border-gray-100 group transition-all font-lato hover:shadow-md hover:border-[#00897B]/20">
      
      {/* 1. HEADER: Author Profile & Follow Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
            <img 
              src={article.authorAvatar || "/default-avatar.png"} 
              alt={article.authorName} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-black text-gray-900">{article.authorName}</h3>
            <span className="text-[10px] text-gray-400 font-bold">{article.readTime}</span>
          </div>
          
          {/* Hide button if already following OR if it's the user's own post */}
          {!isFollowing && auth.currentUser?.uid !== article.authorId && (
            <button 
              onClick={handleFollow} 
              className="bg-[#00897B] text-white text-[10px] px-4 py-1.5 rounded-full font-bold hover:bg-teal-800 transition-all active:scale-95"
            >
              Follow +
            </button>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. CONTENT: Title, Categories & Featured Image */}
      <Link href={`/home/article/${article.id}`} className="block">
        <h2 className="text-xl font-black mb-3 text-gray-900 group-hover:text-[#00897B] transition-colors leading-tight">
          {article.title}
        </h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories?.map(cat => (
            <span key={cat} className="bg-[#2F4F3A] text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider">
              {cat}
            </span>
          ))}
        </div>

        <div className="relative aspect-video rounded-[24px] overflow-hidden mb-5 bg-gray-100">
          <img 
            src={article.imageUrl} 
            alt="Article Banner" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </div>
      </Link>
      
      {/* 3. ACTIONS: Engagement Buttons */}
      <div className="grid grid-cols-4 gap-3">
        <button className="flex items-center justify-center gap-2 py-3 border border-[#00897B] text-[#00897B] rounded-2xl text-[10px] font-black hover:bg-teal-50 transition-all active:scale-[0.98]">
          <ThumbsUp size={14} /> {formatCount(article.likesCount)}
        </button>

        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 text-gray-400 rounded-2xl text-[10px] font-black hover:bg-gray-50 transition-all">
          <ThumbsDown size={14} />
        </button>

        <Link href={`/home/article/${article.id}#comments`} className="flex items-center justify-center gap-2 py-3 border border-[#00897B] text-[#00897B] rounded-2xl text-[10px] font-black hover:bg-teal-50 transition-all">
          <MessageSquare size={14} /> {formatCount(article.commentsCount)}
        </Link>

        <button className="flex items-center justify-center gap-2 py-3 border border-[#00897B] text-[#00897B] rounded-2xl text-[10px] font-black hover:bg-teal-50 transition-all">
          <Share2 size={14} />
        </button>
      </div>
    </div>
  );
}