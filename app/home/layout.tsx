"use client";

import SideNav from "@/app/components/SideNav";
import TopHeader from '@/app/components/TopHeader';
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/"); // Send back to the root Login page
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <SideNav onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto overflow-x-hidden bg-surface">
        <div className="w-full max-w-[1300px] mx-auto px-6 md:px-10 py-6 pb-20">
          <TopHeader />
          {children}
        </div>
      </main>
    </div>
  );
}