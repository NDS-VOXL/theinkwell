"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  name: string;
  bio: string;
  avatar: string;
}

interface ProfileContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  // 1. Start completely empty so there is no fake mock data
  const [user, setUser] = useState<UserProfile>({
    name: "",
    bio: "",
    avatar: "",
  });

  // 2. Hydrate from localStorage when the app loads
  useEffect(() => {
    // 🟢 The Fix: Pushes the state update to the next tick to prevent the cascading render warning
    setTimeout(() => {
      setUser({
        name: localStorage.getItem("userName") || "New User",
        bio: localStorage.getItem("userBio") || "",
        avatar: localStorage.getItem("userAvatar") || "",
      });
    }, 0);
  }, []);

  // 3. Update state AND localStorage simultaneously
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updates };
      
      if (updates.name !== undefined) localStorage.setItem("userName", updates.name);
      if (updates.bio !== undefined) localStorage.setItem("userBio", updates.bio);
      if (updates.avatar !== undefined) localStorage.setItem("userAvatar", updates.avatar);
      
      return newUser;
    });
  };

  return (
    <ProfileContext.Provider value={{ user, updateUser }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}