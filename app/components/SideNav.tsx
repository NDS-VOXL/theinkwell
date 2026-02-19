// app/components/SideNav.tsx
"use client";

import { Bell, Home, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    // 🟢 bg-sidebar-bg (White) and rounded-tr-sidebar (Curved Corner)
    <aside className="w-60 h-screen sticky top-0 flex flex-col justify-between py-10 bg-sidebar-bg rounded-tr-sidebar shadow-sm z-50 bg-white rounded-tr-[20px]">
      {/* Top Section */}
      <div className="flex flex-col items-center w-full">
        {/* Logo Section - Uses inkwell-teal color */}
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/deink-green.png"
            alt="De Inkwell Logo"
            width={100} // 84.9306640625 rounded to 85
            height={48} // 47.56193542480469 rounded to 48
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center w-full  ">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1 px-8 py-3 rounded-2xl w-4/5 transition-all duration-300 ease-in-out text-gray-500 font-normal font-lato  ${
                  isActive
                    ? "bg-green-900 text-white shadow-lg shadow-teal-900/10 font-bold" // Active: Teal BG, White Text
                    : "text-gray-text hover:text-inkwell-teal hover:bg-gray-50" // Inactive: Gray Text
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-base ">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center w-full mt-auto ">
        <button 
          className="
            flex items-center justify-center 
            w-4/5 
            bg-white 
            text-black
            border-[0.5px] border-gray-300 
            rounded-[5px] 
            shadow-[0px_0px_2px_0px_rgba(0,0,0,0.40)] 
            gap-[2px] 
            px-[8px] py-3 
            hover:bg-gray-50 transition-all
          "
        >
          {/* Rotate the icon 180deg to match the 'exit left' style in your Figma */}
          <LogOut size={20} className="rotate-180" />
          <span className="text-base font-medium">Log out</span>
        </button>
      </div>
    </aside>
  );
}
