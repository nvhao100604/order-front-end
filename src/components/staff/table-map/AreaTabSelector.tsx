'use client';

import React from 'react';
import { TableArea } from '@/types/posTableMap';

interface AreaTabSelectorProps {
  activeArea: TableArea;
  onAreaChange: (area: TableArea) => void;
  areaCounts: Record<TableArea, { available: number; total: number }>;
}

export const AreaTabSelector: React.FC<AreaTabSelectorProps> = ({
  activeArea,
  onAreaChange,
  areaCounts,
}) => {
  const areas: TableArea[] = ['Floor 1', 'Garden', 'VIP Room', 'Bar Area'];

  return (
    <div className="flex items-center gap-7 border-b border-[#CFC3A6]/40 pb-2">
      {areas.map((area) => {
        const isSelected = activeArea === area;
        const count = areaCounts[area] || { available: 0, total: 0 };
        const isFull = count.available === 0;

        return (
          <button
            key={area}
            onClick={() => onAreaChange(area)}
            className={`flex items-center gap-2 pb-2 text-base font-semibold transition-all relative cursor-pointer ${
              isSelected ? 'text-[#1F2535]' : 'text-[#5F6575] hover:text-[#1F2535]'
            }`}
          >
            <span>{area}</span>
            <span
              className={`text-xs font-normal ${
                isFull ? 'text-[#962B1A] font-medium' : 'text-[#2F6140]'
              }`}
            >
              {isFull ? 'Full' : `${count.available}/${count.total} open`}
            </span>
            {isSelected && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F2535] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
