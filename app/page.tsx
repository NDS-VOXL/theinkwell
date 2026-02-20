"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";

export default function RootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      router.push("/home");
    }
  }, [router]);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    router.push("/home");
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AuthScreen 
      mode={authMode} 
      onModeChange={setAuthMode} 
      onLogin={handleLogin} 
      onRegister={handleLogin} 
    />
  );
}