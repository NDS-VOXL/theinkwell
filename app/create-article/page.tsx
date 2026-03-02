"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Save, Send, Type, Folder, Link as LinkIcon, Loader2, X, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { auth, db, storage } from "@/app/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import TopHeader from '@/app/components/TopHeader';
import SideNav from '@/app/components/SideNav';

export default function CreateArticlePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const categories = ["Technology", "Business", "Entertainment", "Health", "Lifestyle", "Sports"];

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / wordsPerMinute)} min read`;
  };

  const handleSubmit = async () => {
    if (!title || !content || !imagePreview || selectedCategories.length === 0) {
      alert("Please fill all fields, select a category, and upload an image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      // 1. Upload Image to Storage (Path: articles/uid/timestamp)
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      const storageRef = ref(storage, `articles/${user.uid}/${Date.now()}_header`);
      await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Save Article to Firestore
      await addDoc(collection(db, "articles"), {
        title,
        content,
        imageUrl,
        categories: selectedCategories,
        authorId: user.uid,
        authorName: user.displayName || "Inkwell Writer",
        authorAvatar: user.photoURL || "",
        readTime: calculateReadTime(content),
        likes: [],
        dislikes: [],
        likesCount: 0,
        dislikesCount: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
      });

      setShowToast(true);
      setTimeout(() => router.push("/home"), 2000);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA]">
      <SideNav onLogout={() => auth.signOut()} />
      <main className="flex-1 overflow-y-auto px-10 py-6">
        <TopHeader />
        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-3xl font-black mb-8">Create New Post</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <input 
                className="w-full bg-white p-5 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] font-bold text-xl" 
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <textarea 
                className="w-full h-80 bg-white p-6 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] resize-none"
                placeholder="Start writing your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-500 uppercase">Select Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selectedCategories.includes(cat) ? 'bg-[#00897B] text-white border-[#00897B]' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                      {cat} {selectedCategories.includes(cat) ? '✓' : '+'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#00897B] text-white py-4 rounded-full font-black flex items-center justify-center gap-2 hover:bg-teal-800 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18}/> Publish Article</>}
              </button>
            </div>

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-64 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center bg-white cursor-pointer hover:border-[#00897B] overflow-hidden"
            >
              <input type="file" hidden ref={fileInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImagePreview(URL.createObjectURL(file));
              }} />
              {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <UploadCloud size={40} className="text-gray-300" />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}