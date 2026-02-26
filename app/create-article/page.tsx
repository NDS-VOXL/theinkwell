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
  
  // --- IMAGE UPLOAD STATES ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- UI & LOADING STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState({ title: '', desc: '' });
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const [activeStyles, setActiveStyles] = useState({
    bold: false, italic: false, underline: false, h1: false, ol: false, ul: false
  });

  // --- LOGIC: IMAGE HANDLING ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- LOGIC: ACTIONS & NOTIFICATIONS ---
  const triggerToast = (title: string, desc: string) => {
    setToastData({ title, desc });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    triggerToast("Draft Saved!", "Your progress is safe. Access it anytime from your profile.");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    triggerToast("Article Published!", "High five! Your story is now live for the world to see.");
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/');
  };

  // --- EDITOR LOGIC ---
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

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    syncState();
    if (editorRef.current) setContent(editorRef.current.innerHTML);
  };

  const closeEditor = () => {
    if (editorRef.current) setContent(editorRef.current.innerHTML);
    setIsEditorOpen(false);
  };

  useEffect(() => {
    if (isEditorOpen && editorRef.current) {
      editorRef.current.innerHTML = content || '<p><br></p>'; 
      setTimeout(() => {
        editorRef.current?.focus();
        syncState();
      }, 10);
    }
  }, [isEditorOpen, content]);

  // Styles
  const labelStyle = "font-lato font-bold text-[14px] text-gray-900 ml-1 mb-2";
  const containerStyle = "flex items-center bg-[#FDFBF7] border border-gray-200 rounded-[16px] px-4 py-3 focus-within:border-[#00897B] transition-colors shadow-sm";
  const inputStyle = "flex-1 bg-transparent outline-none text-gray-800 font-lato font-light text-[12px] placeholder-gray-400";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] relative">
      
      {/* SUCCESS TOAST */}
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
                <div className="flex flex-col">
                  <label className={labelStyle}>Title</label>
                  <div className={containerStyle}>
                    <Type size={18} className="text-gray-400 mr-3" />
                    <input type="text" placeholder="Enter article title..." value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} />
                  </div>
                </div>

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

                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                  <button onClick={handleSaveDraft} disabled={isSaving || isSubmitting} className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-gray-400 text-gray-600 font-bold text-[14px] hover:bg-gray-50 transition-all min-h-[52px] disabled:opacity-50">
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} />Save to Drafts</>}
                  </button>
                  <button onClick={handleSubmit} disabled={isSubmitting || isSaving} className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#00897B] text-white font-bold text-[14px] hover:bg-teal-800 transition-all min-h-[52px] disabled:opacity-80">
                    {isSubmitting ? <Loader2 size={20} className="animate-spin text-white" /> : <>Submit to Publish <Send size={16} /></>}
                  </button>
                </div>
              </div>

              {/* UPLOAD SIDEBAR */}
              <div className="lg:col-span-1">
                 <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="sticky top-10 w-full bg-[#FDFBF7] border-2 border-dashed border-gray-300 rounded-[16px] cursor-pointer hover:border-[#00897B] transition-all flex flex-col items-center justify-center h-[273px] overflow-hidden group"
                 >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image src={imagePreview} alt="Preview" fill className="object-contain" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-bold text-sm">Change Image</p>
                        </div>
                        <button onClick={removeImage} className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white p-1.5 rounded-full shadow-md transition-colors"><X size={14}/></button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#00897B] transition-colors">
                          <UploadCloud size={32} />
                        </div>
                        <div className="text-center mt-4">
                          <p className="font-lato font-bold text-[14px] text-gray-800">Click to upload header image</p>
                          <p className="font-lato font-light text-[12px] text-gray-400">SVG, PNG, JPG or GIF</p>
                        </div>
                      </>
                    )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL EDITOR */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 animate-in fade-in duration-200 p-4">
          <div className="bg-white flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden w-full max-w-[650px] h-[500px] rounded-[20px] pt-4">
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Rich Text Editor</span>
              <button onClick={closeEditor} className="bg-[#00897B] text-white text-[10px] font-bold px-5 py-1.5 rounded-full">Done</button>
            </div>
            <div className="flex-1 px-8 py-6 overflow-y-auto">
              <div 
                ref={editorRef} contentEditable onInput={syncState}
                className="w-full h-full outline-none text-lg text-gray-800 font-lato leading-relaxed prose prose-teal"
              />
            </div>
            {/* Toolbar */}
            <div className="p-4 bg-gray-50 flex items-center gap-2 justify-center">
               <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('bold')} className={`p-2 rounded ${activeStyles.bold ? 'bg-teal-100 text-[#00897B]' : ''}`}><Bold size={18}/></button>
               <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('italic')} className={`p-2 rounded ${activeStyles.italic ? 'bg-teal-100 text-[#00897B]' : ''}`}><Italic size={18}/></button>
               <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('insertUnorderedList')} className={`p-2 rounded ${activeStyles.ul ? 'bg-teal-100 text-[#00897B]' : ''}`}><ListOrdered size={18}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}