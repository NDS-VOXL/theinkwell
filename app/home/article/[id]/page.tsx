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
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch 
} from "firebase/firestore";
import { auth, db } from "@/app/firebase";
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  MoreVertical,
  Send,
  UserCheck,
  UserPlus,
  Clock
} from "lucide-react";
import { Article, ArticleComment } from "@/app/types";
import TopHeader from "@/app/components/TopHeader";
import SideNav from "@/app/components/SideNav";
import { motion, AnimatePresence } from "framer-motion";

export default function ArticleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [authorStats, setAuthorStats] = useState({ followersCount: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = auth.currentUser?.uid;

  // 1. Article & Author Stats Listener
  useEffect(() => {
    if (!id) return;

    const unsubArticle = onSnapshot(doc(db, "articles", id as string), (snap) => {
      if (snap.exists()) {
        const artData = { id: snap.id, ...snap.data() } as Article;
        setArticle(artData);

        const unsubAuthor = onSnapshot(doc(db, "users", artData.authorId), (userSnap) => {
          if (userSnap.exists()) {
            setAuthorStats({ followersCount: userSnap.data().followersCount || 0 });
          }
        });
        return () => unsubAuthor();
      }
    });

    const q = query(collection(db, "articles", id as string, "comments"), orderBy("createdAt", "desc"));
    const unsubComments = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArticleComment)));
    });

    return () => { unsubArticle(); unsubComments(); };
  }, [id]);

  // 2. Persistent Follow Listener
  useEffect(() => {
    if (!userId || !article?.authorId) return;
    const unsubMe = onSnapshot(doc(db, "users", userId), (meSnap) => {
      if (meSnap.exists()) {
        const followingList = meSnap.data().following || [];
        setIsFollowing(followingList.includes(article.authorId));
      }
    });
    return () => unsubMe();
  }, [userId, article?.authorId]);

  const handleFollow = async () => {
    if (!userId || !article) return;
    const batch = writeBatch(db);
    const myRef = doc(db, "users", userId);
    const authorRef = doc(db, "users", article.authorId);
    const currentlyFollowing = isFollowing;

    try {
      if (currentlyFollowing) {
        batch.update(myRef, { following: arrayRemove(article.authorId) });
        batch.update(authorRef, { followersCount: increment(-1) });
      } else {
        batch.update(myRef, { following: arrayUnion(article.authorId) });
        batch.update(authorRef, { followersCount: increment(1) });
      }
      await batch.commit();
    } catch (err) { console.error("Follow error:", err); }
  };

  const handleEngagement = async (type: 'like' | 'dislike') => {
    if (!userId || !article) return;
    const articleRef = doc(db, "articles", article.id);
    const hasLiked = article.likes?.includes(userId);
    const hasDisliked = article.dislikes?.includes(userId);

    try {
      if (type === 'like') {
        await updateDoc(articleRef, {
          likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
          likesCount: increment(hasLiked ? -1 : 1),
          ...(hasDisliked && { dislikes: arrayRemove(userId), dislikesCount: increment(-1) })
        });
      } else {
        await updateDoc(articleRef, {
          dislikes: hasDisliked ? arrayRemove(userId) : arrayUnion(userId),
          dislikesCount: increment(hasDisliked ? -1 : 1),
          ...(hasLiked && { likes: arrayRemove(userId), likesCount: increment(-1) })
        });
      }
    } catch (err) { console.error(err); }
  };

  const postComment = async () => {
    if (!commentText.trim() || !auth.currentUser || !id) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "articles", id as string, "comments"), {
        text: commentText,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "Writer",
        authorAvatar: auth.currentUser.photoURL || "",
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "articles", id as string), { commentsCount: increment(1) });
      setCommentText("");
    } catch (err) { console.error(err); } finally { setIsSubmitting(false); }
  };

  if (!article) return <div className="h-screen flex items-center justify-center bg-[#FDFBF7] text-[#00897B] font-black animate-pulse">Opening The Inkwell...</div>;

  return (
    <div className="">

      <main className="">


        <div className="max-w-4xl mx-auto px-6 pt-6 pb-40">
          
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-[#00897B] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <ArrowLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full text-white flex items-center justify-center bg-[#00897B] shadow-md">
              <MoreVertical size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6 ml-1 mt-2">
            <img 
              src={article.authorAvatar || "/default-avatar.png"} 
              className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover" 
              alt="Author" 
            />
            <div>
              <p className="font-black text-base text-gray-900 leading-none mb-1">{article.authorName}</p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Author</p>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <p className="text-[10px] text-[#00897B] font-black uppercase">
                  {authorStats.followersCount} Followers
                </p>
              </div>
            </div>
          </div>

          {userId !== article.authorId && (
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={handleFollow}
              className={`w-full py-4 mb-10 rounded-full font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2 tracking-wide ${
                isFollowing 
                ? 'bg-white border-2 border-[#00897B] text-[#00897B]' 
                : 'bg-[#00897B] text-white hover:bg-teal-800'
              }`}
            >
              <AnimatePresence mode="wait">
                {isFollowing ? (
                  <motion.span key="following" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <UserCheck size={18} /> Following
                  </motion.span>
                ) : (
                  <motion.span key="follow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <UserPlus size={18} /> Follow Author
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}

          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight leading-tight px-4">{article.title}</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{article.readTime} • 3.5k readers</p>
          </div>

          <div className="max-w-2xl mx-auto rounded-[32px] overflow-hidden mb-12 shadow-2xl border-4 border-white aspect-video relative">
            <img src={article.imageUrl} className="w-full h-full object-cover" alt="Banner" />
          </div>

          <div className="max-w-2xl mx-auto prose prose-lg text-gray-800 leading-relaxed font-medium mb-16 px-6" 
               dangerouslySetInnerHTML={{ __html: article.content }} 
          />

          <div className="max-w-2xl mx-auto flex items-center justify-around py-8 border-y border-dashed border-gray-200 mb-16">
            <button onClick={() => handleEngagement('like')} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#00897B] transition-colors">
              <ThumbsUp size={18} className={article.likes?.includes(userId || "") ? "fill-[#00897B] text-[#00897B]" : ""} /> 
              LIKE
            </button>
            <button onClick={() => handleEngagement('dislike')} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-red-500 transition-colors">
              <ThumbsDown size={18} className={article.dislikes?.includes(userId || "") ? "fill-red-500 text-red-500" : ""} /> 
              DISLIKE
            </button>
            <button className="flex items-center gap-2 text-[10px] font-black text-[#00897B]"><MessageSquare size={18} /> COMMENT</button>
            <button className="flex items-center gap-2 text-[10px] font-black text-[#00897B]"><Share2 size={18} /> SHARE</button>
          </div>

          {/* 🟢 THE COMMENTS LIST SECTION */}
          <div className="max-w-2xl mx-auto mt-10">
            <div className="flex items-center justify-between mb-8 px-2">
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                Discussion <span className="text-[#00897B] ml-1">({comments.length})</span>
              </h3>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.div 
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[28px] border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={comment.authorAvatar || "/default-avatar.png"} 
                          className="w-9 h-9 rounded-full border border-gray-100 object-cover" 
                          alt={comment.authorName} 
                        />
                        <div>
                          <p className="text-sm font-black text-gray-900 leading-none">{comment.authorName}</p>
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] text-gray-400 font-bold uppercase">
                            <Clock size={10} />
                            <span>Recently</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-300 hover:text-gray-500">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed pl-1">
                      {comment.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {comments.length === 0 && (
                <div className="text-center py-16 bg-white rounded-[32px] border-2 border-dashed border-gray-100">
                  <MessageSquare size={40} className="mx-auto text-gray-100 mb-4" />
                  <p className="text-gray-400 font-bold text-sm">No comments yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Comment Bar */}
        <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white/80 backdrop-blur-xl p-6 border-t border-gray-100 flex justify-center z-50">
          <div className="w-full max-w-3xl flex gap-4 items-center">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#00897B]">
               <img src={auth.currentUser?.photoURL || "/default-avatar.png"} className="w-full h-full object-cover" alt="Me" />
             </div>
             <div className="relative flex-1">
                <input 
                  className="w-full bg-white p-4 pl-6 rounded-full border border-gray-200 outline-none focus:border-[#00897B] text-sm font-bold shadow-sm" 
                  placeholder={`Comment as ${auth.currentUser?.displayName?.split(' ')[0]}...`} 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && postComment()}
                />
                <button 
                  onClick={postComment} 
                  disabled={isSubmitting || !commentText.trim()}
                  className="absolute right-3 top-2 w-10 h-10 bg-[#00897B] text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 hover:bg-teal-800 transition-colors"
                >
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18}/>}
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}