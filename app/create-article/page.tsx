"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, Save, Send, Loader2, CheckCircle, X, AlertCircle 
} from 'lucide-react';
import { auth, db, storage } from "@/app/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import TopHeader from '@/app/components/TopHeader';
import SideNav from '@/app/components/SideNav';

export default function CreateArticlePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- UI & TOAST STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  // --- IMAGE HANDLING ---
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ─── 🟢 LOGIC: SAVE DRAFT ───
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      showNotification("Please add a title before saving a draft.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(db, "drafts"), {
        title,
        content,
        authorId: user.uid,
        status: "draft",
        updatedAt: serverTimestamp(),
      });
      
      showNotification("Draft saved to your profile!", "success");
    } catch (error) {
      showNotification("Failed to save draft. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── 🟢 LOGIC: PUBLISH ARTICLE ───
  const handleSubmit = async () => {
    if (!title || !content || !selectedFile) {
      showNotification("Please fill all fields and upload an image.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user found");

      // 1. Upload Image to Storage (Path: articles/userId/timestamp)
      const storageRef = ref(storage, `articles/${user.uid}/${Date.now()}_${selectedFile.name}`);
      const uploadResult = await uploadBytes(storageRef, selectedFile);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // 2. Save Article Metadata to Firestore
      await addDoc(collection(db, "articles"), {
        title,
        content,
        imageUrl,
        authorId: user.uid,
        authorName: user.displayName || "Inkwell Writer",
        authorAvatar: user.photoURL || "",
        readTime: `${Math.ceil(content.split(' ').length / 200)} min read`,
        likesCount: 0,
        commentsCount: 0,
        categories: ["General"], 
        createdAt: serverTimestamp(),
      });

      showNotification("Article published successfully!", "success");
      
      // Small delay before redirect so they see the success message
      setTimeout(() => router.push("/home"), 1500);
    } catch (error) {
      console.error(error);
      showNotification("Error publishing article.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] relative">
      
      {/* 🟢 TOAST NOTIFICATION COMPONENT */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right-10 duration-500 ${
          toast.type === 'success' ? 'bg-white border-teal-100' : 'bg-red-50 border-red-100'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="text-[#00897B]" size={20} />
          ) : (
            <AlertCircle className="text-red-500" size={20} />
          )}
          <p className={`text-sm font-bold font-lato ${toast.type === 'success' ? 'text-gray-800' : 'text-red-700'}`}>
            {toast.message}
          </p>
          <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      <SideNav onLogout={() => auth.signOut()} />

      <main className="flex-1 overflow-y-auto px-6 md:px-10 py-6 font-lato">
        <TopHeader />

        <div className="max-w-4xl mx-auto mt-10">
          <h1 className="text-3xl font-black mb-8 text-gray-900">Create New Post</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <input 
                className="w-full bg-white p-5 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] font-bold text-xl transition-all" 
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <textarea 
                className="w-full h-80 bg-white p-6 rounded-2xl border border-gray-200 outline-none focus:border-[#00897B] resize-none font-medium leading-relaxed"
                placeholder="Start writing your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                <button 
                  onClick={handleSaveDraft} 
                  disabled={isSaving || isSubmitting} 
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-4 rounded-full border-2 border-gray-200 text-gray-500 font-black text-sm hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save to Drafts</>}
                </button>

                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || isSaving} 
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-4 rounded-full bg-[#00897B] text-white font-black text-sm hover:bg-teal-800 transition-all shadow-lg shadow-teal-900/20 disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> Publishing...
                    </span>
                  ) : (
                    <><Send size={18}/> Publish Article</>
                  )}
                </button>
              </div>
            </div>

            {/* Image Upload Area */}
            <div className="lg:col-span-1">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="sticky top-10 h-72 border-2 border-dashed border-gray-300 rounded-[32px] bg-white flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#00897B] group transition-all"
              >
                <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImagePick} />
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <>
                    <UploadCloud size={40} className="text-gray-300 group-hover:text-[#00897B] transition-colors" />
                    <p className="mt-4 text-xs font-black text-gray-400">Header Image</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}