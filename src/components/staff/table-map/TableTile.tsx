'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableTileProps {
  table: POSTable;
  isSelected: boolean;
  onClick: (table: POSTable) => void;
}

export const TableTile: React.FC<TableTileProps> = ({ table, isSelected, onClick }) => {
  // Figma v2 Status Style Tokens
  const getStatusStyle = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'bg-[#E1EDDD] border-[#8DBB98] text-[#2F6140]';
      case 'OCCUPIED':
        return 'bg-[#F8E7BE] border-[#D9A63E] text-[#7A4E06]';
      case 'PAY':
        return 'bg-[#DAEBF1] border-[#7FB1C4] text-[#245A72]';
      case 'RESERVED':
        return 'bg-[#E4E5F6] border-[#9B9FDB] text-[#3F4498]';
      case 'CLEAN':
        return 'bg-[#EDE6D6] border-[#A89F89] border-dashed text-[#5C574A]';
      case 'LATE':
        return 'bg-[#F8DCD5] border-[#D4806F] text-[#962B1A]';
      default:
        return 'bg-[#FFFDF7] border-[#CFC3A6] text-[#1F2535]';
    }
  };

  const getShapeStyle = () => {
    switch (table.shape) {
      case 'Round':
        return 'rounded-full';
      case 'Square':
        return 'rounded-2xl';
      case 'Long':
        return 'rounded-2xl';
    }
  };

  const statusLabel = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'Available';
      case 'OCCUPIED':
        return 'Occupied';
      case 'PAY':
        return 'Payment Pending';
      case 'RESERVED':
        return 'Reserved';
      case 'CLEAN':
        return 'Needs Cleaning';
      case 'LATE':
        return 'Overdue';
    }
  };

  return (
    <div
      onClick={() => onClick(table)}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }}
      className={`absolute cursor-pointer flex flex-col items-center justify-center p-2 border-[1.5px] transition-all hover:scale-[1.02] shadow-sm select-none ${getStatusStyle()} ${getShapeStyle()} ${
        isSelected ? 'ring-2 ring-offset-2 ring-[#F25C14]' : ''
      }`}
    >
      <span className="font-serif text-xl font-bold leading-none">{table.name}</span>

      {/* Meta text */}
      <span className="text-[11px] font-normal opacity-90 mt-0.5">
        {table.status === 'OCCUPIED' && table.durationMinutes
          ? `${table.durationMinutes}m · Group`
          : table.status === 'RESERVED' && table.reservedTime
          ? `${table.reservedTime} · ${table.capacity} guests`
          : table.status === 'PAY'
          ? `${table.currentGuests || 5}/${table.capacity} guests`
          : table.status === 'LATE'
          ? `${table.capacity} guests · at 19:30`
          : `${table.capacity} seats`}
      </span>

      {/* Status Subtitle */}
      <span className="text-[11px] font-semibold mt-0.5">
        {table.note ? table.note : statusLabel()}
      </span>
    </div>
  );
};
