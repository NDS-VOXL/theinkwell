// app/components/ArticleCard.jsx
'use client';

import { MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function ArticleCard() {
  return (
    // 🟢 Reduced padding (p-5) and adjusted border radius (rounded-[24px]) for a tighter look
    <div className="w-full bg-[#FDFBF7] rounded-[24px] p-5 mb-6 shadow-sm">
      
      {/* 1. Header: User Info & Follow */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
             <Image src="/user-avatar.png" alt="Author" width={40} height={40} className="object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 font-lato">Adriana Giberto</h3>
            <span className="text-[11px] text-gray-400">2 hours</span>
          </div>
          {/* Follow Button */}
          <button className="bg-[#00897B] text-white text-[10px] font-bold px-3 py-1 rounded-full ml-2 hover:bg-teal-800 transition-colors">
            Follow +
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. Title & Metadata */}
      <div className="flex flex-col items-center text-center mb-5">
        {/* 🟢 Smaller Title (text-lg) */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 font-lato leading-tight">
          Easy Access to becoming a VOXL Artist
        </h2>
        
        {/* Tags */}
        <div className="flex gap-2 mb-2">
          {['Educational', 'Business', 'Entertainment'].map((tag) => (
            <span key={tag} className="bg-[#2F4F3A] text-white text-[9px] px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 font-medium">
          Read time: 3 minutes  <span className="mx-2">|</span>  3.9k readers
        </p>
      </div>

      {/* 3. Main Image */}
      {/* 🟢 Reduced Height (h-64) */}
      <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 bg-gray-200">
        <Image 
          src="/Blog-image.jpg" 
          alt="Post Content" 
          fill
          className="object-cover"
        />
        
        {/* Overlay Stats */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm border-[0.5px] border-white/30 text-white text-[10px] rounded-full flex items-center shadow-lg overflow-hidden">
           <span className="flex items-center gap-1 px-3 py-1.5 border-r-[0.5px] border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <ThumbsUp size={12} /> 3.8k
           </span>
           <span className="flex items-center gap-1 px-3 py-1.5 border-r-[0.5px] border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <ThumbsDown size={12} /> 3.8k
           </span>
           <span className="flex items-center gap-1 px-3 py-1.5 border-r-[0.5px] border-white/20 hover:bg-white/10 transition-colors cursor-pointer">
              <MessageSquare size={12} /> 723
           </span>
           <span className="flex items-center gap-1 px-3 py-1.5 hover:bg-white/10 transition-colors cursor-pointer">
              <Share2 size={12} /> 44
           </span>
        </div>
      </div>

      {/* 4. Action Buttons (Footer) */}
      <div className="flex items-center justify-between gap-3">
        <ActionButton icon={ThumbsUp} label="LIKE" />
        <ActionButton icon={ThumbsDown} label="DISLIKE" />
        <ActionButton icon={MessageSquare} label="COMMENT" />
        <ActionButton icon={Share2} label="SHARE" />
      </div>

    </div>
  );
}

// 🟢 Reduced button padding (py-2.5)
function ActionButton({ icon: Icon, label }) {
  return (
    <button className="
      flex-1 flex items-center justify-center gap-2 py-2.5 
      border border-[#00897B] 
      rounded-xl 
      bg-white
      hover:bg-[#E0F2F1] 
      group transition-all
    ">
      <Icon size={16} className="text-[#00897B] group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-bold text-[#00897B] tracking-wide">{label}</span>
    </button>
  );
}