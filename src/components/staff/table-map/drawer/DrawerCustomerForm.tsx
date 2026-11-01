'use client';

import React from 'react';

interface DrawerCustomerFormProps {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  email?: string;
  onEmailChange?: (val: string) => void;
  note: string;
  onNoteChange: (val: string) => void;
}

export const DrawerCustomerForm: React.FC<DrawerCustomerFormProps> = ({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  email = '',
  onEmailChange,
  note,
  onNoteChange,
}) => {
  return (
    <div className="space-y-3 pt-1">
      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Customer Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Mr. Nam"
          className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
            Phone *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="0901 234 567"
            className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            placeholder="guest@mail.com"
            className="w-full p-2.5 rounded-xl border border-[#CFC3A6]/60 bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Special Notes
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
