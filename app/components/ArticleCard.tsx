"use client";

import React, { useState } from 'react';
import { 
  ThumbsUp, MessageSquare, MoreVertical, Share2, 
  ThumbsDown, Trash2, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { db, auth } from "@/app/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { Article } from '@/app/types';

interface ArticleCardProps {
  article: Article;
  isOwner?: boolean;
}

export default function ArticleCard({ article, isOwner }: ArticleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const userId = auth.currentUser?.uid;

  // --- 🟢 ROBUST LIKE / DISLIKE LOGIC ---
  const handleEngagement = async (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;

    const articleRef = doc(db, "articles", article.id);
    
    // Ensure we are working with arrays (default to empty if they don't exist yet)
    const currentLikes = article.likes || [];
    const currentDislikes = article.dislikes || [];
    
    let newLikes = [...currentLikes];
    let newDislikes = [...currentDislikes];

    if (type === 'like') {
      // 1. Toggle Like: If already liked, remove it. If not, add it.
      if (newLikes.includes(userId)) {
        newLikes = newLikes.filter(id => id !== userId);
      } else {
        newLikes.push(userId);
      }
      // 2. Always remove from Dislikes if Liking
      newDislikes = newDislikes.filter(id => id !== userId);
    } else {
      // 1. Toggle Dislike: If already disliked, remove it. If not, add it.
      if (newDislikes.includes(userId)) {
        newDislikes = newDislikes.filter(id => id !== userId);
      } else {
        newDislikes.push(userId);
      }
      // 2. Always remove from Likes if Disliking
      newLikes = newLikes.filter(id => id !== userId);
    }

    try {
      // 🟢 Update Firestore with CALCULATED lengths (prevents -1)
      await updateDoc(articleRef, {
        likes: newLikes,
        likesCount: newLikes.length,
        dislikes: newDislikes,
        dislikesCount: newDislikes.length
      });
    } catch (err) {
      console.error("Engagement error:", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this story permanently?")) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, "articles", article.id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const userHasLiked = article.likes?.includes(userId || "");
  const userHasDisliked = article.dislikes?.includes(userId || "");

  return (
    <div className={`w-full bg-white rounded-[32px] p-6 mb-8 border border-gray-100 transition-all hover:shadow-md font-lato ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      
      {/* Header: Author & Follow */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <img src={article.authorAvatar || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" alt="Author" />
          <div className="flex flex-col">
            <h3 className="text-[13px] font-black text-gray-900 leading-tight">{article.authorName}</h3>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Just Now</span>
          </div>
          {userId !== article.authorId && (
            <button className="ml-2 bg-[#00897B] text-white text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider">
              Follow +
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <button onClick={handleDelete} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all">
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          )}
          <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Content */}
      <Link href={`/home/article/${article.id}`} className="group">
        <div className="text-center mb-5 px-4">
          <h2 className="text-[22px] font-black mb-2 text-gray-900 group-hover:text-[#00897B] transition-colors leading-tight">
            {article.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
            <span>{article.readTime}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span>{article.likesCount || 0} Likes</span>
          </div>
        </div>

        <div className="aspect-[16/9] rounded-[28px] overflow-hidden mb-6 shadow-sm border border-gray-50">
          <img src={article.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Banner" />
        </div>
      </Link>

      {/* 🟢 INTERACTION BAR (Dashed Border) */}
      <div className="flex items-center justify-around pt-5 border-t border-dashed border-gray-100">
        <button 
          onClick={(e) => handleEngagement(e, 'like')}
          className={`flex items-center gap-2 text-[10px] font-black transition-all ${userHasLiked ? 'text-[#00897B]' : 'text-gray-400'}`}
        >
          <ThumbsUp size={18} className={userHasLiked ? "fill-[#00897B]" : ""} />
          LIKE
          <span className="ml-0.5 font-black">{article.likesCount || 0}</span>
        </button>

        <button 
          onClick={(e) => handleEngagement(e, 'dislike')}
          className={`flex items-center gap-2 text-[10px] font-black transition-all ${userHasDisliked ? 'text-red-400' : 'text-gray-400'}`}
        >
          <ThumbsDown size={18} className={userHasDisliked ? "fill-red-400" : ""} />
          DISLIKE
          <span className="ml-0.5 font-black">{article.dislikesCount || 0}</span>
        </button>

        <Link href={`/home/article/${article.id}`} className="flex items-center gap-2 text-[10px] font-black text-gray-400">
          <MessageSquare size={18} />
          COMMENT
        </Link>

        <button className="flex items-center gap-2 text-[10px] font-black text-gray-400">
          <Share2 size={18} />
          SHARE
        </button>
      </div>
    </div>
  );
}