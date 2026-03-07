'use client';

import { Search, ChevronDown, Plus, X, User as UserIcon, Settings, LogOut, FileText } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProfile } from '@/app/profile/profileContent';

// 🟢 1. Import Firebase Auth and the signOut method
import { auth } from '@/app/firebase';
import { signOut } from 'firebase/auth';

export default function TopHeader() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useProfile(); 

  const isCreatePage = pathname === '/create-article';

  // ─── 🟢 2. THE LOGOUT ENGINE ───
  const handleLogout = async () => {
    try {
      // Step A: Tell Firebase to invalidate the session token on the server
      // This is the "Backend" logout.
      await signOut(auth);

      // Step B: Clear the local gatekeeper
      localStorage.removeItem('isLoggedIn');
      
      // Step C: Close the modal
      setIsModalOpen(false);

      // Step D: Redirect to the Landing page
      // .replace is safer than .push because it clears the history stack
      router.replace('/');
      
    } catch (error: unknown) {
      // Even if the network fails, we want the user to feel logged out
      console.error("Logout error:", error);
      localStorage.removeItem('isLoggedIn');
      router.replace('/');
    }
  };

  // Safe fallback for the initial (e.g., 'U' for Uchenna)
  const firstInitial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <header className="flex items-center justify-between w-full py-2 mb-8 gap-4 relative z-40">
        
        {/* Search Bar */}
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
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap group-hover:text-[#00897B] transition-colors">All Categories</span>
            <ChevronDown className="text-gray-400 w-4 h-4 group-hover:text-[#00897B] transition-colors" />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center shrink-0">
          <div className={`flex items-center gap-5 transition-all duration-500 ease-in-out origin-right ${isSearchFocused ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 ml-8'}`}>
            {!isCreatePage && (
              <Link href="/create-article">
                <button className="flex items-center gap-2 text-white px-6 py-3 rounded-full shadow-md bg-[#00897B] hover:bg-teal-800 transition-all active:scale-95">
                  <Plus size={18} strokeWidth={3} />
                  <span className="text-sm font-bold whitespace-nowrap font-lato">Create an Article</span>
                </button>
              </Link>
            )}
            <button className="flex items-center px-6 py-3 rounded-full border-2 border-[#00897B] bg-[#ffffff] text-[#00897B] hover:bg-teal-50 transition-all active:scale-95 whitespace-nowrap font-lato text-sm font-bold">
              Ask Question ?
            </button>
          </div>

          {/* Profile Trigger */}
          <div 
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-full overflow-hidden shadow-sm cursor-pointer ml-4 hover:ring-4 hover:ring-[#00897B]/30 transition-all shrink-0 bg-gray-200 flex items-center justify-center border border-gray-100"
          >
            {user.avatar ? (
              <Image src={user.avatar} alt="User Profile" width={48} height={48} className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-500 font-bold text-lg">{firstInitial}</span>
            )}
          </div>
        </div>
      </header>

      {/* ─── PROFILE MODAL ─── */}
      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FDFBF7] w-full max-w-sm p-6 rounded-[32px] shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20"
          >
            <div className="flex justify-end mb-2">
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors p-1 bg-gray-100 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md mb-3 border-2 border-white bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-500 font-bold text-3xl">{firstInitial}</span>
                )}
              </div>
              <h2 className="text-xl font-black text-gray-900">{user.name || "Inkwell Writer"}</h2>
              <p className="text-xs text-[#00897B] font-bold mt-1">
                {auth.currentUser?.email || "Signed in with Google"}
              </p>
            </div>

            <div className="space-y-3">
              {/* Profile Link */}
              <Link href="/home/profile" onClick={() => setIsModalOpen(false)}>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#00897B] hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 text-gray-700 group-hover:text-[#00897B]">
                    <UserIcon size={18} />
                    <span className="text-sm font-bold">View Profile</span>
                  </div>
                </div>
              </Link>

              {/* 🟢 3. LOGOUT BUTTON */}
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