'use client';

import React from 'react';

interface DrawerFooterActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export const DrawerFooterActions: React.FC<DrawerFooterActionsProps> = ({
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="pt-4 border-t border-[#CFC3A6]/30 space-y-3">
      <p className="text-xs text-[#5F6575] leading-relaxed">
        ℹ️ Table is held until 20:20. Overdue reservations can be manually cancelled.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-3 border border-[#CFC3A6] hover:bg-[#F3EAD3]/40 text-[#1F2535] text-sm font-semibold rounded-xl transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};
