'use client';

import React from 'react';

export const DrawerHoldWindowBanner: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-[#F3EAD3]/60 rounded-xl text-xs text-[#5F6575]">
      <span>⏱️</span>
      <span>Hold table from 20:00 · expected seating 20:30 – 22:00</span>
    </div>
  );
};
