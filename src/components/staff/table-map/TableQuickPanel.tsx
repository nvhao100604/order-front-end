'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { IOrderResponse } from '@/interfaces';
import { formatter } from '@/utils';
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
      <div className="w-full xl:w-[380px] min-h-[520px] bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80 flex flex-col items-center justify-center text-stone-400 text-sm">
        <Users className="w-10 h-10 text-stone-300 mb-2" />
        <p>Select a table on the floor plan to view details</p>
      </div>
    );
  }

  const orderDetails = order?.details || [];
  const totalPrice = order?.totalPrice || 0;
  const isMerged = Boolean(table.clusterKey || table.mergedWithId);

  const getStatusBadge = () => {
    switch (table.status) {
      case 'EMPTY':
        return {
          label: 'Available',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case 'OCCUPIED':
        return {
          label: 'Occupied',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      case 'PAY':
        return {
          label: 'Payment Pending',
          badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
          dotClass: 'bg-sky-500',
        };
      case 'RESERVED':
        return {
          label: 'Reserved',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-500',
        };
      case 'CLEAN':
        return {
          label: 'Cleaning',
          badgeClass: 'bg-stone-100 text-stone-700 border-stone-200',
          dotClass: 'bg-stone-400',
        };
      case 'LATE':
        return {
          label: 'Overdue',
          badgeClass: 'bg-red-50 text-red-700 border-red-200',
          dotClass: 'bg-red-500',
        };
      default:
        return {
          label: table.status,
          badgeClass: 'bg-stone-50 text-stone-700 border-stone-200',
          dotClass: 'bg-stone-400',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="w-full xl:w-[380px] bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80 flex flex-col justify-between font-sans">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900">Table {table.name}</h2>
            <p className="text-xs text-stone-400 mt-0.5">{table.area}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusInfo.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 py-3 text-xs text-stone-500 flex-wrap">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-stone-400" />
            <span className="tabular-nums">{table.capacity} seats</span>
          </div>

          {order && (
            <div className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>
                Order #{order.id} ({order.status})
              </span>
            </div>
          )}

          {isMerged && (
            <div className="flex items-center gap-1 text-blue-700 font-medium">
              <Link2 className="w-3.5 h-3.5" />
              <span>Cluster: {table.clusterKey || table.mergedWithId}</span>
            </div>
          )}
        </div>

        {/* Order Item List */}
        <div className="space-y-2.5 py-3 border-t border-b border-stone-100 max-h-52 overflow-y-auto">
          {orderDetails.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-400">
              <p className="font-medium text-stone-500">No items ordered for this table yet.</p>
              <p className="text-[11px] text-stone-400 mt-1">
                Tap Quick Order or Take Order below to add dishes.
              </p>
            </div>
          ) : (
            orderDetails.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex justify-between items-center text-sm py-1"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-stone-800">
                    {item.dish?.name || `Item #${item.dishID}`}
                  </span>
                  <span className="text-[11px] text-stone-400 tabular-nums">
                    {formatter.currency(item.price)}
                  </span>
                </div>
                <span className="text-stone-700 font-bold text-xs tabular-nums bg-stone-100 px-2 py-0.5 rounded-lg">
                  ×{item.quantity}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-4">
          <span className="text-xs uppercase font-semibold text-stone-500 tracking-wider">
            Total Amount
          </span>
          <div className="text-2xl font-bold text-stone-900 tabular-nums">
            {formatter.currency(totalPrice)}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-6">
        <div className="grid grid-cols-2 gap-2">
          {onQuickOrderClick ? (
            <button
              onClick={onQuickOrderClick}
              className="py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Quick Order</span>
            </button>
          ) : (
            <button
              onClick={onOrderClick}
              className="py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Take Order
            </button>
          )}

          <button
            onClick={onPaymentClick}
            disabled={totalPrice === 0}
            className="py-3 bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            <CreditCard className="w-4 h-4 text-stone-500" />
            <span>Pay</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onMergeClick}
            className="py-2.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
          >
            <GitMerge className="w-3.5 h-3.5 text-stone-400" />
            <span>Merge</span>
          </button>
          <button
            onClick={onTransferClick}
            className="py-2.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Transfer
          </button>
          <button
            onClick={onSplitTableClick}
            disabled={!isMerged}
            title={isMerged ? 'Split this table from the cluster' : 'This table is not in a merged cluster'}
            className={`py-2.5 border text-xs font-medium rounded-xl transition-all shadow-xs ${
              isMerged
                ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 cursor-pointer'
                : 'bg-stone-50 border-stone-200/50 text-stone-400 opacity-40 cursor-not-allowed'
            }`}
          >
            Split Table
          </button>
        </div>
      </div>
    </div>
  );
};
