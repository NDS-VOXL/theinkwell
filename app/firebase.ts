import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 🟢 1. Import the Storage getter

const firebaseConfig = {
  apiKey: "AIzaSyCwLxZI3xRPY_4SXVSiq9XUXNxu68wrs6Q",
  authDomain: "inkwell-7baa2.firebaseapp.com",
  projectId: "inkwell-7baa2",
  storageBucket: "inkwell-7baa2.firebasestorage.app",
  messagingSenderId: "689444628062",
  appId: "1:689444628062:web:f8ec33655cc8b46934b6cf",
  measurementId: "G-LHEJ3W2H4G"
};

// Prevent double-initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // 🟢 2. Export the storage instance