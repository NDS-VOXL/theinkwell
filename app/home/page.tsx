"use client";

import RightSidebar from '@/app/components/RightSidebar';
import CreatePost from '@/app/components/CreatePost';
import ArticleCard from '@/app/components/ArticleCard';

export default function HomePage() {
  return (
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
  );
}