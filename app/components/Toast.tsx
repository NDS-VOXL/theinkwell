// app/components/Toast.tsx
"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  // Auto-close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 right-6 z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
      <div 
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          isSuccess 
            ? "bg-[#F0FAF7] border-[#00897B] text-[#00897B]" 
            : "bg-[#FEF2F2] border-red-500 text-red-600"
        }`}
      >
        {isSuccess ? <CheckCircle size={20} /> : <XCircle size={20} />}
        <span className="text-sm font-bold">{message}</span>
        <button 
          onClick={onClose} 
          className="ml-4 p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}