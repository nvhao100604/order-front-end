'use client';

import React from 'react';

export interface TableOption {
  id: string;
  title: string;
  detail: string;
  recommended?: boolean;
  tag?: string;
  isWarning?: boolean;
}

interface DrawerTableOptionsListProps {
  options: TableOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const DrawerTableOptionsList: React.FC<DrawerTableOptionsListProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <div>
      <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-2">
        Suitable Tables · 20:30 – 22:00
      </label>
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#E1EDDD] border-[#8DBB98] shadow-xs'
                  : opt.isWarning
                  ? 'bg-[#F3EAD3]/40 border-[#CFC3A6]/60'
                  : 'bg-[#FFFDF7] border-[#CFC3A6]/60 hover:bg-[#F3EAD3]/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-[#2F6140] bg-[#2F6140]' : 'border-[#CFC3A6]'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1F2535]">{opt.title}</p>
                  <p
                    className={`text-xs ${
                      opt.isWarning ? 'text-[#962B1A]' : 'text-[#5F6575]'
                    }`}
                  >
                    {opt.detail}
                  </p>
                </div>
              </div>

              {opt.tag && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1F2535] text-[#FBF5E4]">
                  {opt.tag}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
