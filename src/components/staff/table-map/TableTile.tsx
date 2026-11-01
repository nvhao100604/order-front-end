'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { Users, Clock } from 'lucide-react';

interface TableTileProps {
  table: POSTable;
  isSelected: boolean;
  onClick: (table: POSTable) => void;
}

export const TableTile: React.FC<TableTileProps> = ({ table, isSelected, onClick }) => {
  const getStatusBadge = () => {
    switch (table.status) {
      case 'EMPTY':
        return {
          label: 'Available',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case 'OCCUPIED':
        return {
          label: 'Occupied',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      case 'PAY':
        return {
          label: 'Payment',
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
          dotClass: 'bg-sky-500',
        };
      case 'RESERVED':
        return {
          label: 'Reserved',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-500',
        };
      case 'CLEAN':
        return {
          label: 'Cleaning',
          badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
          dotClass: 'bg-stone-400',
        };
      case 'LATE':
        return {
          label: 'Overdue',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          dotClass: 'bg-red-500',
        };
      default:
        return {
          label: table.status,
          badgeClass: 'bg-stone-50 text-stone-700 border-stone-200',
          dotClass: 'bg-stone-400',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div
      onClick={() => onClick(table)}
      className={`relative bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[116px] select-none ${
        isSelected
          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
          : 'border-stone-200/90 hover:border-stone-300'
      }`}
    >
      {/* Top Header: Table Name & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-sans text-base font-bold text-stone-900 leading-tight">
            {table.name}
          </h3>
          <p className="text-[11px] text-stone-400 mt-0.5">{table.shape || 'Standard'}</p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusInfo.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
          <span>{statusInfo.label}</span>
        </span>
      </div>

      {/* Bottom Row: Capacity and Time / Note */}
      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 mt-2">
        <div className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-stone-400" />
          <span className="tabular-nums font-medium">
            {table.status === 'PAY' && table.currentGuests
              ? `${table.currentGuests}/${table.capacity} guests`
              : `${table.capacity} seats`}
          </span>
        </div>

        {table.status === 'OCCUPIED' && table.durationMinutes ? (
          <div className="flex items-center gap-1 text-amber-700 font-semibold tabular-nums text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{table.durationMinutes}m</span>
          </div>
        ) : table.status === 'RESERVED' && table.reservedTime ? (
          <div className="flex items-center gap-1 text-blue-700 font-medium tabular-nums text-[11px]">
            <Clock className="w-3 h-3" />
            <span>{table.reservedTime}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
