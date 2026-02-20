'use client';

import { MoreVertical, ThumbsUp, ThumbsDown, MessageSquare, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function ArticleCard() {
  return (
    <div className="w-full bg-[#FDFBF7] rounded-[24px] p-4 lg:p-5 mb-6 shadow-sm border border-gray-100">
      
      {/* 1. Header: User Info */}
      <div className="flex items-center justify-between mb-3">
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
          <button className="bg-[#00897B] text-white text-[9px] font-bold px-2.5 py-1 rounded-full hover:bg-teal-800 transition-colors">
            Follow +
          </button>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* 2. Title & Metadata */}
      <div className="flex flex-col items-center text-center mb-4 px-2">
        <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-2 font-lato leading-tight">
          Easy Access to becoming a VOXL Artist
        </h2>
        
        <div className="flex flex-wrap justify-center gap-1.5 mb-2">
          {['Educational', 'Business', 'Entertainment'].map((tag) => (
            <span key={tag} className="bg-[#2F4F3A] text-white text-[8px] px-2 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[10px] text-gray-500 font-medium">
          Read time: 3 mins <span className="mx-1">|</span> 3.9k readers
        </p>
      </div>

      {/* 3. Main Image: Responsive Aspect Ratio */}
      <div className="relative w-full aspect-video sm:h-64 rounded-xl overflow-hidden mb-4 bg-gray-200">
        <Image src="/Blog-image.jpg" alt="Post" fill className="object-cover" />
        
        {/* Mobile Stats Overlay: Scaled down */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm border-[0.5px] border-white/30 text-white text-[9px] rounded-full flex items-center shadow-lg">
           <span className="flex items-center gap-1 px-2 py-1 border-r-[0.5px] border-white/20">
              <ThumbsUp size={10} /> 3.8k
           </span>
           <span className="flex items-center gap-1 px-2 py-1">
              <MessageSquare size={10} /> 723
           </span>
        </div>
      </div>

      {/* 4. Action Buttons: 🟢 Grid on Mobile, Flex on Desktop */}
      <div className="grid grid-cols-2 md:flex items-center justify-between gap-2 lg:gap-3">
        <ActionButton icon={ThumbsUp} label="LIKE" />
        <ActionButton icon={ThumbsDown} label="DISLIKE" />
        <ActionButton icon={MessageSquare} label="COMMENT" />
        <ActionButton icon={Share2} label="SHARE" />
      </div>

    </div>
  );
}

// Remove the : { icon: any, label: string } part
function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex flex-1 items-center justify-center gap-1.5 py-2 lg:py-2.5 border border-[#00897B] rounded-xl bg-white hover:bg-[#E0F2F1] transition-all">
      <Icon size={14} className="text-[#00897B]" />
      <span className="text-[9px] font-bold text-[#00897B] tracking-tight">{label}</span>
    </button>
  );
}