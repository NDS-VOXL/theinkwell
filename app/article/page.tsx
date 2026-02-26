"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, MoreVertical, ThumbsUp, 
  ThumbsDown, MessageSquare, Share2, Send 
} from "lucide-react";
import { useProfile } from "../profile/profileContent"; 

import TopHeader from "@/app/components/TopHeader";
import SideNav from "@/app/components/SideNav";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const articleData = {
  author: {
    name: "Adriana Gilberto",
    time: "2 hours ago",
    avatar: "/user-avatar.jpg" 
  },
  title: "Easy Access to becoming a VOXL Artist",
  readTime: "3 mins",
  readers: "3.9k",
  tags: ["Educational", "Business", "Entertainment"],
  heroImage: "/Blog-image.jpg", 
};

const comments = [
  {
    id: 1,
    author: "Felly James",
    time: "1 day ago",
    avatar: "/user-avatar.jpg",
    content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
    likes: 364,
    dislikes: 12
  },
  {
    id: 2,
    author: "Loveren Paul",
    time: "2 days ago",
    avatar: "/user-avatar.jpg",
    content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    likes: 24,
    dislikes: 2
  }
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function ArticleDetailsPage() {
  const { user } = useProfile(); 
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <div className="flex bg-surface min-h-screen">
      
      {/* 1. Left Sidebar */}
      <SideNav onLogout={handleLogout} />

      {/* 2. Main Content Area */}
      <main className="flex-1 px-8 py-6 relative">
        
        {/* Top Navigation */}
        <TopHeader />

        {/* Article Content Wrapper */}
        <div className="w-full pb-32 font-lato">
          <article className="max-w-[800px] mx-auto bg-[#FDFBF7] sm:bg-transparent p-4 sm:p-0">
            
            {/* Header (Back, Author, Follow) */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  
                  {/* Back Button routes to Home */}
                  <Link href="/home" className="p-2 hover:bg-gray-200 rounded-full transition-colors text-[#00897B]">
                    <ArrowLeft size={24} />
                  </Link>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image src={articleData.author.avatar} alt="Author" width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm text-gray-900">{articleData.author.name}</h3>
                      <span className="text-[11px] text-gray-400">{articleData.author.time}</span>
                    </div>
                  </div>
                </div>
                
                <button className="text-[#00897B] p-2 hover:bg-teal-50 rounded-full transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Full Width Follow Button */}
              <button className="w-full py-3 bg-[#00897B] text-white text-xs font-bold rounded-full shadow-md hover:bg-teal-800 transition-colors">
                Follow +
              </button>
            </div>

            {/* Title & Meta */}
            <div className="text-center mb-8 px-4">
              <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
                {articleData.title}
              </h1>
              
              <p className="text-xs text-gray-500 font-medium mb-4">
                Read time: {articleData.readTime} <span className="mx-2">|</span> {articleData.readers} readers
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                {articleData.tags.map((tag) => (
                  <span key={tag} className="bg-[#1A3A2A] text-white text-[10px] px-4 py-1.5 rounded-full font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="w-full aspect-[2/1] rounded-[24px] overflow-hidden relative mb-10 shadow-sm">
              <Image src={articleData.heroImage} alt="Cover" fill className="object-cover" />
            </div>

            {/* Article Body */}
            <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed font-medium">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What is VOXL Streaming App?</h3>
              <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              </p>
              <p className="mb-10">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
              </p>

              {/* Inline Image Grid */}
              <div className="flex flex-col gap-4 mb-10">
                <div className="w-full h-32 md:h-48 bg-gray-900 rounded-2xl overflow-hidden relative">
                   <Image src="/Blog-image.jpg" alt="UI" fill className="object-cover opacity-80" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
                    <Image src="/Blog-image.jpg" alt="Img 1" fill className="object-cover" />
                  </div>
                  <div className="w-full aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
                    <Image src="/Blog-image.jpg" alt="Img 2" fill className="object-cover" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Why VOXL will always be better?</h3>
              <p className="mb-6">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
              </p>

              <div className="flex flex-wrap gap-2 text-[#00897B] text-xs font-bold mt-8">
                <Link href="#" className="hover:underline">#UXDesign</Link>
                <Link href="#" className="hover:underline">#StreamingApp</Link>
                <Link href="#" className="hover:underline">#VOXL</Link>
                <Link href="#" className="hover:underline">#Music</Link>
              </div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-4 gap-2 my-10 py-6 border-y border-dashed border-gray-300">
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#00897B] hover:bg-teal-50 py-3 rounded-2xl transition-colors">
                <ThumbsUp size={16} /> <span className="hidden sm:inline">LIKE</span>
              </button>
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#00897B] hover:bg-teal-50 py-3 rounded-2xl transition-colors">
                <ThumbsDown size={16} /> <span className="hidden sm:inline">DISLIKE</span>
              </button>
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#00897B] hover:bg-teal-50 py-3 rounded-2xl transition-colors">
                <MessageSquare size={16} /> <span className="hidden sm:inline">COMMENT</span>
              </button>
              <button className="flex items-center justify-center gap-2 text-xs font-bold text-[#00897B] hover:bg-teal-50 py-3 rounded-2xl transition-colors">
                <Share2 size={16} /> <span className="hidden sm:inline">SHARE</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="flex flex-col gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <Image src={comment.avatar} alt={comment.author} width={40} height={40} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-bold text-sm text-gray-900">{comment.author}</h4>
                        <span className="text-[10px] text-gray-400">{comment.time}</span>
                      </div>
                    </div>
                    <button className="px-4 py-1 bg-[#00897B] text-white text-[10px] font-bold rounded-full hover:bg-teal-800 transition-colors">
                      Follow +
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    {comment.content}
                  </p>
                  
                  <div className="flex items-center gap-6 text-gray-400">
                    <button className="flex items-center gap-1.5 hover:text-[#00897B] transition-colors">
                      <ThumbsUp size={14} /> <span className="text-xs font-bold">{comment.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                      <ThumbsDown size={14} /> <span className="text-xs font-bold">{comment.dislikes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </article>

          {/* Sticky Comment Input Bar */}
          <div className="fixed bottom-0 left-60 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-50">
            <div className="max-w-[800px] mx-auto flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                <Image src={user.avatar} alt="You" width={40} height={40} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder={`Post a comment as ${user.name}...`} 
                  className="w-full bg-[#FDFBF7] border border-gray-300 text-sm rounded-full py-3 pl-6 pr-12 outline-none focus:border-[#00897B] transition-colors"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#00897B] text-white rounded-full flex items-center justify-center hover:bg-teal-800 transition-transform hover:scale-105 shadow-md">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}