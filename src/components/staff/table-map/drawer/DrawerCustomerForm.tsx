'use client';

import React from 'react';

interface DrawerCustomerFormProps {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  note: string;
  onNoteChange: (val: string) => void;
}

export const DrawerCustomerForm: React.FC<DrawerCustomerFormProps> = ({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  note,
  onNoteChange,
}) => {
  return (
    <div className="space-y-3 pt-1">
      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Customer Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>

      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Notes
        </label>
        <input
          type="text"
          placeholder="e.g. Birthday, high chair needed"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>
    </div>
  );
};
