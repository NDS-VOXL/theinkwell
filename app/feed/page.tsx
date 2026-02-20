"use client"; // 🟢 1. Mark as client component

import { useRouter } from "next/navigation"; // 🟢 2. Import router
import SideNav from "@/app/components/SideNav";
import TopHeader from "@/app/components/TopHeader";
import RightSidebar from "@/app/components/RightSidebar";
import CreatePost from "@/app/components/CreatePost";
import ArticleCard from "@/app/components/ArticleCard";

export default function FeedPage() {
  const router = useRouter(); // 🟢 3. Initialize router

  // 🟢 4. Define the Logout logic to match your Auth setup
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Clear the session
    router.push("/"); // Send user back to Login/Landing
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      
      {/* 🟢 5. Pass the handleLogout function to SideNav */}
      <SideNav onLogout={handleLogout} />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-10 py-6 pb-20">
          
          <TopHeader />
          
          <div className="flex gap-6 lg:gap-10 items-start mt-8">
            
            {/* Center Feed */}
            <div className="flex-1 min-w-0">
               <CreatePost />
               <h2 className="text-lg font-bold mb-6 text-gray-900 font-lato">Article feed</h2>
               <ArticleCard />
            </div>

            {/* Right Sidebar */}
            <div className="hidden xl:block w-[350px]">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}