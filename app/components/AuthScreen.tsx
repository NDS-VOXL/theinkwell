"use client";

import google from "@/app/assets/icons/google.png";
import ink from "@/app/assets/icons/inkwell.svg";
import image from "@/app/assets/images/background.jpg";
import Image from "next/image";
import { useState } from "react";
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
  // 🟢 Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // 🟢 Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const switchMode = () => {
    const newMode = mode === "register" ? "login" : "register";
    onModeChange?.(newMode);
    // Note: Errors are reset automatically by the 'key' prop on the container below
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (mode === "register" && !formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthAction = () => {
    if (validate()) {
      if (mode === "login") {
        onLogin?.(formData.email, formData.password);
      } else {
        onRegister?.(formData.email, formData.password, formData.fullName);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0A1F11] overflow-hidden">
      
      {/* 1. LEFT SIDE: Branding (Logo Top, Headline Center, Footer Bottom) */}
      <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-screen shrink-0 z-10">
        <Image src={image} alt="background" className="w-full h-full object-cover" priority />
        <div className="absolute inset-0 bg-[#0A1F11]/80 flex flex-col items-center justify-between py-10 lg:py-16 px-6 lg:px-12 text-center text-white">
          
          <Image src={ink} alt="The Inkwell" className="w-32 lg:w-auto" />
          
          <div className="max-w-md">
            <h2 className="text-3xl lg:text-[38px] font-bold leading-tight lg:leading-12">
              Create an Article that&apos;s worth sharing
            </h2>
            <p className="hidden md:block text-xs lg:text-sm text-[#CDD0CE] font-semibold mt-4 lg:mt-6 px-10">
              You can write from your heart, and make a person time worth it. 
              An original story draws the best views.
            </p>
          </div>

          <div className="mt-4 lg:mt-0">
            <p className="font-lato font-normal text-[10px] lg:text-[12px] leading-[20px] opacity-70 lg:p-7">
              You can start for free and upgrade for better experience later.
            </p>
          </div>
        </div>
      </div>

      {/* 2. RIGHT SIDE: Auth Form Container */}
      <div 
        key={mode} // 🟢 FIX: Resets internal state/errors automatically when mode switches
        className={`
          flex-1 bg-[#FDFBF7] z-20 shadow-2xl flex flex-col justify-center items-center
          rounded-t-[30px] lg:rounded-tr-none lg:rounded-l-[40px]
          -mt-10 lg:mt-0 px-6 py-12 lg:px-0 lg:py-0
        `}
      >
        <div className="w-full max-w-[420px] px-4 lg:px-8">
          <h1 className="inknut-antiqua font-bold text-2xl lg:text-[28px] text-[#2F4F3A] text-center mb-8 lg:mb-10 tracking-tight">
            {mode === "register" ? "Create an Account" : "Welcome Back"}
          </h1>

          <form className="space-y-5 lg:space-y-6" noValidate>
            {mode === "register" && (
              <div className="flex flex-col relative">
                <label className={`-top-2 left-5 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] uppercase tracking-tighter ${errors.fullName ? 'text-red-500' : 'text-gray-700'}`}>
                  Full Name
                </label>
                <input
                  name="fullName"
                  type="text"
                  onChange={handleInputChange}
                  placeholder="Enter Full Name"
                  className={`w-full border rounded-xl bg-transparent px-5 py-4 text-sm outline-none transition-all ${errors.fullName ? 'border-red-500' : 'border-gray-200 focus:border-[#008080]'}`}
                />
                {errors.fullName && <span className="text-[9px] text-red-500 mt-1 ml-2">{errors.fullName}</span>}
              </div>
            )}

            <div className="flex flex-col relative">
              <label className={`-top-2 left-5 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] uppercase tracking-tighter ${errors.email ? 'text-red-500' : 'text-gray-700'}`}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                onChange={handleInputChange}
                placeholder="Enter Valid Email"
                className={`w-full border rounded-xl bg-transparent px-5 py-4 text-sm outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-[#008080]'}`}
              />
              {errors.email && <span className="text-[9px] text-red-500 mt-1 ml-2">{errors.email}</span>}
            </div>

            <div className="flex flex-col relative">
              <label className={`-top-2 left-5 font-bold absolute bg-[#FDFBF7] px-2 text-[10px] uppercase tracking-tighter ${errors.password ? 'text-red-500' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                name="password"
                type="password"
                onChange={handleInputChange}
                placeholder="Create Password"
                className={`w-full border rounded-xl bg-transparent px-5 py-4 text-sm outline-none transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-[#008080]'}`}
              />
              {errors.password && <span className="text-[9px] text-red-500 mt-1 ml-2">{errors.password}</span>}
            </div>

            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={handleAuthAction}
                className="w-full text-sm bg-[#008080] text-white font-bold py-4 rounded-full shadow-md hover:bg-[#006666] transition-all active:scale-95"
              >
                {mode === "register" ? "Sign up" : "Sign in"}
              </button>

              <button
                type="button"
                className="w-full border border-gray-200 bg-white flex items-center justify-center text-gray-800 py-4 rounded-full text-sm font-bold hover:bg-gray-50 transition-all active:scale-95"
              >
                <Icon name={google} size={18} className="mr-3" />
                {mode === "register" ? "Sign up with Google" : "Sign in with Google"}
              </button>
            </div>

            <div className="text-center pt-6">
              <p className="text-[12px] text-gray-500">
                {mode === "register" ? "Already have an account? " : "Don't have an account? "}
                <button type="button" onClick={switchMode} className="font-extrabold text-[#2F4F3A] hover:underline">
                  {mode === "register" ? "Sign in" : "Sign up"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}