// app/components/RightSidebar.tsx
'use client';

import { TrendingUp, UserPlus, Users } from 'lucide-react';
import Image from 'next/image';

export default function RightSidebar() {
  return (
    <aside className="w-80 hidden xl:flex flex-col gap-8 shrink-0">
      
      {/* WIDGET 1: Your Highlights */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-900 font-lato">Your Highlights</h3>
        
        {/* Card 1: Engagements */}
        <div className="bg-[#FDFBF7] p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Your articles engagements went up by <span className="text-teal-700 font-bold">2%</span> yesterday
          </p>
        </div>

        {/* Card 2: Followers */}
        <div className="bg-[#FDFBF7] p-4 rounded-2xl flex items-center gap-4">
           <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
            <UserPlus className="text-white w-5 h-5" />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Your profile gained <span className="text-teal-700 font-bold">14</span> new followers
          </p>
        </div>

        {/* Card 3: Profile Visits */}
        <div className="bg-[#FDFBF7] p-4 rounded-2xl flex items-center gap-4">
           <div className="w-10 h-10 bg-teal-700 rounded-lg flex items-center justify-center shrink-0">
            <Users className="text-white w-5 h-5" />
          </div>
          <p className="text-sm text-gray-700 font-medium">
            Your profile was visited by <span className="text-teal-700 font-bold">20</span> new people
          </p>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-dashed border-gray-300"></div>

      {/* WIDGET 2: Suggested Writers */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
           <h3 className="text-lg font-bold text-gray-900 font-lato">Suggested Writers</h3>
           <span className="text-xs text-gray-400">Based on your profile</span>
        </div>
        
        {/* We can map through users here later */}
        {/* Placeholder for Writer List */}
        <div className="bg-[#FDFBF7] p-4 rounded-2xl h-40 flex items-center justify-center text-gray-400 text-sm">
           User List Component Here...
        </div>
      </div>

    </aside>
  );
}