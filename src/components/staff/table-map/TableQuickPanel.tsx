'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { IOrderResponse } from '@/interfaces';
import {
  GitMerge,
  UtensilsCrossed,
  CreditCard,
  Users,
  FileText,
  Link2,
} from 'lucide-react';

interface TableQuickPanelProps {
  table: POSTable | null;
  order?: IOrderResponse | null;
  onOrderClick: () => void;
  onPaymentClick: () => void;
  onTransferClick: () => void;
  onSplitTableClick: () => void;
  onSplitBillClick: () => void;
  onMergeClick?: () => void;
  onQuickOrderClick?: () => void;
}

export const TableQuickPanel: React.FC<TableQuickPanelProps> = ({
  table,
  order,
  onOrderClick,
  onPaymentClick,
  onTransferClick,
  onSplitTableClick,
  onSplitBillClick,
  onMergeClick,
  onQuickOrderClick,
}) => {
  if (!table) {
    return (
      <div className="w-[416px] h-[576px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex items-center justify-center text-[#5F6575]">
        Select a table on the map to view details
      </div>
    );
  }

  const orderDetails = order?.details || [];
  const totalPrice = order?.totalPrice || 0;

  const getStatusDotColor = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'bg-[#2F6140]';
      case 'OCCUPIED':
        return 'bg-[#7A4E06]';
      case 'PAY':
        return 'bg-[#245A72]';
      case 'RESERVED':
        return 'bg-[#3F4498]';
      case 'CLEAN':
        return 'bg-[#5C574A]';
      case 'LATE':
        return 'bg-[#962B1A]';
      default:
        return 'bg-[#5F6575]';
    }
  };

  return (
    <div className="w-[416px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CFC3A6]/30">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1F2535]">Table {table.name}</h2>
            <p className="text-xs text-[#5F6575] mt-0.5">{table.area}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              table.status === 'EMPTY'
                ? 'bg-[#E1EDDD] text-[#2F6140] border border-[#8DBB98]'
                : table.status === 'OCCUPIED'
                ? 'bg-[#F8E7BE] text-[#7A4E06] border border-[#D9A63E]/60'
                : 'bg-[#DAEBF1] text-[#245A72] border border-[#7FB1C4]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${getStatusDotColor()}`} />
            <span>{table.status}</span>
          </span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 py-3 text-xs text-[#5F6575] flex-wrap">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#5F6575]" />
            <span>{table.capacity} seats</span>
          </div>

          {order && (
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-[#5F6575]" />
              <span>Order #{order.id} ({order.status})</span>
            </div>
          )}

          {table.mergedWithId && (
            <div className="flex items-center gap-1 text-[#3F4498] font-medium">
              <Link2 className="w-3.5 h-3.5" />
              <span>Merged {table.mergedWithId}</span>
            </div>
          )}
        </div>

        {/* Real Order Item List */}
        <div className="space-y-2.5 py-3 border-t border-b border-[#CFC3A6]/30 max-h-48 overflow-y-auto">
          {orderDetails.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#5F6575] space-y-2">
              <p>No items ordered for this table yet.</p>
              {onQuickOrderClick && (
                <button
                  type="button"
                  onClick={onQuickOrderClick}
                  className="px-3 py-1.5 bg-[#F25C14]/10 hover:bg-[#F25C14]/20 text-[#F25C14] text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>Quick Order Now</span>
                </button>
              )}
            </div>
          ) : (
            orderDetails.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-center text-sm text-[#1F2535]">
                <div className="flex flex-col">
                  <span className="font-medium text-xs sm:text-sm">
                    {item.dish?.name || `Item #${item.dishID}`}
                  </span>
                  <span className="text-[11px] text-[#5F6575]">
                    {item.price.toLocaleString('en-US')} VND
                  </span>
                </div>
                <span className="text-[#5F6575] font-semibold text-xs sm:text-sm">
                  x{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-4">
          <span className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">
            Total Amount
          </span>
          <div className="font-serif text-2xl font-bold text-[#1F2535]">
            {totalPrice.toLocaleString('en-US')}{' '}
            <span className="text-sm font-sans font-normal text-[#5F6575]">VND</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-6">
        <div className="grid grid-cols-2 gap-2">
          {onQuickOrderClick ? (
            <button
              onClick={onQuickOrderClick}
              className="py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Quick Order</span>
            </button>
          ) : (
            <button
              onClick={onOrderClick}
              className="py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Take Order
            </button>
          )}

          <button
            onClick={onPaymentClick}
            className="py-3 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-4 h-4 text-[#5F6575]" />
            <span>Pay</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onMergeClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            <GitMerge className="w-3.5 h-3.5 text-[#5F6575]" />
            <span>Merge</span>
          </button>
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
        </div>
      </div>
    </div>
  );
};
