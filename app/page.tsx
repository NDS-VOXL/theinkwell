"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
import AuthScreen from "./components/AuthScreen";
import Toast from "./components/Toast"; 

import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged, // 🟢 New: The Auth Listener
  User 
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, googleProvider, db } from "@/app/firebase";

export default function RootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ─── 🟢 THE PERSISTENCE ENGINE ───
  useEffect(() => {
    // This listener runs as soon as the app loads
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in! 
        localStorage.setItem("isLoggedIn", "true");
        router.replace("/home"); 
      } else {
        // No user found, show the login screen after the splash
        setTimeout(() => setShowSplash(false), 2000); 
      }
    });

    return () => unsubscribe(); // Cleanup the listener
  }, [router]);

  // ─── FIRESTORE SYNC ───
  const syncUserToFirestore = async (user: User, customName?: string) => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: customName || user.displayName || "Inkwell Writer",
        email: user.email,
        avatar: user.photoURL || "",
        bio: "",
        createdAt: serverTimestamp(),
      });
    }

    localStorage.setItem("isLoggedIn", "true");
  };

  // ─── AUTH HANDLERS ───
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToFirestore(result.user);
      setToast({ message: "Signed in with Google!", type: "success" });
      // Navigation happens automatically via onAuthStateChanged
    } catch (error: unknown) {
      setToast({ message: "Google sign-in failed", type: "error" });
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setToast({ message: "Welcome back!", type: "success" });
    } catch (error: unknown) {
      setToast({ message: "Invalid email or password.", type: "error" });
    }
  };

  const handleEmailRegister = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await syncUserToFirestore(result.user, name);
      setToast({ message: "Account created!", type: "success" });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      setToast({ message: msg, type: "error" });
    }
  };

  // While checking auth, we show the Splash Screen
  if (showSplash) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <AuthScreen 
        mode={authMode} 
        onModeChange={setAuthMode} 
        onLogin={handleEmailLogin} 
        onRegister={handleEmailRegister} 
        onGoogleSignIn={handleGoogleSignIn}
      />
    </>
  );
}