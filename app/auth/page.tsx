'use client'

import React, { useState } from "react";
import AuthScreen from "../components/AuthScreen";

type AuthMode = "login" | "register";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("register");

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return <AuthScreen mode={mode} onModeChange={handleModeChange} />;
};

export default Auth;
