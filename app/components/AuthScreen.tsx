"use client";

import google from "@/app/assets/icons/google.png";
import ink from "@/app/assets/icons/inkwell.svg";
import image from "@/app/assets/images/background.jpg";
import Image from "next/image";
import Icon from "./Icon";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onLogin?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string, name: string) => void;
}

export default function AuthScreen({
  mode = "register",
  onModeChange,
  onLogin,
  onRegister,
}: AuthScreenProps) {
  
  const switchMode = () => {
    const newMode = mode === "register" ? "login" : "register";
    onModeChange?.(newMode);
  };

  const handleAuthAction = () => {
    if (mode === "login") {
      onLogin?.("user@example.com", "password123");
    } else {
      onRegister?.("user@example.com", "password123", "User Name");
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0A1F11]">
      
      {/* 1. Left Side: Image & Overlay */}
      <div className="w-[50%] relative z-10">
        <Image
          src={image}
          alt="background"
          className="w-full object-cover h-full"
        />
        <div className="absolute inset-0 bg-[#0A1F11]/80 flex pt-10 pb-10 justify-center">
          <div className="flex flex-col text-center items-center text-white h-full w-full">
            
            <Image src={ink} alt="The Inkwell" />
            
            <div className="px-20 mt-16">
              <h2 className="text-[38px] font-bold leading-[48px]">
                Create an Article that&apos;s worth sharing
              </h2>
              <p className="text-[13px] text-[#CDD0CE] font-medium px-10 pt-5 leading-relaxed">
                You can write from your heart, and make a person time worth it. 
                An original story draw the best views
              </p>
            </div>

            {/* Bottom text pinned to bottom */}
            <div className="mt-auto">
              <p className="font-lato font-normal text-[12px] leading-[20px] tracking-normal text-center opacity-80">
                You can start for free and upgrade for better experience later.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Auth Form Container */}
      <div 
        className={`
          bg-[#FDFBF7] w-[52%] h-full absolute right-0 top-0 z-20 
          flex flex-col justify-center items-center text-black shadow-2xl
          /* 🟢 Moderate Radius: 35px */
          rounded-tl-[40px] rounded-bl-[40px]
        `}
      >
        <div className="w-full max-w-[440px] px-8">
          <h1 className="inknut-antiqua font-extrabold text-2xl text-[#2F4F3A] text-center mb-10">
            {mode === "register" ? "Create an Account" : "Welcome Back"}
          </h1>

          <form className="space-y-6">
            {mode === "register" && (
              <div className="flex flex-col relative">
                <label className="-top-2 left-4 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] text-[#2F4F3A] uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full border rounded-xl border-gray-300 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all placeholder:text-gray-300"
                />
              </div>
            )}

            <div className="flex flex-col relative">
              <label className="-top-2 left-4 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] text-[#2F4F3A] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Valid Email"
                className="w-full border rounded-xl border-gray-300 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="flex flex-col relative">
              <label className="-top-2 left-4 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] text-[#2F4F3A] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                placeholder="Create Password"
                className="w-full border rounded-xl border-gray-300 px-4 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all placeholder:text-gray-300"
              />
            </div>

            {mode === "register" && (
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-teal-700" id="terms" />
                <label htmlFor="terms" className="text-[11px] text-gray-500">
                  I agree to provided <span className="font-bold underline cursor-pointer text-teal-900">Term & Conditions</span>
                </label>
              </div>
            )}

            <div className="space-y-4 pt-4">
              <button
                type="button"
                onClick={handleAuthAction}
                className="w-full text-sm bg-[#008080] text-white font-bold py-4 rounded-full shadow-md hover:bg-[#006666] active:scale-[0.98] transition-all"
              >
                {mode === "register" ? "Sign up" : "Sign in"}
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 flex items-center justify-center text-[#2F4F3A] py-4 rounded-full text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                <Icon name={google} size={18} className="mr-3" />
                {mode === "register" ? "Sign up with Google" : "Sign in with Google"}
              </button>
            </div>

            <div className="text-center pt-6">
              <span className="text-xs text-gray-500">
                {mode === "register" ? "Already have an account?" : "Don't have an account?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-2 text-[#2F4F3A] font-extrabold hover:underline transition-all"
                >
                  {mode === "register" ? "Sign in" : "Sign up"}
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}