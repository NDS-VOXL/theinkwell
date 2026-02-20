"use client";

import RightSidebar from '@/app/components/RightSidebar';
import CreatePost from '@/app/components/CreatePost';
import ArticleCard from '@/app/components/ArticleCard';

export default function HomePage() {
  return (
    // 🟢 Reduced top margin on mobile (mt-4 to mt-8)
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start mt-4 lg:mt-8">
      
      {/* Center Feed: Takes full width on mobile */}
      <div className="w-full flex-1 min-w-0">
        <CreatePost />
        <h2 className="text-base lg:text-lg font-bold mb-4 lg:mb-6 text-gray-900 font-lato">
          Article feed
        </h2>
        <ArticleCard />
      </div>

      {/* Right Sidebar: Remains hidden until XL screens */}
      <div className="hidden xl:block w-[350px] shrink-0">
        <RightSidebar />
      </div>
    </div>
  );
}