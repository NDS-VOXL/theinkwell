"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  orderBy, 
  serverTimestamp, 
  increment, 
  updateDoc 
} from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { ArrowLeft, Send, ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical } from "lucide-react";
import TopHeader from "@/app/components/TopHeader";
import SideNav from "@/app/components/SideNav";
import Image from "next/image";

// 🟢 1. Define Strict Interfaces to avoid 'any'
import { Timestamp } from "firebase/firestore"; // 🟢 1. Import the specific type

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  categories: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  readTime: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp; // 🟢 2. Replace 'any' with 'Timestamp'
}

interface ArticleComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Timestamp; // 🟢 3. Do the same for comments
}

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // 🟢 2. Apply Types to State
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Fetch Full Article Data
    const fetchArticle = async () => {
      const docRef = doc(db, "articles", id as string);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setArticle({ id: snap.id, ...snap.data() } as Article);
      } else {
        router.replace("/home"); // Redirect if article doesn't exist
      }
    };

    fetchArticle();

    // 🟢 3. Real-time Comments Listener (Sub-collection)
    const commentsQuery = query(
      collection(db, "articles", id as string, "comments"), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (snap) => {
      const fetchedComments = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ArticleComment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [id, router]);

  // ─── HANDLERS ───

  const postComment = async () => {
    if (!commentText.trim() || !auth.currentUser || !id) return;
    setIsSubmitting(true);

    try {
      const articleRef = doc(db, "articles", id as string);
      
      // Add to 'comments' sub-collection
      await addDoc(collection(articleRef, "comments"), {
        text: commentText,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Inkwell Writer",
        authorAvatar: auth.currentUser.photoURL || "",
        createdAt: serverTimestamp(),
      });

      // Atomically increment comment count on the main article doc
      await updateDoc(articleRef, { commentsCount: increment(1) });
      
      setCommentText("");
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#00897B] border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-[#00897B] font-lato">Opening The Inkwell...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F8F9FA] min-h-screen">
      <SideNav onLogout={() => auth.signOut()} />

      <main className="flex-1 px-4 md:px-8 py-6 relative">
        <TopHeader />

        <div className="max-w-3xl mx-auto pb-40 font-lato">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => router.back()} 
              className="p-3 bg-white rounded-full text-[#00897B] shadow-sm hover:bg-teal-50 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Title & Author Info */}
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center justify-between mb-10 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                <img src={article.authorAvatar || "/default-avatar.png"} alt="Author" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-black text-sm text-gray-900">{article.authorName}</p>
                <p className="text-[11px] text-gray-400 font-bold">{article.readTime} • Published in {article.categories[0]}</p>
              </div>
            </div>
            {auth.currentUser?.uid !== article.authorId && (
              <button className="bg-[#00897B] text-white px-6 py-2 rounded-full text-xs font-black hover:bg-teal-800 shadow-md transition-all active:scale-95">
                Follow +
              </button>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative w-full aspect-[16/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl border-4 border-white">
            <img src={article.imageUrl} alt="Article Header" className="w-full h-full object-cover" />
          </div>

          {/* Article Body */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-20 font-medium px-2"
            dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          <div className="w-full h-px bg-gray-200 mb-12 border-dashed border-t" />

          {/* Social Interactions */}
          <div className="grid grid-cols-4 gap-4 mb-20">
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-2xl text-[#00897B] font-black text-xs hover:bg-teal-50 transition-all">
                <ThumbsUp size={18} /> {article.likesCount > 0 && article.likesCount}
             </button>
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-2xl text-gray-400 font-black text-xs hover:bg-gray-50">
                <ThumbsDown size={18} />
             </button>
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-2xl text-[#00897B] font-black text-xs">
                <MessageSquare size={18} /> {comments.length}
             </button>
             <button className="flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-2xl text-[#00897B] font-black text-xs">
                <Share2 size={18} />
             </button>
          </div>

          {/* Comments Feed */}
          <h3 className="text-2xl font-black mb-8 text-gray-900">Discussion ({comments.length})</h3>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <img src={comment.authorAvatar || "/default-avatar.png"} className="w-8 h-8 rounded-full border border-gray-100" />
                  <p className="font-black text-xs text-gray-900">{comment.authorName}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium pl-1">{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold text-sm">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>

        {/* 🟢 Sticky Comment Input Bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-xl p-6 border-t border-gray-100 flex justify-center z-50">
          <div className="w-full max-w-3xl flex gap-4 items-center">
            <div className="hidden sm:block w-12 h-12 rounded-full overflow-hidden border-2 border-[#00897B]">
               <img src={auth.currentUser?.photoURL || "/default-avatar.png"} className="w-full h-full object-cover" />
            </div>
            <input 
              className="flex-1 bg-[#FDFBF7] p-4 rounded-full border border-gray-200 outline-none focus:border-[#00897B] text-sm font-bold shadow-inner" 
              placeholder={`Write a comment as ${auth.currentUser?.displayName?.split(' ')[0]}...`} 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && postComment()}
            />
            <button 
              onClick={postComment} 
              disabled={isSubmitting || !commentText.trim()}
              className="w-14 h-14 bg-[#00897B] text-white rounded-full flex items-center justify-center hover:bg-teal-800 hover:scale-105 transition-all shadow-lg shadow-[#00897B]/30 disabled:opacity-50"
            >
              {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={20}/>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}