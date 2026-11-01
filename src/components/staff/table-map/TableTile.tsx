'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableTileProps {
  table: POSTable;
  isSelected: boolean;
  onClick: (table: POSTable) => void;
}

export const TableTile: React.FC<TableTileProps> = ({ table, isSelected, onClick }) => {
  // 1. Physical Shape based on capacity or shape attribute
  const getShapeClasses = () => {
    if (table.capacity <= 2 || table.shape === 'Round') {
      return 'rounded-full aspect-square w-28 h-28 flex flex-col items-center justify-center';
    }
    if (table.capacity > 4 || table.shape === 'Long') {
      return 'rounded-2xl w-48 h-32 flex flex-col items-center justify-center';
    }
    // Default 4 seats / Square
    return 'rounded-2xl aspect-square w-32 h-32 flex flex-col items-center justify-center';
  };

  // 2. Status Color Tokens
  const getStatusClasses = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'bg-emerald-50/90 border-emerald-300 text-emerald-900 hover:border-emerald-500';
      case 'OCCUPIED':
        return 'bg-amber-50/90 border-amber-300 text-amber-900 hover:border-amber-500';
      case 'RESERVED':
        return 'bg-blue-50/90 border-blue-300 text-blue-900 hover:border-blue-500';
      case 'PAY':
        return 'bg-sky-50/90 border-sky-300 text-sky-900 hover:border-sky-500';
      case 'CLEAN':
        return 'bg-stone-100/90 border-stone-300 text-stone-700 hover:border-stone-400';
      case 'LATE':
        return 'bg-red-50/90 border-red-300 text-red-900 hover:border-red-500';
      default:
        return 'bg-stone-50/90 border-stone-300 text-stone-800 hover:border-stone-400';
    }
  };

  const getStatusLabel = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'Available';
      case 'OCCUPIED':
        return 'Occupied';
      case 'RESERVED':
        return 'Reserved';
      case 'PAY':
        return 'Payment';
      case 'CLEAN':
        return 'Cleaning';
      case 'LATE':
        return 'Overdue';
      default:
        return table.status;
    }
  };

  return (
    <div
      onClick={() => onClick(table)}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
      }}
      className={`absolute cursor-pointer border-2 shadow-sm hover:shadow-md transition-all select-none p-2 ${getShapeClasses()} ${getStatusClasses()} ${
        isSelected
          ? 'ring-4 ring-orange-500/20 border-orange-600 shadow-md scale-[1.02]'
          : ''
      }`}
    >
      {/* Table Name */}
      <span className="font-sans font-bold text-lg tracking-tight leading-tight">
        {table.name}
      </span>

      {/* Seats count */}
      <span className="text-xs opacity-75 font-medium tabular-nums mt-0.5">
        {table.status === 'PAY' && table.currentGuests
          ? `${table.currentGuests}/${table.capacity} seats`
          : `${table.capacity} seats`}
      </span>

      {/* Status badge pill */}
      <span className="text-[11px] font-semibold uppercase tracking-wider mt-1 px-2.5 py-0.5 rounded-full bg-white/60 shadow-2xs leading-none">
        {getStatusLabel()}
      </span>
    </div>
  );
};
