// app/layout.tsx
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

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

export const viewPort = {
  width: "device-width",
  intialScale: 1,
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
       

        {/* Scrollable Main Content Area */}
        <main className="flex-1 h-screen overflow-y-auto bg-surface">
          {/* This padding (p-10) matches the SideNav padding for vertical alignment */}
          <div className="w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
