'use client';

import TopHeader from '../components/TopHeader';
import { 
  UploadCloud, Save, Send, Link as LinkIcon, Folder, Type, 
  Bold, Italic, Underline, List as ListIcon, ListOrdered, Heading1 
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function CreateArticlePage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  const [content, setContent] = useState(''); 
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const [activeStyles, setActiveStyles] = useState({
    bold: false, italic: false, underline: false, h1: false, ol: false, ul: false
  });

  // --- 1. Track Highlight / Styles ---
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

  // --- 2. Initialize Content ---
  useEffect(() => {
    if (isEditorOpen && editorRef.current) {
      // If content is empty, start with a paragraph to help the browser handle lists
      editorRef.current.innerHTML = content || '<p><br></p>'; 
      setTimeout(() => {
        editorRef.current?.focus();
        syncState();
      }, 10);
    }
  }, [isEditorOpen]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Force immediate sync
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEditor();
    };
    if (isEditorOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditorOpen]);

  // UI Styles
  const labelStyle = "font-lato font-bold text-[14px] leading-none text-gray-900 ml-1 mb-2";
  const containerStyle = "flex items-center bg-[#FDFBF7] border border-gray-200 rounded-[16px] px-4 py-3 focus-within:border-[#00897B] transition-colors shadow-sm";
  const inputStyle = "flex-1 bg-transparent outline-none text-gray-800 font-lato font-light text-[12px] leading-none placeholder-gray-400";

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-20 relative">
      <TopHeader />

      <div className="w-full max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-900 font-lato mb-8">Create New Post</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col">
              <label className={labelStyle}>Title</label>
              <div className={containerStyle}>
                <Type size={18} className="text-gray-400 mr-3" />
                <input type="text" placeholder="Enter article title..." value={title} onChange={(e) => setTitle(e.target.value)} className={inputStyle} />
              </div>
            </div>

            <div className="flex flex-col h-full">
              <label className={labelStyle}>Article</label>
              <div 
                onClick={() => setIsEditorOpen(true)}
                className="w-full h-[300px] bg-[#FDFBF7] border border-gray-200 rounded-[16px] p-6 cursor-pointer hover:border-[#00897B] transition-colors shadow-sm overflow-hidden"
              >
                {/* PREVIEW: Needs list classes too */}
                <div 
                  className="prose prose-sm font-lato text-gray-700 max-w-none line-clamp-[10] 
                    [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6" 
                  dangerouslySetInnerHTML={{ __html: content || '<p style="color: #9CA3AF">Click and start writing...</p>' }} 
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className={labelStyle}>Category</label>
              <div className={containerStyle}>
                <Folder size={18} className="text-gray-400 mr-3" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputStyle} cursor-pointer appearance-none bg-transparent`}>
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
                <input type="text" placeholder="Add Reference links" value={link} onChange={(e) => setLink(e.target.value)} className={inputStyle} />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border border-gray-400 text-gray-600 font-bold text-[14px] hover:bg-gray-50 transition-all font-lato"><Save size={18} />Save to Drafts</button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#00897B] text-white font-bold text-[14px] hover:bg-teal-800 transition-all font-lato">Submit to Publish <Send size={16} /></button>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="sticky top-10 w-full bg-[#FDFBF7] border-2 border-dashed border-gray-300 rounded-[10px] cursor-pointer hover:border-[#00897B] transition-all flex flex-col items-center justify-center h-[273px] gap-10">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-[#00897B] transition-colors"><UploadCloud size={32} /></div>
                <div className="text-center">
                  <p className="font-lato font-bold text-[14px] text-gray-800">Click to upload</p>
                  <p className="font-lato font-light text-[12px] text-gray-400">SVG, PNG, JPG or GIF</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 🟢 MODAL & EDITOR */}
      {isEditorOpen && (
        <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 animate-in fade-in duration-200">
          <div 
            ref={modalContainerRef}
            className="bg-white flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 overflow-hidden"
            style={{ width: '650px', height: '440px', borderRadius: '20px', paddingTop: '10px' }}
          >
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                  <Image src="/user-avatar.jpg" alt="User" width={36} height={36} className="object-cover" />
                </div>
                <span className="font-bold text-gray-900 font-lato text-sm">Loveren Paul</span>
              </div>
              <button onClick={closeEditor} className="bg-[#00897B] text-white text-[10px] font-bold px-5 py-1.5 rounded-full hover:bg-teal-800">Done</button>
            </div>

            <div className="flex-1 px-12 py-4 overflow-y-auto">
              {/* EDITOR: Added specific list handling classes */}
              <div 
                ref={editorRef}
                contentEditable
                onSelect={syncState}
                onKeyUp={syncState}
                onMouseUp={syncState}
                onInput={() => {
                   syncState();
                   if (editorRef.current) setContent(editorRef.current.innerHTML);
                }}
                className="w-full h-full outline-none text-lg text-gray-800 font-lato leading-relaxed prose prose-teal min-h-[300px]
                  [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6"
              />
            </div>
          </div>

          {/* 🟢 TOOL BAR */}
          <div ref={toolbarRef} className="mt-4 animate-in slide-in-from-bottom-5 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1A1A1A] rounded-2xl px-4 py-2 flex items-center gap-2 shadow-2xl border border-white/10">
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('formatBlock', activeStyles.h1 ? 'p' : 'h1')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.h1 ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <Heading1 size={20} />
                </button>
                <div className="w-[1px] h-5 bg-gray-700 mx-1"></div>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('bold')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.bold ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <Bold size={20} />
                </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('italic')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.italic ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <Italic size={20} />
                </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('underline')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.underline ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <Underline size={20} />
                </button>
                <div className="w-[1px] h-5 bg-gray-700 mx-1"></div>
                
                {/* List Tools */}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('insertOrderedList')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.ol ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <ListOrdered size={20} />
                </button>
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => handleCommand('insertUnorderedList')}
                  className={`p-2 rounded-lg transition-all ${activeStyles.ul ? 'bg-[#00897B]' : 'bg-transparent hover:bg-white/10'} text-white`}>
                  <ListIcon size={20} />
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}