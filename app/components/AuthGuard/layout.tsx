// app/layout.tsx
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

import { ProfileProvider } from '../../profile/profileContent'; 
import AuthGuard from '../AuthGuard/authGuard'; // 🟢 1. Import the new Guard

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Inkwell",
  description: "Share your stories",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="bg-surface flex h-screen overflow-hidden">
        
        {/* 🟢 2. Wrap the app in the AuthGuard */}
        <AuthGuard>
          <ProfileProvider>
            
            <main className="flex-1 h-screen overflow-y-auto bg-surface">
              <div className="w-full">{children}</div>
            </main>
            
          </ProfileProvider>
        </AuthGuard>
        
      </body>
    </html>
  );
}