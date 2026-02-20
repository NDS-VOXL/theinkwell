"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import splashImg from '@/app/assets/images/splash.svg';

interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function SplashScreen({
  onComplete,
  duration = 3000,
}: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } 
      /* 🟢 REMOVED blue gradient, replaced with deep dark green/black */
      bg-[#0A1F11]`} 
    >
      <Image 
        src={splashImg} 
        alt="The Inkwell" 
        className="w-full h-auto"
        priority // 🟢 Essential: Forces the browser to load this immediately
        quality={100}
      />
    </div>
  );
}