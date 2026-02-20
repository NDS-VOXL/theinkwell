"use client";

import { Bell, Home, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 🟢 1. Updated hrefs to match the new /home folder structure
const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Profile", href: "/home/profile", icon: User },
  { name: "Notifications", href: "/home/notifications", icon: Bell },
  { name: "Settings", href: "/home/settings", icon: Settings },
];

interface SideNavProps {
  onLogout: () => void;
}

export default function SideNav({ onLogout }: SideNavProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen sticky top-0 flex flex-col justify-between py-10 bg-white rounded-tr-[20px] shadow-sm z-50">
      
      <div className="flex flex-col items-center w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/home">
            <Image
              src="/deink-green.png"
              alt="De Inkwell Logo"
              width={100}
              height={48}
              priority
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center w-full gap-2">
          {navItems.map((item) => {
            // 🟢 2. Updated Active Logic: Checks if current path starts with the link href
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-8 py-3 rounded-2xl w-[85%] transition-all duration-300 ease-in-out font-lato ${
                  isActive
                    ? "bg-green-900 text-white shadow-lg font-bold" 
                    : "text-gray-500 hover:text-[#008080] hover:bg-gray-50 font-normal"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center w-full mt-auto">
        <button 
          onClick={onLogout}
          className="
            flex items-center justify-center 
            w-4/5 
            bg-white 
            text-black
            border-[0.5px] border-gray-300 
            rounded-[5px] 
            shadow-[0px_0px_2px_0px_rgba(0,0,0,0.25)] 
            gap-2 
            px-2 py-3 
            hover:bg-gray-50 transition-all
          "
        >
          <LogOut size={20} className="rotate-180" />
          <span className="text-base font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}