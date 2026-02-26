"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import ArticleCard from "../components/ArticleCard";

interface UserData {
  name: string;
  bio: string;
  avatar: string;
}

interface ProfileContextType {
  user: UserData;
  updateUser: (newData: Partial<UserData>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>({
    name: "Loveren Paul",
    bio: "I find Comfort In my pain",
    avatar: "/user-avatar.jpg", // Ensure this image is in your public folder!
  });

  const updateUser = (newData: Partial<UserData>) => {
    setUser((prev) => ({ ...prev, ...newData }));
  };

  return (
    <>
      <ProfileContext.Provider value={{ user, updateUser }}>
        {children}
      </ProfileContext.Provider>
     
    </>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
