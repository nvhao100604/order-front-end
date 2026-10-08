'use client';

import React, { useState } from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableActionPopoverProps {
  table: POSTable | null;
  onClose: () => void;
  onConfirmOpenTable: (table: POSTable, guests: number) => void;
}

export const TableActionPopover: React.FC<TableActionPopoverProps> = ({
  table,
  onClose,
  onConfirmOpenTable,
}) => {
  const [selectedGuests, setSelectedGuests] = useState(6);

  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-[#1F2535]/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-[360px] bg-[#FFFDF7] rounded-2xl p-6 shadow-2xl border border-[#CFC3A6]/40 z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1F2535]">Open Table {table.name}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E1EDDD] text-[#2F6140] border border-[#8DBB98]">
              ● Available
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#5F6575]">{table.capacity} seats · +1 extra chair max</p>

        {/* Warning banner */}
        <div className="p-3 bg-[#F8E7BE] border border-[#D9A63E] rounded-xl text-xs text-[#7A4E06] font-medium">
          ⚠️ Table has a reservation at 19:30 (40m left). Continue serving?
        </div>

        {/* Keypad 1-8 */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedGuests(num)}
              className={`h-11 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                selectedGuests === num
                  ? 'bg-[#1F2535] text-[#FBF5E4] shadow-sm'
                  : 'bg-[#F3EAD3] text-[#1F2535] hover:bg-[#CFC3A6]'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirmOpenTable(table, selectedGuests)}
          className="w-full py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          Open Table & Take Order
        </button>
      </div>
    </div>
  );
};
