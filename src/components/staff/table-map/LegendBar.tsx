'use client';

import React from 'react';
import { Link2 } from 'lucide-react';

export const LegendBar: React.FC = () => {
  const items = [
    { label: 'Available', color: 'bg-emerald-500' },
    { label: 'Occupied', color: 'bg-amber-500' },
    { label: 'Payment Pending', color: 'bg-sky-500' },
    { label: 'Reserved', color: 'bg-blue-500' },
    { label: 'Needs Cleaning', color: 'bg-stone-400' },
    { label: 'Overdue', color: 'bg-red-500' },
    { label: 'Linked Group', isLink: true },
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-stone-500 py-2 flex-wrap">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {item.isLink ? (
            <Link2 className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
