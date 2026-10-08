'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableQuickPanelProps {
  table: POSTable | null;
  onOrderClick: () => void;
  onPaymentClick: () => void;
  onTransferClick: () => void;
  onSplitTableClick: () => void;
  onSplitBillClick: () => void;
}

export const TableQuickPanel: React.FC<TableQuickPanelProps> = ({
  table,
  onOrderClick,
  onPaymentClick,
  onTransferClick,
  onSplitTableClick,
  onSplitBillClick,
}) => {
  if (!table) {
    return (
      <div className="w-[416px] h-[576px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex items-center justify-center text-[#5F6575]">
        Select a table on the map to view details
      </div>
    );
  }

  const items = table.orderItems || [
    { id: '1', name: 'Beef Pho', quantity: 3, price: 75000 },
    { id: '2', name: 'Spring Rolls', quantity: 1, price: 40000 },
    { id: '3', name: 'Orange Juice', quantity: 4, price: 30000 },
  ];
  const totalPrice = table.totalPrice || 355000;

  return (
    <div className="w-[416px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CFC3A6]/30">
          <h2 className="font-serif text-2xl font-bold text-[#1F2535]">Table {table.name}</h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F8E7BE] text-[#7A4E06] border border-[#D9A63E]/60">
            ● Occupied
          </span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 py-3 text-xs text-[#5F6575]">
          <span>👥 6/8 guests</span>
          <span>⏱️ 35 mins</span>
          <span className="text-[#3F4498] font-medium">🔗 Group B2, B6</span>
        </div>

        {/* Order Item List */}
        <div className="space-y-2.5 py-3 border-t border-b border-[#CFC3A6]/30">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-[#1F2535]">
              <span>{item.name}</span>
              <span className="text-[#5F6575] font-medium">x{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-4">
          <span className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">Total Amount</span>
          <div className="font-serif text-2xl font-bold text-[#1F2535]">
            {totalPrice.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-[#5F6575]">đ</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOrderClick}
            className="py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Take Order
          </button>
          <button
            onClick={onPaymentClick}
            className="py-3 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Pay
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onTransferClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Transfer
          </button>
          <button
            onClick={onSplitTableClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Split Table
          </button>
          <button
            onClick={onSplitBillClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            Split Bill
          </button>
        </div>
      </div>
    </div>
  );
};
