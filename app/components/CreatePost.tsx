// app/components/CreatePost.tsx
'use client';

import { Image as ImageIcon } from 'lucide-react'; // Renamed to avoid conflict with next/image
import Image from 'next/image';


export default function CreatePost() {
  return (
    <div className="w-full bg-[#FDFBF7] rounded-[30px] p-4 mb-8 flex items-center gap-4 shadow-sm">
      {/* User Avatar */}
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
        <Image 
          src="/user-avatar.png" // Ensure this exists in public folder
          alt="User" 
          width={48} 
          height={48} 
          className="object-cover w-full h-full"
        />
      </div>

      {/* Input Field */}
      <div className="flex-1">
        <input 
          type="text" 
          placeholder="Write the first thing you think about..." 
          className="w-full bg-transparent border-b border-gray-300 pb-2 outline-none text-gray-600 placeholder-gray-400 font-lato focus:border-inkwell-teal transition-colors"
        />
      </div>

      {/* Image Upload Icon */}
      <button className="p-2 bg-teal-800 rounded-lg text-white hover:bg-teal-700 transition-colors">
        <ImageIcon size={20} />
      </button>

    </div>
  );
}