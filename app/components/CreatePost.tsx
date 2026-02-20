'use client';

import { Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function CreatePost() {
  return (
    <div className="w-full bg-[#FDFBF7] rounded-[20px] lg:rounded-[30px] p-3 lg:p-4 mb-6 lg:mb-8 flex items-center gap-3 lg:gap-4 shadow-sm">
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
        <Image src="/user-avatar.png" alt="User" width={48} height={48} className="object-cover w-full h-full" />
      </div>

      <div className="flex-1">
        <input 
          type="text" 
          placeholder="What's on your mind?" 
          className="w-full bg-transparent border-b border-gray-200 pb-1.5 outline-none text-xs lg:text-sm text-gray-600 placeholder-gray-400 font-lato focus:border-[#00897B] transition-colors"
        />
      </div>

      <button className="p-2 bg-teal-800 rounded-lg text-white hover:bg-teal-700 shrink-0">
        <ImageIcon size={18} />
      </button>
    </div>
  );
}