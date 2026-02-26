'use client';

import { useState } from 'react';
import { MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ArticleCard() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (!isDisliked) setIsLiked(false);
  };

  return (
    <div className="w-full bg-[#FDFBF7] rounded-[24px] p-4 lg:p-5 mb-6 shadow-sm border border-gray-100 relative group hover:shadow-md hover:border-[#00897B]/30 transition-all">
      
      {/* The "Stretched Link" */}
      <Link href="/article" className="absolute inset-0 z-10" aria-label="Read full article" />

      {/* 1. Header: User Info */}
      <div className="flex items-center justify-between mb-3 relative z-20">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden border border-gray-200 shrink-0">
             <Image src="/user-avatar.png" alt="Author" width={40} height={40} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-xs lg:text-sm font-bold text-gray-900 font-lato truncate max-w-[100px] sm:max-w-none">
              Adriana Giberto
            </h3>
            <span className="text-[10px] text-gray-400">2 hours</span>
          </div>
          
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-[9px] font-bold px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
              isFollowing 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-[#00897B] text-white hover:bg-teal-800'
            }`}
          >
            {isFollowing ? 'Following ✓' : 'Follow +'}
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. Title & Metadata */}
      <div className="flex flex-col items-center text-center mb-4 px-2">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-2 font-lato leading-tight group-hover:text-[#00897B] transition-colors relative z-20 pointer-events-none">
          Easy Access to becoming a VOXL Artist
        </h2>
        
        <div className="flex flex-wrap justify-center gap-1.5 mb-2 relative z-20">
          {['Educational', 'Business', 'Entertainment'].map((tag) => (
            <span key={tag} className="bg-[#2F4F3A] text-white text-[8px] px-2 py-0.5 rounded-full font-medium hover:bg-teal-900 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-gray-500 font-medium">
          Read time: 3 mins <span className="mx-1">|</span> 3.9k readers
        </p>
      </div>

      {/* 3. Main Image */}
      <div className="relative w-full aspect-video sm:h-64 rounded-xl overflow-hidden mb-4 bg-gray-200 pointer-events-none">
        <Image src="/Blog-image.jpg" alt="Post" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm border-[0.5px] border-white/30 text-white text-[9px] rounded-full flex items-center shadow-lg">
           <span className="flex items-center gap-1 px-2 py-1 border-r-[0.5px] border-white/20">
              <ThumbsUp size={10} className={isLiked ? "fill-white" : ""} /> 3.8k
           </span>
           <span className="flex items-center gap-1 px-2 py-1">
              <MessageSquare size={10} /> 723
           </span>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="grid grid-cols-2 md:flex items-center justify-between gap-2 lg:gap-3 relative z-20">
        <ActionButton icon={ThumbsUp} label="LIKE" isActive={isLiked} onClick={handleLike} />
        <ActionButton icon={ThumbsDown} label="DISLIKE" isActive={isDisliked} onClick={handleDislike} />
        <ActionButton icon={MessageSquare} label="COMMENT" />
        <ActionButton icon={Share2} label="SHARE" />
      </div>

    </div>
  );
}

// 🟢 Standard JavaScript function (No TypeScript Interface needed)
function ActionButton({ icon: Icon, label, isActive = false, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 py-2 lg:py-2.5 border rounded-xl transition-all cursor-pointer ${
        isActive 
          ? 'bg-[#00897B] border-[#00897B] text-white shadow-md' 
          : 'bg-white border-[#00897B] text-[#00897B] hover:bg-[#E0F2F1]'
      }`}
    >
      <Icon size={14} className={isActive ? 'text-white fill-white' : 'text-[#00897B]'} />
      <span className={`text-[9px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-[#00897B]'}`}>
        {label}
      </span>
    </button>
  );
}