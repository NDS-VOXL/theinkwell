'use client';

import SideNav from '../components/SideNav';
import TopHeader from '../components/TopHeader';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, Save, Send, Link as LinkIcon, Folder, Type, 
  Bold, Italic, Underline, List as ListIcon, ListOrdered, Heading1,
  Loader2, CheckCircle, X 
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function CreateArticlePage() {
  const router = useRouter();

  // --- FORM STATES ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState(''); 
  
  // --- UI & LOADING STATES ---
  const [isSaving, setIsSaving] = useState(false);      // 🟢 Loading state for Draft
  const [isSubmitting, setIsSubmitting] = useState(false); // 🟢 Loading state for Submit
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ title: '', desc: '' });

  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [activeStyles, setActiveStyles] = useState({
    bold: false, italic: false, underline: false, h1: false, ol: false, ul: false
  });

  // --- LOGIC: LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  // --- LOGIC: DYNAMIC TOAST ---
  const triggerToast = (title: string, desc: string) => {
    setToastData({ title, desc });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  // 🟢 LOGIC: SAVE DRAFT (Same behavior as submit)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API
    setIsSaving(false);
    triggerToast("Draft Saved!", "You can continue editing this later from your profile.");
  };

  // 🟢 LOGIC: SUBMIT
  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API
    setIsSubmitting(false);
    triggerToast("Article Published!", "Your story is now live on the global feed.");
  };

  // --- EDITOR UTILS ---
  const syncState = () => {
    if (typeof document === 'undefined') return;
    const formatBlock = document.queryCommandValue('formatBlock').toLowerCase();
    setActiveStyles({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      h1: formatBlock === 'h1' || formatBlock === 'header1',
      ol: document.queryCommandState('insertOrderedList'),
      ul: document.queryCommandState('insertUnorderedList'),
    });
  };

  useEffect(() => {
    if (isEditorOpen && editorRef.current) {
      editorRef.current.innerHTML = content || '<p><br></p>'; 
      setTimeout(() => {
        editorRef.current?.focus();
        syncState();
      }, 10);
    }
  }, [isEditorOpen]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    syncState();
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const closeEditor = () => {
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    setIsEditorOpen(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeEditor();
  };

  const labelStyle = "font-lato font-bold text-[14px] text-gray-900 ml-1 mb-2";
  const containerStyle = "flex items-center bg-[#FDFBF7] border border-gray-200 rounded-[16px] px-4 py-3 focus-within:border-[#00897B] transition-colors shadow-sm";
  const inputStyle = "flex-1 bg-transparent outline-none text-gray-800 font-lato font-light text-[12px] placeholder-gray-400";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] relative">
      
      {/* 🟢 DYNAMIC NOTIFICATION TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-4 bg-white border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-4 rounded-2xl animate-in slide-in-from-right-10 duration-500 ease-out">
          <div className="flex items-center justify-center w-10 h-10 bg-teal-50 rounded-full">
            <CheckCircle className="text-[#00897B]" size={20} />
          </div>
          <div className="pr-4">
            <p className="font-bold text-gray-900 text-sm font-lato">{toastData.title}</p>
            <p className="text-gray-500 text-xs font-lato">{toastData.desc}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      <SideNav onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 py-6 pb-20 relative">
          <TopHeader />

          <div className="w-full max-w-6xl mx-auto mt-8">
            <h1 className="text-2xl font-bold text-gray-900 font-lato mb-8">Create New Post</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Title */}
                <div className="flex flex-col">
                  <label className={labelStyle}>Title</label>
                  <div className={containerStyle}>
                    <Type size={18} className="text-gray-400 mr-3" />
                    <input type="text" placeholder="Enter article title..." value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} />
                  </div>
                </div>

                {/* Article Preview */}
                <div className="flex flex-col">
                  <label className={labelStyle}>Article</label>
                  <div 
                    onClick={() => setIsEditorOpen(true)}
                    className="w-full h-[300px] bg-[#FDFBF7] border border-gray-200 rounded-[16px] p-6 cursor-pointer hover:border-[#00897B] transition-colors shadow-sm overflow-hidden"
                  >
                    <div 
                      className="prose prose-sm font-lato text-gray-700 max-w-none line-clamp-[10]" 
                      dangerouslySetInnerHTML={{ __html: content || '<p style="color: #9CA3AF">Click and start writing...</p>' }} 
                    />
                  </div>
                </div>

                {/* Category & Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="flex flex-col">
                      <label className={labelStyle}>Category</label>
                      <div className={containerStyle}>
                        <Folder size={18} className="text-gray-400 mr-3" />
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputStyle} cursor-pointer bg-transparent`}>
                          <option value="" disabled>Choose Category</option>
                          <option value="Technology">Technology</option>
                          <option value="Business">Business</option>
                        </select>
                      </div>
                   </div>
                   <div className="flex flex-col">
                      <label className={labelStyle}>Links</label>
                      <div className={containerStyle}>
                        <LinkIcon size={18} className="text-gray-400 mr-3" />
                        <input type="text" placeholder="Reference links" value={link} onChange={(e) => setLink(e.target.value)} className={inputStyle} />
                      </div>
                   </div>
                </div>

                {/* 🟢 ACTION BUTTONS: Now both have loading states */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <button 
                    onClick={handleSaveDraft}
                    disabled={isSaving || isSubmitting}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-gray-400 text-gray-600 font-bold text-[14px] hover:bg-gray-50 transition-all min-h-[52px] disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <><Save size={18} />Save to Drafts</>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || isSaving}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#00897B] text-white font-bold text-[14px] hover:bg-teal-800 transition-all min-h-[52px] disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin text-white" />
                    ) : (
                      <>Submit to Publish <Send size={16} /></>
                    )}
                  </button>
                </div>
              </div>

              {/* Upload Sidebar */}
              <div className="lg:col-span-1">
                 <div className="sticky top-10 w-full bg-[#FDFBF7] border-2 border-dashed border-gray-300 rounded-[16px] cursor-pointer hover:border-[#00897B] transition-all flex flex-col items-center justify-center h-[273px] gap-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#00897B]">
                      <UploadCloud size={32} />
                    </div>
                    <div className="text-center">
                      <p className="font-lato font-bold text-[14px] text-gray-800">Click to upload</p>
                      <p className="font-lato font-light text-[12px] text-gray-400">SVG, PNG, JPG or GIF</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL EDITOR: Full Code omitted for brevity, logic same as before */}
    </div>
  );
}