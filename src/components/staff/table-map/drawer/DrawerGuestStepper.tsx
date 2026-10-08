'use client';

import React from 'react';

interface DrawerGuestStepperProps {
  guests: number;
  onGuestsChange: (count: number) => void;
  date: string;
  onDateChange: (val: string) => void;
  time: string;
  onTimeChange: (val: string) => void;
}

export const DrawerGuestStepper: React.FC<DrawerGuestStepperProps> = ({
  guests,
  onGuestsChange,
  date,
  onDateChange,
  time,
  onTimeChange,
}) => {
  return (
    <div className="flex items-end gap-3 pt-2">
      {/* Guests Stepper */}
      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Guests
        </label>
        <div className="flex items-center gap-3 bg-[#FFFDF7] border border-[#CFC3A6]/60 rounded-xl p-1.5">
          <button
            type="button"
            onClick={() => onGuestsChange(Math.max(1, guests - 1))}
            className="w-8 h-8 rounded-full border border-[#CFC3A6] bg-[#FFFDF7] text-lg font-bold text-[#1F2535] flex items-center justify-center cursor-pointer hover:bg-[#F3EAD3]"
          >
            −
          </button>
          <span className="font-serif text-xl font-bold text-[#1F2535] w-6 text-center">
            {guests}
          </span>
          <button
            type="button"
            onClick={() => onGuestsChange(guests + 1)}
            className="w-8 h-8 rounded-full border border-[#CFC3A6] bg-[#FFFDF7] text-lg font-bold text-[#1F2535] flex items-center justify-center cursor-pointer hover:bg-[#F3EAD3]"
          >
            +
          </button>
        </div>
      </div>

      {/* Date Field */}
      <div className="flex-1">
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Date
        </label>
        <input
          type="text"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] font-medium focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>

      {/* Time Field */}
      <div className="w-24">
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Time
        </label>
        <input
          type="text"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] font-medium focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>
    </div>
  );
};
