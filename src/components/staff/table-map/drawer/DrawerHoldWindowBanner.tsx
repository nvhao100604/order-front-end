'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export const DrawerHoldWindowBanner: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-[#F3EAD3]/60 rounded-xl text-xs text-[#5F6575]">
      <Clock className="w-3.5 h-3.5 text-[#5F6575] shrink-0" />
      <span>Hold table from 20:00 · expected seating 20:30 – 22:00</span>
    </div>
  );
};
