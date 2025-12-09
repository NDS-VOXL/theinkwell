// app/page.tsx
import TopHeader from './components/TopHeader';
import RightSidebar from './components/RightSidebar';
import CreatePost from './components/CreatePost';
import ArticleCard from './components/ArticleCard';

export default function Home() {
  return (
    // 🟢 'max-w-[1200px]' restricts width, 'mx-auto' centers it horizontally
    <div className="flex flex-col w-full max-w-[1200px] mx-auto pb-10">
      
      {/* Header */}
      <TopHeader />

      {/* Main Grid Layout */}
      <div className="flex gap-10 items-start">
        
        {/* CENTER COLUMN: Feed (Grows to fill space) */}
        <div className="flex-1 min-w-0"> {/* min-w-0 prevents flexbox overflow bugs */}
          <CreatePost />

          <h2 className="text-lg font-bold mb-6 text-gray-900 font-lato">Article feed</h2>
          
          <ArticleCard />
          {/* Add more cards here if needed */}
        </div>

        {/* RIGHT COLUMN: Sidebar (Fixed Width) */}
        <RightSidebar />
        
      </div>
      
    </div>
  );
}