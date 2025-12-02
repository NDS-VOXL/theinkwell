"use client";

import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";

export default function Home() {
  // const [showSplash, setShowSplash] = useState(true);

  // const handleSplashComplete = () => {
  //   setShowSplash(false);
  // };

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    // TODO: Implement actual login logic
  };

  const handleRegister = (email: string, password: string, name: string) => {
    console.log("Register attempt:", { email, password, name });
    // TODO: Implement actual registration logic
  };

  return (
    <div className="">
      {/* {showSplash && <SplashScreen onComplete={handleSplashComplete} />} */}
      {/* {!showSplash && ( */}
        {/* <AuthScreen onLogin={handleLogin} onRegister={handleRegister} /> */}
      {/* )} */}
    </div>
  );
}
