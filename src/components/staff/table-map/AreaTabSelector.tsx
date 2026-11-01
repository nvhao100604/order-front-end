'use client';

import React from 'react';
import { TableArea } from '@/types/posTableMap';
import { Layers } from 'lucide-react';

interface AreaTabSelectorProps {
  activeArea: TableArea;
  onAreaChange: (area: TableArea) => void;
  areaCounts: Record<TableArea, { available: number; total: number }>;
  areas?: TableArea[];
}

export const AreaTabSelector: React.FC<AreaTabSelectorProps> = ({
  activeArea,
  onAreaChange,
  areaCounts,
  areas = ['Floor 1', 'Garden', 'VIP Room', 'Bar Area'],
}) => {
  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold uppercase tracking-wider shrink-0 pr-3 border-r border-stone-200">
        <Layers className="w-3.5 h-3.5 text-stone-500" />
        <span>Floor</span>
      </div>

      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
        {areas.map((area) => {
          const isSelected = activeArea === area;
          const count = areaCounts[area] || { available: 0, total: 0 };
          const isFull = count.available === 0 && count.total > 0;

          return (
            <button
              key={area}
              onClick={() => onAreaChange(area)}
              className={`flex items-center gap-2 pb-1.5 text-sm font-semibold transition-all relative cursor-pointer whitespace-nowrap ${
                isSelected ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <span>{area}</span>
              <span
                className={`text-xs font-medium tabular-nums ${
                  isFull ? 'text-red-600' : 'text-emerald-700'
                }`}
              >
                {isFull ? 'Full' : `${count.available}/${count.total} open`}
              </span>
              {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
