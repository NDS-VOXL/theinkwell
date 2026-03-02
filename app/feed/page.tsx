"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, query, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import SideNav from "@/app/components/SideNav";
import TopHeader from "@/app/components/TopHeader";
import RightSidebar from "@/app/components/RightSidebar";
// import CreatePost from "@/app/components/CreatePost"; // Ensure this component exists
import ArticleCard from "@/app/components/ArticleCard";
import { Article } from "@/app/types"; // Import the interface we made

export default function FeedPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Current User's "Following" list to handle Follow buttons
    const fetchUserStats = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFollowing(userSnap.data().following || []);
        }
      }
    };

    // 2. Real-time Feed Query: Fetch all articles, newest first
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedArticles = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Article[];
      
      setArticles(fetchedArticles);
      setLoading(false);
    });

    fetchUserStats();
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    localStorage.removeItem("isLoggedIn");
    router.replace("/");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <SideNav onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface font-lato">
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-10 py-6 pb-20">
          <TopHeader />
          
          <div className="flex gap-6 lg:gap-10 items-start mt-8">
            <div className="flex-1 min-w-0">
              {/* <CreatePost /> */}
              
              <h2 className="text-lg font-black mb-6 text-gray-900 uppercase tracking-tight">
                Article feed
              </h2>

              {/* 🟢 THE FIX: Mapping through real articles */}
              <div className="space-y-6">
                {loading ? (
                  <div className="flex flex-col items-center py-20 text-gray-400">
                    <div className="w-8 h-8 border-4 border-[#00897B] border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="font-bold text-sm">Fetching latest stories...</p>
                  </div>
                ) : (
                  articles.map((article) => (
                    <ArticleCard 
                      key={article.id} 
                      article={article} 
                      currentUserFollowing={following} 
                    />
                  ))
                )}

                {!loading && articles.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold">No articles found. Be the first to post!</p>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden xl:block w-[350px]">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}