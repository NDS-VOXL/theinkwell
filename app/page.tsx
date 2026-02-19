"use client";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import SideNav from "./components/SideNav"; // Import SideNav here
import TopHeader from './components/TopHeader';
import RightSidebar from './components/RightSidebar';
import CreatePost from './components/CreatePost';
import ArticleCard from './components/ArticleCard';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleSplashComplete = () => setShowSplash(false);
  
  const handleLogin = () => setIsAuthenticated(true);
  const handleRegister = () => setIsAuthenticated(true);

  // 1. SPLASH STATE
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // 2. AUTH STATE (No SideNav here)
  if (!isAuthenticated) {
    return (
      <AuthScreen 
        mode={authMode} 
        onModeChange={setAuthMode} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
      />
    );
  }

  // 3. BLOG STATE (SideNav included, CSS structure fixed)
  return (
    // overflow-hidden on the parent prevents the "outer" scrollbar
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      
      {/* Sidebar is fixed and won't scroll */}
      <SideNav />

      {/* Main content is the ONLY scrollable area. overflow-x-hidden kills the bottom bar */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
        
        {/* We use a container with responsive padding to prevent horizontal overflow */}
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-10 py-6 pb-20">
          
          <TopHeader />
          
          <div className="flex gap-6 lg:gap-10 items-start mt-8">
            
            {/* Center Feed: min-w-0 is vital to prevent flex-children from expanding */}
            <div className="flex-1 min-w-0">
          
               <CreatePost />
               <h2 className="text-lg font-bold mb-6 text-gray-900 font-lato">Article feed</h2>
               <ArticleCard />
               {/* Add more cards here as you build */}
            </div>

            {/* Right Sidebar: Hidden or adjusted on smaller screens if needed */}
            <div className="hidden xl:block w-[350px]">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>

    </div>
  );

}