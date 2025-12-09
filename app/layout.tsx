// app/layout.tsx
import type { Metadata } from "next";
import './globals.css';
import { Lato } from 'next/font/google';
import SideNav from './components/SideNav';

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Inkwell",
  description: "Share your stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="bg-surface flex h-screen overflow-hidden">
        
        {/* Fixed Left Sidebar */}
        <SideNav />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto bg-surface">
          {/* This padding (p-10) matches the SideNav padding for vertical alignment */}
          <div className="w-full p-10">
             {children}
          </div>
        </main>

      </body>
    </html>
  );
}