'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Renamed to isChecking to make the logic easier to read
  const [isChecking, setIsChecking] = useState(true); 

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      // Add any other public pages you create here!
      const publicRoutes = ['/', '/signup', '/forgot-password'];

      if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        // 🟢 1. Use replace instead of push for auth redirects
        router.replace('/'); 
      } else {
        // 🟢 2. The Fix: Pushes the state update to the next tick to prevent the cascading render warning
        setTimeout(() => {
          setIsChecking(false);
        }, 0);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Prevent the "Flash of Unauthenticated Content"
  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-pulse font-black text-[#00897B] text-xl">Loading Inkwell...</div>
      </div>
    );
  }

  return <>{children}</>;
}