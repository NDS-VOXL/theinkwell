"use client";

import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, MessageSquare, MoreVertical, Share2, 
  ThumbsDown, Trash2, Loader2 
} from 'lucide-react';
import Link from 'next/link';
import { db, auth } from "@/app/firebase";
import { 
  doc, deleteDoc, updateDoc, onSnapshot, 
  writeBatch, arrayUnion, arrayRemove, increment 
} from "firebase/firestore";
import { Article } from '@/app/types';

interface ArticleCardProps {
  article: Article;
  currentUserFollowing: string[];
  isOwner?: boolean;
}

export default function ArticleCard({ article, currentUserFollowing, isOwner }: ArticleCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [liveAuthorData, setLiveAuthorData] = useState({ avatar: "", followers: 0 });
  const [imgError, setImgError] = useState(false);
  const userId = auth.currentUser?.uid;

  // ─── 🟢 LIVE AUTHOR DATA SYNC ───
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", article.authorId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setLiveAuthorData({
          avatar: data.avatar || "", 
          followers: data.followersCount || 0
        });
        setImgError(false); // Reset error state when new data arrives
      }
    });
    return () => unsub();
  }, [article.authorId]);

  const isFollowing = currentUserFollowing.includes(article.authorId);

  // ─── HANDLERS ───
  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (!userId) return;
    const batch = writeBatch(db);
    const myRef = doc(db, "users", userId);
    const authorRef = doc(db, "users", article.authorId);

    if (isFollowing) {
      batch.update(myRef, { following: arrayRemove(article.authorId) });
      batch.update(authorRef, { followersCount: increment(-1) });
    } else {
      batch.update(myRef, { following: arrayUnion(article.authorId) });
      batch.update(authorRef, { followersCount: increment(1) });
    }
    await batch.commit();
  };

  const handleEngagement = async (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.preventDefault(); e.stopPropagation();
    if (!userId) return;
    const articleRef = doc(db, "articles", article.id);
    const likes = article.likes || [];
    const dislikes = article.dislikes || [];

    if (type === 'like') {
      const newLikes = likes.includes(userId) ? likes.filter(id => id !== userId) : [...likes, userId];
      await updateDoc(articleRef, { 
        likes: newLikes, 
        likesCount: newLikes.length, 
        dislikes: dislikes.filter(id => id !== userId), 
        dislikesCount: dislikes.filter(id => id !== userId).length 
      });
    } else {
      const newDislikes = dislikes.includes(userId) ? dislikes.filter(id => id !== userId) : [...dislikes, userId];
      await updateDoc(articleRef, { 
        dislikes: newDislikes, 
        dislikesCount: newDislikes.length, 
        likes: likes.filter(id => id !== userId), 
        likesCount: likes.filter(id => id !== userId).length 
      });
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm("Delete this story permanently?")) {
      setIsDeleting(true);
      try {
        await deleteDoc(doc(db, "articles", article.id));
      } catch (err) {
        console.error("Delete error:", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Determine which image to show (Live Data > Article Snapshot > None)
  const profileImage = liveAuthorData.avatar || article.authorAvatar;

  return (
    <div className={`w-full bg-white rounded-[32px] p-6 mb-8 border border-gray-100 shadow-sm font-lato transition-all hover:shadow-md ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      
      {/* ─── 🟢 HEADER: AVATAR & AUTHOR INFO ─── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          
          {/* AVATAR RENDERING LOGIC */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-gray-50 shrink-0">
            {profileImage && !imgError ? (
              // Show actual image if it exists and hasn't errored
              <img 
                src={profileImage} 
                className="w-full h-full object-cover" 
                alt={article.authorName} 
                onError={() => setImgError(true)} // If image link is broken, trigger fallback
              />
            ) : (
              // Fallback to blue circle with initial
              <div className="w-full h-full bg-[#005A8D] flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {article.authorName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-[15px] font-black text-[#0A1F44] leading-tight">
              {article.authorName}
            </h3>
            <span className="text-[10px] text-[#00897B] font-bold mt-0.5 uppercase tracking-wide">
              {liveAuthorData.followers} Followers
            </span>
          </div>

          {/* Follow Button */}
          {userId !== article.authorId && (
            <button 
              onClick={handleFollow} 
              className={`ml-2 text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-wider transition-all shadow-sm ${
                isFollowing 
                ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                : 'bg-[#00897B] text-white hover:bg-teal-800'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow +'}
            </button>
          )}
        </div>

        {/* Options */}
        <div className="flex gap-2">
          {isOwner && (
            <button 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="text-red-400 p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          )}
          <button className="text-gray-300 hover:text-gray-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* ─── 🟢 ARTICLE BODY ─── */}
      <Link href={`/home/article/${article.id}`} className="group">
        <div className="text-center mb-6 px-4">
          <h2 className="text-[24px] font-black text-[#0A1F44] group-hover:text-[#00897B] transition-colors leading-tight">
            {article.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
            <span>{article.readTime}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full" />
            <span>{article.likesCount || 0} Likes</span>
          </div>
        </div>
        
        <div className="aspect-video rounded-[28px] overflow-hidden mb-6 border border-gray-50 shadow-inner bg-gray-50">
          <img 
            src={article.imageUrl} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt="Article Banner" 
          />
        </div>
      </Link>

      {/* ─── 🟢 INTERACTION BAR ─── */}
      <div className="flex items-center justify-around pt-5 border-t border-dashed border-gray-100">
        <button 
          onClick={(e) => handleEngagement(e, 'like')} 
          className={`flex items-center gap-2 text-[10px] font-black transition-colors ${
            article.likes?.includes(userId || "") ? 'text-[#00897B]' : 'text-gray-400'
          }`}
        >
          <ThumbsUp size={18} className={article.likes?.includes(userId || "") ? "fill-[#00897B]" : ""} /> 
          LIKE {article.likesCount || 0}
        </button>

        <button 
          onClick={(e) => handleEngagement(e, 'dislike')} 
          className={`flex items-center gap-2 text-[10px] font-black transition-colors ${
            article.dislikes?.includes(userId || "") ? 'text-red-400' : 'text-gray-400'
          }`}
        >
          <ThumbsDown size={18} className={article.dislikes?.includes(userId || "") ? "fill-red-400" : ""} /> 
          DISLIKE
        </button>

        <Link 
          href={`/home/article/${article.id}`} 
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#00897B] transition-colors"
        >
          <MessageSquare size={18} /> COMMENT
        </Link>

        <button className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#00897B] transition-colors">
          <Share2 size={18} /> SHARE
        </button>
      </div>
    </div>
  );
}