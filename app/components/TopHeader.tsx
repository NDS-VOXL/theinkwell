'use client';

import { Search, ChevronDown, Plus, X, User as UserIcon, Settings, LogOut, FileText } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '../../app/profile/profileContent';

export default function TopHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 🟢 Modal State
  
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useProfile(); // 🟢 Global user data

  const isCreatePage = pathname === '/create-article';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsModalOpen(false);
    router.push('/');
  };

  return (
    <>
      <header className="flex items-center justify-between w-full py-2 mb-8 gap-4 relative z-40">
        
        {/* Search Bar Section */}
        <div className={`flex items-center bg-white border-[0.5px] border-gray-400 rounded-full pl-2 pr-6 h-[54px] shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${isSearchFocused ? 'w-full' : 'w-full max-w-4xl'}`}>
          <div className="flex items-center justify-center w-9 h-9 bg-[#5F6368] rounded-full mr-3 shrink-0">
            <Search className="text-white w-4 h-4" strokeWidth={2.5} />
          </div>
          
          <input 
            type="text" 
            placeholder="Search Articles..." 
            className="flex-1 bg-transparent border-none outline-none text-gray-600 placeholder-gray-400 text-sm font-lato h-full"
            onFocus={() => setIsSearchFocused(true)} 
            onBlur={() => setIsSearchFocused(false)} 
          />
          
          <div className="h-full w-[1px] bg-gray-300 mx-4"></div>

          <div className="flex items-center cursor-pointer gap-2 group h-full">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap group-hover:text-inkwell-teal transition-colors">All Categories</span>
            <ChevronDown className="text-gray-400 w-4 h-4 group-hover:text-inkwell-teal transition-colors" />
          </div>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center shrink-0">
          <div className={`flex items-center gap-5 transition-all duration-500 ease-in-out origin-right ${isSearchFocused ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 ml-8'}`}>
            {!isCreatePage && (
              <Link href="/create-article">
                <button className="flex items-center gap-2 text-white px-6 py-3 rounded-full shadow-md bg-[#008080] hover:bg-teal-800 transition-all active:scale-95">
                  <Plus size={18} strokeWidth={3} />
                  <span className="text-sm font-bold whitespace-nowrap font-lato">Create an Article</span>
                </button>
              </Link>
            )}

            <button className="flex items-center px-6 py-3 rounded-full border-2 border-[#008080] bg-[#ffffff] text-inkwell-teal hover:bg-teal-100 transition-all active:scale-95 whitespace-nowrap">
              <span className="text-sm font-bold font-lato text-[#008080]">Ask Question ?</span>
            </button>
          </div>

          {/* 🟢 User Profile Trigger */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-full overflow-hidden shadow-sm cursor-pointer ml-4 hover:ring-4 hover:ring-[#008080]/30 transition-all shrink-0"
          >
             <Image 
               src={user.avatar} 
               alt="User Profile" 
               width={48} 
               height={48} 
               className="object-cover w-full h-full"
             />
          </div>
        </div>
      </header>

      {/* 🟢 CENTRALIZED PROFILE MODAL */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)} // Close when clicking background
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        >
          {/* Modal Container */}
          <div 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            className="bg-[#FDFBF7] w-full max-w-sm p-6 rounded-[32px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20"
          >
            {/* Header & Close Button */}
            <div className="flex justify-end mb-2">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                <X size={18} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md mb-3 border-2 border-white">
                <Image src={user.avatar} alt="Profile" width={80} height={80} className="object-cover w-full h-full" />
              </div>
              <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
              <p className="text-xs text-[#008080] font-bold mt-1">@expert_writer</p>
            </div>

            {/* Quick Tools Grid */}
            <div className="space-y-3">
              <Link href="/home/profile" onClick={() => setIsModalOpen(false)}>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#008080] hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#008080] transition-colors">
                    <UserIcon size={18} />
                    <span className="text-sm font-bold">View Profile</span>
                  </div>
                </div>
              </Link>

              <Link href="/create-article" onClick={() => setIsModalOpen(false)}>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#008080] hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#008080] transition-colors">
                    <FileText size={18} />
                    <span className="text-sm font-bold">Write an Article</span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#008080] hover:shadow-md transition-all group cursor-pointer">
                <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#008080] transition-colors">
                  <Settings size={18} />
                  <span className="text-sm font-bold">Account Settings</span>
                </div>
              </div>

              {/* Log Out Button */}
              <button 
                onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] font-bold text-sm"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}