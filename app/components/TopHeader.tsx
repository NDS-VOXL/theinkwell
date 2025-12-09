// app/components/TopHeader.tsx
'use client';

import { Search, ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';

export default function TopHeader() {
  return (
    <header className="flex items-center justify-between w-full py-2 mb-8">
      
      {/* 1. Search Bar Section */}
      {/* 🟢 Changes: Removed 'py-2', added 'h-[54px]', added 'overflow-hidden' */}
      <div className="flex items-center w-full max-w-4xl bg-white border-[0.5px] border-gray-400 rounded-full pl-2 pr-6 h-[54px] shadow-sm overflow-hidden">
        
        {/* Search Icon Circle */}
        <div className="flex items-center justify-center w-9 h-9 bg-[#5F6368] rounded-full mr-3 shrink-0">
          <Search className="text-white w-4 h-4" strokeWidth={2.5} />
        </div>
        
        {/* Input Field */}
        <input 
          type="text" 
          placeholder="Search Articles..." 
          className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-400 text-sm font-lato h-full"
        />
        
        {/* Vertical Divider */}
        {/* 🟢 Change: Changed 'h-10' to 'h-full' */}
        <div className="h-full w-[1px] bg-gray-300 mx-4"></div>

        {/* Category Dropdown Trigger */}
        <div className="flex items-center cursor-pointer gap-2 group h-full">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap group-hover:text-inkwell-teal transition-colors">All Categories</span>
          <ChevronDown className="text-gray-400 w-4 h-4 group-hover:text-inkwell-teal transition-colors" />
        </div>
      </div>

      {/* 2. Action Buttons & Profile */}
      <div className="flex items-center gap-5 ml-8 shrink-0">
        
        {/* 'Create an Article' Button */}
        <button className="flex items-center gap-2  text-white px-6 py-3 rounded-full shadow-md bg-[#008080] hover:bg-teal-800 transition-all active:scale-95">
          <Plus size={18} strokeWidth={3} />
          <span className="text-sm font-bold whitespace-nowrap font-lato">Create an Article</span>
        </button>

        {/* 'Ask Question' Button */}
        <button className="flex items-center px-6 py-3 rounded-full border-2 border-[#008080] bg-[#ffffff] text-inkwell-teal hover:bg-teal-100 transition-all active:scale-95 whitespace-nowrap">
          <span className="text-sm font-bold font-lato text-[#008080]">Ask Question ?</span>
        </button>

        {/* User Profile Image */}
        <div className="w-12 h-12 rounded-full overflow-hidden  shadow-sm cursor-pointer ml-2 hover:ring-2 hover:ring-inkwell-teal transition-all">
           <Image 
             src="/user-avatar.jpg" 
             alt="User Profile" 
             width={48} 
             height={48} 
             className="object-cover w-full h-full"
           />
        </div>

      </div>
    </header>
  );
}