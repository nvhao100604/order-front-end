'use client';

import React from 'react';
import { TableStatus } from '@/types/posTableMap';

interface StatusFilterChipsProps {
  activeStatusFilter: TableStatus | 'ALL';
  onFilterChange: (status: TableStatus | 'ALL') => void;
  statusCounts: Record<TableStatus | 'ALL', number>;
}

export const StatusFilterChips: React.FC<StatusFilterChipsProps> = ({
  activeStatusFilter,
  onFilterChange,
  statusCounts,
}) => {
  const filters: { id: TableStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: `All ${statusCounts.ALL ?? 0}` },
    { id: 'EMPTY', label: `Available ${statusCounts.EMPTY ?? 0}` },
    { id: 'OCCUPIED', label: `Occupied ${statusCounts.OCCUPIED ?? 0}` },
    { id: 'PAY', label: `Payment ${statusCounts.PAY ?? 0}` },
    { id: 'RESERVED', label: `Reserved ${statusCounts.RESERVED ?? 0}` },
    { id: 'CLEAN', label: `Cleaning ${statusCounts.CLEAN ?? 0}` },
    { id: 'LATE', label: `Overdue ${statusCounts.LATE ?? 0}` },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      {filters.map((f) => {
        const isSelected = activeStatusFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer ${
              isSelected
                ? 'bg-[#1F2535] text-[#FBF5E4] border-[#1F2535] shadow-sm font-semibold'
                : 'bg-[#FFFDF7] text-[#5F6575] border-[#CFC3A6]/60 hover:bg-[#F3EAD3]/50'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};
