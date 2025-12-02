"use client";

import image from "@/app/assets/images/background.jpg";
import ink from "@/app/assets/icons/inkwell.svg";
import Image from "next/image";
import Icon from "./Icon";
import google from "@/app/assets/icons/google.png";

type AuthMode = "login" | "register";

interface AuthScreenProps {
  mode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
}

export default function AuthScreen({
  mode = "register",
  onModeChange,
}: AuthScreenProps) {
  const switchMode = () => {
    const newMode = mode === "register" ? "login" : "register";
    onModeChange?.(newMode);
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <div className="w-[50%] relative z-10">
        <Image
          src={image}
          alt="background image"
          className="w-full object-cover h-full"
        />
        {/* Overlay content */}
        <div className="absolute  inset-0 bg-linear-to-r from-[#0A1F11]/80 via-[#0A1F11]/80 to-[#0A1F11]/80  flex items-center justify-center">
          <div className="flex flex-col text-center items-center text-white space-y-10">
            <Image src={ink} alt="" />
            <div className="space-y-4">
              <h2 className="text-[38px] font-bold leading-12">
                Create an Article
                <br />
                that&apos;s worth sharing
              </h2>
              <p className="text-xs font-semibold">
                You can write from your heart, and make a person time <br />{" "}
                worth it. An original story draw the best views
              </p>
            </div>
            <div className="mt-20 flex items-center absolute bottom-28">
              <span className="merri text-xs font-medium">
                You can start for free and upgrade for better experience later.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white w-[50%] rounded-tl-[35px] rounded-bl-[35px] text-center flex flex-col justify-center items-center text-black absolute right-0 top-0 h-full z-20 shadow-2xl">
        <div className="w-full">
          <h1 className="inknut-antiqua font-extrabold text-xl text-[#2F4F3A]">
            {mode === "register" ? "Create an Account" : "Welcome Back"}
          </h1>

          <form className="px-10 mt-10 space-y-6">
            {/* Full Name field (only for register mode) */}
            {mode === "register" && (
              <div className=" flex flex-col relative">
                <label
                  htmlFor="fullName"
                  className="-top-1 left-5 font-bold absolute bg-white px-2 text-[8px] merri"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  className="w-full border rounded-xl border-[#00000047] px-4 py-4 text-[10px]"
                />
              </div>
            )}

            {/* Email field (both modes) */}
            <div className=" flex flex-col relative">
              <label
                htmlFor="email"
                className="-top-1 left-5 font-bold absolute bg-white px-2 text-[8px] merri"
              >
                Email Address
              </label>
              <input
                type="text"
                placeholder="Enter Valid Email"
                className="w-full border rounded-xl border-[#00000047] px-4 py-4 text-[10px]"
              />
            </div>

            {/* Password field (both modes) */}
            <div className=" flex flex-col relative">
              <label
                htmlFor="password"
                className="-top-1 left-5 font-bold absolute bg-white px-2 text-[8px] merri"
              >
                Password
              </label>
              <input
                type="password"
                placeholder={
                  mode === "register" ? "Create Password" : "Enter Password"
                }
                className="w-full border rounded-xl border-[#00000047] px-4 py-4 text-[10px]"
              />
            </div>

            {/* Terms checkbox (only for register mode) */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <p className="font-medium text-xs">
                  I agree to provided{" "}
                  <span className="font-bold text-[#2F4F3A]">
                    Term & Conditions
                  </span>
                </p>
              </div>
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    className="font-light text-[11px] hover:underline"
                  >
                    Forgotten Password?
                  </button>
                </div>
              )}
            </div>

            {/* Forgot Password (only for login mode) */}

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full text-sm bg-[#008080] text-white font-bold py-4 px-4 rounded-full hover:bg-[#008080] transition-colors"
              >
                {mode === "register" ? "Sign up" : "Sign in"}
              </button>
              <button
                type="button"
                className="w-full border border-[#00000047] flex items-center justify-center text-[#2F4F3A] py-4 px-4 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                <Icon name={google} size={20} className="mr-2" />
                {mode === "register"
                  ? "Sign up with Google"
                  : "Sign in with Google"}
              </button>
            </div>

            {/* Mode switch */}
            <div className="text-center">
              <span className="font-medium text-xs">
                {mode === "register"
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <button
                  type="button"
                  onClick={switchMode}
                  className="ml-1 text-[#2F4F3A] font-bold hover:underline"
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
