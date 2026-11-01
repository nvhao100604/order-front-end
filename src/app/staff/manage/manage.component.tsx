'use client';

import React from 'react';
import {
  IOrderFilter,
  IOrderResponse,
  OrderStatus,
  OrderStatusKey,
  OrderStatusMap,
  Query,
} from '@/interfaces';
import { formatter } from '@/utils';
import { Clock, Printer, CreditCard, ChevronDown, X, SlidersHorizontal } from 'lucide-react';

export const statusStyle: Record<OrderStatusKey, { color: string; bg: string; border: string }> = {
  PENDING: { color: "#92600a", bg: "#fef3e2", border: "#f5c842" },
  CONFIRMED: { color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd" },
  PREPARING: { color: "#1e4fa3", bg: "#eff6ff", border: "#93c5fd" },
  SHIPPING: { color: "#0e7490", bg: "#ecfeff", border: "#67e8f9" },
  COMPLETED: { color: "#166534", bg: "#f0fdf4", border: "#86efac" },
  CANCELLED: { color: "#991b1b", bg: "#fef2f2", border: "#fca5a5" },
  UNPAID: { color: "#854d0e", bg: "#fefce8", border: "#fde047" },
};

export const statusBadgeStyle: Record<
  OrderStatusKey,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
  },
  PREPARING: {
    label: 'Preparing',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  SHIPPING: {
    label: 'Shipping',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  UNPAID: {
    label: 'Unpaid',
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
};

// ─── OrderItem (Ticket Card) ────────────────────────────────────────────────
interface OrderItemProps {
  order: IOrderResponse;
  updateStatus: (orderID: number, status: OrderStatus) => void;
  finalizeCheckout: (tableID: number) => void;
}

const OrderItem = ({ order, updateStatus, finalizeCheckout }: OrderItemProps) => {
  const status = (order.status || 'PENDING') as OrderStatusKey;
  const sty = statusBadgeStyle[status] ?? statusBadgeStyle.PENDING;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between font-sans">
      <div>
        {/* Header: Order #, Source Badge, Status Badge & Time */}
        <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-900 tabular-nums">
                Order #{order.id}
              </span>
              {order.tableID ? (
                <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-orange-50 text-orange-700 border border-orange-200/60 tabular-nums">
                  Table B{order.tableID}
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Online
                </span>
              )}
            </div>

            {formattedDate && (
              <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-1 tabular-nums">
                <Clock className="w-3 h-3 text-stone-400" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-semibold border ${sty.bg} ${sty.text} ${sty.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${sty.dot}`} />
            <span>{sty.label}</span>
          </span>
        </div>

        {/* Body: Order items list */}
        <div className="py-3 max-h-40 overflow-y-auto space-y-1.5">
          {order.details && order.details.length > 0 ? (
            order.details.map((d: any, idx: number) => (
              <div
                key={d.id || idx}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-stone-50"
              >
                <div className="flex items-center gap-2 flex-1 pr-2">
                  <span className="font-semibold text-stone-700 tabular-nums bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                    ×{d.quantity}
                  </span>
                  <span className="text-stone-800 line-clamp-1">{d.dish?.name ?? d.name}</span>
                </div>
                <span className="text-stone-500 font-medium tabular-nums text-[11px]">
                  {formatter.currency((d.price || 0) * (d.quantity || 1))}
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-stone-400 py-2 italic text-center">No item details available</p>
          )}
        </div>
      </div>

      {/* Footer: Total amount, Status changer, Print action */}
      <div className="pt-3 border-t border-stone-100 space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
            Total
          </span>
          <span className="text-lg font-bold text-orange-600 tabular-nums">
            {formatter.currency(order.totalPrice)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Quick status selector */}
          <div className="relative flex-1 min-w-[120px]">
            <select
              value={status}
              onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
              className={`w-full appearance-none pl-3 pr-7 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border focus:outline-none transition-all ${sty.bg} ${sty.text} ${sty.border}`}
            >
              {(Object.keys(OrderStatusMap) as OrderStatusKey[]).map((key) => (
                <option key={key} value={key} className="bg-white text-stone-800">
                  {OrderStatusMap[key]}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none w-3.5 h-3.5 ${sty.text}`}
            />
          </div>

          {/* Print Invoice button */}
          <a
            href={`/staff/invoice?orderId=${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200/80 text-stone-700 border border-stone-200 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print</span>
          </a>

          {/* Process payment if completed */}
          {status === 'COMPLETED' && (
            <button
              onClick={() => finalizeCheckout(order.tableID || 0)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white transition-all shadow-sm cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Checkout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── FilterPanel ────────────────────────────────────────────────────────────
interface FilterPanelProps {
  query: Query<IOrderFilter>;
  updateQuery: (patch: Query<IOrderFilter>) => void;
  resetQuery: () => void;
  onClose: () => void;
}

const FilterPanel = ({ query, updateQuery, resetQuery, onClose }: FilterPanelProps) => (
  <div className="absolute right-0 mt-2 w-[340px] rounded-2xl bg-white border border-stone-200/80 shadow-2xl overflow-hidden z-50 font-sans">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 bg-stone-50/70">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-stone-500" />
        <span className="font-bold text-xs uppercase tracking-wider text-stone-700">
          Advanced Filter
        </span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="p-5 space-y-3.5 max-h-96 overflow-y-auto">
      {/* Status */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
          Status
        </label>
        <select
          value={query.status ?? ''}
          onChange={(e) =>
            updateQuery({ status: (e.target.value as OrderStatus) || undefined })
          }
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        >
          <option value="">All Statuses</option>
          {(Object.entries(OrderStatusMap) as [OrderStatusKey, string][]).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
          Price Range (VND)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={query.min_price ?? ''}
            onChange={(e) =>
              updateQuery({ min_price: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-1/2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 tabular-nums"
          />
          <span className="text-stone-300 text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            value={query.max_price ?? ''}
            onChange={(e) =>
              updateQuery({ max_price: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-1/2 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 tabular-nums"
          />
        </div>
      </div>

      {/* Customer Name */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
          Customer Name
        </label>
        <input
          type="text"
          placeholder="Search by customer name"
          value={query.customer_name ?? ''}
          onChange={(e) => updateQuery({ customer_name: e.target.value || undefined })}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* Staff Name */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
          Staff Name
        </label>
        <input
          type="text"
          placeholder="Search by staff name"
          value={query.staff_name ?? ''}
          onChange={(e) => updateQuery({ staff_name: e.target.value || undefined })}
          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
          Date Range
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="datetime-local"
            value={query.start_date ?? ''}
            onChange={(e) => updateQuery({ start_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
          <input
            type="datetime-local"
            value={query.end_date ?? ''}
            onChange={(e) => updateQuery({ end_date: e.target.value || undefined })}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex gap-2 px-5 py-3.5 border-t border-stone-100 bg-stone-50/70">
      <button
        onClick={() => {
          resetQuery();
          onClose();
        }}
        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
      >
        Reset
      </button>
      <button
        onClick={onClose}
        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white transition-all shadow-sm cursor-pointer"
      >
        Apply
      </button>
    </div>
  </div>
);

// ─── OrderItemSkeleton ──────────────────────────────────────────────────────
const OrderItemSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 flex flex-col justify-between font-sans animate-pulse">
    <div>
      {/* Header skeleton */}
      <div className="flex items-start justify-between gap-2 pb-3 border-b border-stone-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-stone-200 rounded-md" />
            <div className="h-4 w-16 bg-stone-100 rounded-md" />
          </div>
          <div className="h-3 w-28 bg-stone-100 rounded" />
        </div>
        <div className="h-5 w-20 bg-stone-200 rounded-full" />
      </div>

      {/* Body item rows skeleton */}
      <div className="py-3 space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-1 px-1.5">
            <div className="flex items-center gap-2 flex-1 pr-2">
              <div className="h-4 w-6 bg-stone-200 rounded" />
              <div
                className={`h-3 bg-stone-200 rounded ${
                  i === 1 ? 'w-36' : i === 2 ? 'w-28' : 'w-20'
                }`}
              />
            </div>
            <div className="h-3 w-14 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
    </div>

    {/* Footer skeleton */}
    <div className="pt-3 border-t border-stone-100 space-y-3">
      <div className="flex items-baseline justify-between">
        <div className="h-3 w-10 bg-stone-100 rounded" />
        <div className="h-5 w-24 bg-stone-200 rounded-md" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="h-8 flex-1 bg-stone-100 rounded-xl" />
        <div className="h-8 w-20 bg-stone-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export { OrderItem, FilterPanel, OrderItemSkeleton };
