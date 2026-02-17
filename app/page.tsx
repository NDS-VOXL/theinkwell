"use client";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";

export default function Home() {
  // 1. Uncomment the state
  const [showSplash, setShowSplash] = useState(true);

  // 2. Uncomment the completion handler
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
  };

  const handleRegister = (email: string, password: string, name: string) => {
    console.log("Register attempt:", { email, password, name });
  };

  return (
    <div className="">
      {/* 3. Uncomment these lines below to make them active */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </div>
  );
}