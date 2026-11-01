'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { getOrderById, getOrders } from '@/services/order.services';
import { IOrderResponse, OrderStatus } from '@/interfaces';
import { formatter } from '@/utils';
import {
  Printer,
  ArrowLeft,
  AlertTriangle,
  Receipt,
  RotateCcw,
  Store,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface NormalizedItem {
  id: number | string;
  name: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface NormalizedOrder {
  id: number;
  status: OrderStatus | string;
  tableNumber: string | number | null;
  staffName: string | null;
  customerName: string | null;
  details: NormalizedItem[];
  subtotal: number;
  tax: number;
  delivery: number;
  totalPrice: number;
  createdAt: string;
  notes?: string | null;
}

const InvoiceSkeleton = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-stone-100 py-8 px-4 font-sans animate-pulse">
      {/* Top Controls Skeleton */}
      <div className="mb-6 flex gap-3">
        <div className="h-9 w-32 bg-stone-300 rounded-xl" />
        <div className="h-9 w-44 bg-stone-300 rounded-xl" />
      </div>

      {/* K80 Receipt Skeleton */}
      <div className="bg-white shadow-xl rounded-sm p-6 w-80 space-y-4 font-mono border border-stone-200">
        {/* Header Skeleton */}
        <div className="text-center space-y-2 border-b border-dashed border-stone-300 pb-4">
          <div className="h-5 w-40 bg-stone-200 rounded mx-auto" />
          <div className="h-3 w-48 bg-stone-200 rounded mx-auto" />
          <div className="h-3 w-36 bg-stone-200 rounded mx-auto" />
        </div>

        {/* Meta Rows Skeleton */}
        <div className="space-y-2 py-1">
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-stone-200 rounded" />
            <div className="h-3 w-20 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-stone-200 rounded" />
            <div className="h-3 w-28 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-14 bg-stone-200 rounded" />
            <div className="h-3 w-16 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-14 bg-stone-200 rounded" />
            <div className="h-3 w-20 bg-stone-200 rounded" />
          </div>
        </div>

        {/* Item Rows Skeleton */}
        <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-3">
          <div className="flex justify-between">
            <div className="h-3 w-32 bg-stone-200 rounded" />
            <div className="h-3 w-8 bg-stone-200 rounded" />
            <div className="h-3 w-14 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-28 bg-stone-200 rounded" />
            <div className="h-3 w-8 bg-stone-200 rounded" />
            <div className="h-3 w-14 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-36 bg-stone-200 rounded" />
            <div className="h-3 w-8 bg-stone-200 rounded" />
            <div className="h-3 w-14 bg-stone-200 rounded" />
          </div>
        </div>

        {/* Totals Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <div className="h-3 w-16 bg-stone-200 rounded" />
            <div className="h-3 w-20 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 w-12 bg-stone-200 rounded" />
            <div className="h-3 w-16 bg-stone-200 rounded" />
          </div>
          <div className="flex justify-between pt-2 border-t border-dashed border-stone-300">
            <div className="h-4 w-20 bg-stone-300 rounded" />
            <div className="h-4 w-24 bg-stone-300 rounded" />
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-4 border-t border-dashed border-stone-300 text-center space-y-1.5">
          <div className="h-3 w-36 bg-stone-200 rounded mx-auto" />
          <div className="h-2.5 w-48 bg-stone-200 rounded mx-auto" />
        </div>
      </div>
    </div>
  );
};

const InvoiceContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const tableIdParam = searchParams.get('tableId');

  const [order, setOrder] = useState<IOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchInvoiceData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. If orderId is provided, fetch order directly
      if (orderIdParam) {
        const numId = Number(orderIdParam);
        if (!Number.isFinite(numId) || numId <= 0) {
          setErrorMsg(`Invalid Order ID: "${orderIdParam}"`);
          setIsLoading(false);
          return;
        }

        const res = await getOrderById(numId);
        const resolvedOrder: any = (res as any)?.data?.data || res?.data || res;

        // If details exist and are non-empty, save directly
        if (resolvedOrder && (resolvedOrder.details?.length > 0 || resolvedOrder.orderDetails?.length > 0)) {
          setOrder(resolvedOrder);
          setIsLoading(false);
          return;
        }

        // If getOrderById returned empty details, try fetching from the order list filter as a fallback
        const listRes = await getOrders({ page: 1, limit: 50 });
        const ordersList = listRes?.data || [];
        const found = ordersList.find((o) => Number(o.id) === numId);
        if (found && (found.details?.length || 0) > (resolvedOrder?.details?.length || 0)) {
          setOrder(found);
          setIsLoading(false);
          return;
        }

        if (resolvedOrder && resolvedOrder.id) {
          setOrder(resolvedOrder);
          setIsLoading(false);
          return;
        }

        setErrorMsg(res?.message || `Order #${orderIdParam} not found.`);
        setIsLoading(false);
        return;
      }

      // 2. If tableId is provided without orderId, lookup active order for this table
      if (tableIdParam) {
        const numTable = Number(String(tableIdParam).replace(/\D/g, ''));
        if (!Number.isFinite(numTable) || numTable <= 0) {
          setErrorMsg(`Invalid Table ID: "${tableIdParam}"`);
          setIsLoading(false);
          return;
        }

        const listRes = await getOrders({ tableID: numTable });
        const ordersList = listRes?.data || [];

        if (ordersList.length === 0) {
          setErrorMsg(`No active order found for Table B${numTable}.`);
          setIsLoading(false);
          return;
        }

        // Prioritize non-completed / non-cancelled order
        const activeOrder =
          ordersList.find(
            (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
          ) || ordersList[0];

        setOrder(activeOrder);
        setIsLoading(false);
        return;
      }

      // 3. Neither orderId nor tableId provided
      setErrorMsg(
        'Missing order identifier in URL. Please specify ?orderId=<id> or ?tableId=<id>.'
      );
    } catch (err: any) {
      console.error('Failed to fetch invoice order:', err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Error loading invoice data.';
      setErrorMsg(detail);
    } finally {
      setIsLoading(false);
    }
  }, [orderIdParam, tableIdParam]);

  useEffect(() => {
    fetchInvoiceData();
  }, [fetchInvoiceData]);

  // Normalize order details & values to ensure complete and robust rendering
  const normalizedOrder = useMemo<NormalizedOrder | null>(() => {
    if (!order) return null;
    const raw = order as any;
    const rawDetails: any[] =
      raw.details || raw.orderDetails || raw.items || [];

    const details: NormalizedItem[] = Array.isArray(rawDetails)
      ? rawDetails.map((d: any, idx: number) => {
          const name =
            d.dish?.name ||
            d.name ||
            d.dishName ||
            d.title ||
            `Item #${d.dishID || d.dishId || idx + 1}`;
          const quantity = Number(d.quantity || d.qty || 1);
          const price = Number(d.price ?? d.dish?.price ?? 0);
          const lineTotal = price * quantity;
          return {
            id: d.id || idx,
            name,
            quantity,
            price,
            lineTotal,
          };
        })
      : [];

    const detailsSum = details.reduce((acc, it) => acc + it.lineTotal, 0);
    const subtotal = Number(
      raw.subtotal ?? (detailsSum > 0 ? detailsSum : raw.totalPrice ?? 0)
    );
    const tax = Number(raw.tax ?? 0);
    const delivery = Number(raw.delivery ?? 0);
    const totalPrice = Number(
      raw.totalPrice ?? raw.total ?? (subtotal + tax + delivery)
    );

    const tableNumber =
      raw.tableID ??
      raw.tableId ??
      raw.table?.number ??
      (tableIdParam ? Number(String(tableIdParam).replace(/\D/g, '')) : null);

    const staffName =
      raw.staff?.name ||
      raw.staffName ||
      (raw.staffID ? `Staff #${raw.staffID}` : null);

    const customerName =
      raw.customer?.name ||
      raw.customerName ||
      (raw.customerID ? `Customer #${raw.customerID}` : null);

    return {
      id: raw.id,
      status: raw.status || 'PENDING',
      tableNumber,
      staffName,
      customerName,
      details,
      subtotal,
      tax,
      delivery,
      totalPrice,
      createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
      notes: raw.notes || null,
    };
  }, [order, tableIdParam]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <InvoiceSkeleton />;
  }

  if (errorMsg || !normalizedOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-stone-100 p-4 font-sans">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center max-w-md w-full">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-bold text-lg text-stone-900 mb-1.5">Invoice Error</h2>
          <p className="text-xs text-stone-600 mb-5 leading-relaxed">
            {errorMsg || 'Unable to locate order information.'}
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={fetchInvoiceData}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <Link
              href="/staff/manage"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdAtDate = new Date(normalizedOrder.createdAt);
  const formattedDate = !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';
  const formattedTime = !isNaN(createdAtDate.getTime())
    ? createdAtDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const isCompleted = normalizedOrder.status === 'COMPLETED';

  return (
    <div className="invoice-page-wrapper flex flex-col items-center min-h-screen bg-stone-100 py-8 px-4 font-sans">
      {/* ── Scoped Print Styles ── */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-page-wrapper {
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }
          .invoice-container {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 80mm !important;
            padding: 4mm !important;
            margin: 0 auto !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>

      {/* ── Top Navigation & Print Controls (Excluded from Print) ── */}
      <div className="no-print mb-6 flex items-center gap-3 flex-wrap justify-center">
        <Link
          href="/staff/manage"
          className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Orders</span>
        </Link>
        <Link
          href="/staff/table-map"
          className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-2xs flex items-center gap-1.5"
        >
          <Store className="w-3.5 h-3.5 text-stone-500" />
          <span>Table Map</span>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print K80 Thermal Receipt</span>
        </button>
      </div>

      {/* ── K80 Thermal Receipt Paper Container (80mm width standard) ── */}
      <div className="invoice-container bg-white shadow-lg border border-stone-200/80 font-mono text-xs leading-tight p-5 w-80 text-stone-900">
        {/* Header */}
        <div className="text-center border-b border-dashed border-stone-300 pb-3 mb-3 space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-stone-800 font-bold text-base tracking-wide">
            <Receipt className="w-4 h-4 text-orange-600 no-print" />
            <span>FOODIE RESTAURANT</span>
          </div>
          <p className="text-[11px] text-stone-500">Fine Dining & Culinary Experience</p>
          <p className="text-[11px] text-stone-500">123 Culinary Boulevard, District 1</p>
          <p className="text-[11px] text-stone-500">Tel: (028) 3999-8888</p>
        </div>

        {/* Invoice Metadata */}
        <div className="mb-3 space-y-1.5 text-[11px]">
          <div className="flex justify-between">
            <span className="text-stone-500">Invoice:</span>
            <span className="font-bold text-stone-800 tabular-nums">
              INV-#{normalizedOrder.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">Date & Time:</span>
            <span className="text-stone-800 tabular-nums">
              {formattedDate} {formattedTime}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-stone-500">Table:</span>
            <span className="font-semibold text-stone-800">
              {normalizedOrder.tableNumber
                ? `Table B${normalizedOrder.tableNumber}`
                : 'Takeaway / Online'}
            </span>
          </div>

          {normalizedOrder.staffName && (
            <div className="flex justify-between">
              <span className="text-stone-500">Server:</span>
              <span className="text-stone-700">{normalizedOrder.staffName}</span>
            </div>
          )}

          {normalizedOrder.customerName && (
            <div className="flex justify-between">
              <span className="text-stone-500">Customer:</span>
              <span className="text-stone-700">{normalizedOrder.customerName}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-0.5">
            <span className="text-stone-500">Status:</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span>{normalizedOrder.status}</span>
            </span>
          </div>
        </div>

        {/* Items Table Header */}
        <div className="border-t border-b border-dashed border-stone-300 py-1.5 my-2">
          <div className="flex justify-between text-[11px] font-bold text-stone-800 uppercase tracking-wider">
            <span className="flex-1">Item</span>
            <span className="w-8 text-center">Qty</span>
            <span className="w-16 text-right">Price</span>
          </div>
        </div>

        {/* Items List */}
        <div className="py-1 space-y-2">
          {normalizedOrder.details && normalizedOrder.details.length > 0 ? (
            normalizedOrder.details.map((detail) => (
              <div key={detail.id} className="text-[11px]">
                <div className="flex justify-between items-start">
                  <span className="flex-1 pr-1 font-medium text-stone-800 line-clamp-2">
                    {detail.name}
                  </span>
                  <span className="w-8 text-center tabular-nums text-stone-600 font-semibold">
                    {detail.quantity}
                  </span>
                  <span className="w-16 text-right tabular-nums text-stone-800 font-medium">
                    {formatter.currency(detail.lineTotal)}
                  </span>
                </div>
                {detail.quantity > 1 && (
                  <div className="text-[10px] text-stone-400 tabular-nums">
                    @ {formatter.currency(detail.price)}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-3 text-stone-400 italic text-[11px]">
              No items recorded for this order
            </div>
          )}
        </div>

        {/* Pricing & Totals Breakdown */}
        <div className="border-t border-dashed border-stone-300 pt-2 mt-3 space-y-1 text-[11px]">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="tabular-nums font-medium text-stone-800">
              {formatter.currency(normalizedOrder.subtotal)}
            </span>
          </div>

          {normalizedOrder.tax > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Tax / VAT:</span>
              <span className="tabular-nums font-medium text-stone-800">
                {formatter.currency(normalizedOrder.tax)}
              </span>
            </div>
          )}

          {normalizedOrder.delivery > 0 && (
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee:</span>
              <span className="tabular-nums font-medium text-stone-800">
                {formatter.currency(normalizedOrder.delivery)}
              </span>
            </div>
          )}

          <div className="border-t border-dashed border-stone-300 pt-1.5 mt-1.5 flex justify-between font-bold text-sm text-stone-900">
            <span>TOTAL:</span>
            <span className="tabular-nums text-orange-600">
              {formatter.currency(normalizedOrder.totalPrice)}
            </span>
          </div>
        </div>

        {/* Optional Notes */}
        {normalizedOrder.notes && (
          <div className="mt-3 pt-2 border-t border-dashed border-stone-200 text-[10px] text-stone-500">
            <span className="font-semibold text-stone-600">Note: </span>
            <span>{normalizedOrder.notes}</span>
          </div>
        )}

        {/* Footer */}
        <div className="text-center border-t border-dashed border-stone-300 pt-3 mt-4 text-[10px] text-stone-500 space-y-1">
          <p className="font-semibold text-stone-700">Thank you for dining with us!</p>
          <p>Please keep this receipt for your reference.</p>
          <div className="pt-2 font-mono text-[9px] text-stone-400 uppercase tracking-widest">
            *** FOODIE POS K80 ***
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="no-print mt-5 text-center text-xs text-stone-500 max-w-sm flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Optimized for standard 80mm (K80) thermal receipt printers.</span>
      </div>
    </div>
  );
};

const RestaurantInvoicePage = () => {
  return (
    <Suspense fallback={<InvoiceSkeleton />}>
      <InvoiceContent />
    </Suspense>
  );
};

export default RestaurantInvoicePage;
