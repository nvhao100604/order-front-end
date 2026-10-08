'use client';

import React from 'react';

export const LegendBar: React.FC = () => {
  const items = [
    { label: 'Available', color: 'bg-[#8DBB98]' },
    { label: 'Occupied', color: 'bg-[#D9A63E]' },
    { label: 'Payment Pending', color: 'bg-[#7FB1C4]' },
    { label: 'Reserved', color: 'bg-[#9B9FDB]' },
    { label: 'Needs Cleaning', color: 'bg-[#A89F89]' },
    { label: 'Overdue', color: 'bg-[#D4806F]' },
    { label: 'Linked Group (Shared Order)', isLink: true },
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-[#5F6575] py-2 flex-wrap">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {item.isLink ? (
            <span className="text-[#9B9FDB] font-bold">🔗</span>
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
