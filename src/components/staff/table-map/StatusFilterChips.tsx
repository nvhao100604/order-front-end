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
  const filters: { id: TableStatus | 'ALL'; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: statusCounts.ALL ?? 0 },
    { id: 'EMPTY', label: 'Available', count: statusCounts.EMPTY ?? 0 },
    { id: 'OCCUPIED', label: 'Occupied', count: statusCounts.OCCUPIED ?? 0 },
    { id: 'PAY', label: 'Payment', count: statusCounts.PAY ?? 0 },
    { id: 'RESERVED', label: 'Reserved', count: statusCounts.RESERVED ?? 0 },
    { id: 'CLEAN', label: 'Cleaning', count: statusCounts.CLEAN ?? 0 },
    { id: 'LATE', label: 'Overdue', count: statusCounts.LATE ?? 0 },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      {filters.map((f) => {
        const isSelected = activeStatusFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border cursor-pointer tabular-nums flex items-center gap-1.5 ${
              isSelected
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs font-semibold'
                : 'bg-white text-stone-600 border-stone-200/80 hover:bg-stone-50'
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                isSelected ? 'bg-stone-700 text-stone-100' : 'bg-stone-100 text-stone-500'
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
