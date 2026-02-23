// app/layout.tsx
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

// 🟢 1. Import your ProfileProvider
// Make sure this path matches where you saved the file! 
// If it's inside the 'app' folder, use '@/app/context/ProfileContext'
import { ProfileProvider } from '@/app/profile/profileContent'; 

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

// 🟢 Fixed typos here (viewport and initialScale)
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// 🟢 2. Only ONE RootLayout function
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="bg-surface flex h-screen overflow-hidden">
        
        {/* 🟢 3. Wrap everything inside the body with the ProfileProvider */}
        <ProfileProvider>
          
          {/* Fixed Left Sidebar */}
          

          {/* Scrollable Main Content Area */}
          <main className="flex-1 h-screen overflow-y-auto bg-surface">
            {/* This padding (p-10) matches the SideNav padding for vertical alignment */}
            <div className="w-full">{children}</div>
          </main>
          
        </ProfileProvider>
        
      </body>
    </html>
  );
}