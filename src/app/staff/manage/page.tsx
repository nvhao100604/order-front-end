'use client';

import { defaultQuery, IOrderFilter, OrderStatus } from "@/interfaces";
import { useState, useRef, useEffect } from "react";
import { FilterPanel, OrderItem } from "./manage.component";
import useQuery from "@/hooks/useQuery";
import { useTableCheckout } from "@/hooks/redux_custom_hooks/staffSlice.hooks";
import useRefresh from "@/hooks/useRefresh";
import { ORDER_KEY, TABLE_KEY } from "@/config/constants/api";
import { useGetOrders } from "@/hooks/useOrder";
import { updateOrderStatus } from "@/services/order.services";
import {
  SlidersHorizontal,
  Receipt,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

const StaffManagePage = () => {
  const [query, updateQuery, resetQuery] = useQuery(defaultQuery);
  const finalizeCheckout = useTableCheckout();
  const refresh = useRefresh();
  const { data } = useGetOrders(query);
  const orders = data?.data || [];
  const currentPage = query.page ?? 1;
  const totalPages = Math.ceil((data?.meta?.total ?? 1) / (data?.meta?.limit ?? 1));

  const [showFilter, setShowFilter] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const filterKeys: (keyof IOrderFilter)[] = [
    "status",
    "min_price",
    "max_price",
    "staffID",
    "customerID",
    "tableID",
    "start_date",
    "end_date",
  ];
  const activeFilterCount = filterKeys.filter(
    (k) => query[k] !== undefined && query[k] !== ""
  ).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowFilter(false);
      }
    };
    if (showFilter) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilter]);

  const updateStatus = async (orderID: number, status: OrderStatus) => {
    try {
      const response = await updateOrderStatus(orderID, status);
      if (response.success) {
        refresh(ORDER_KEY);
        refresh(TABLE_KEY);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setPage = (newPage: number) => {
    updateQuery({
      ...query,
      page: newPage,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Order Management</h1>
          <p className="text-xs text-stone-500 mt-0.5">
            <span className="tabular-nums font-semibold">{orders.length}</span> order
            {orders.length !== 1 ? "s" : ""} in current view
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
              </span>
            )}
          </p>
        </div>

        {/* Filter Trigger Button */}
        <div className="relative shrink-0" ref={panelRef}>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs border ${
              showFilter || activeFilterCount > 0
                ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-orange-600 text-[10px] flex items-center justify-center font-bold tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilter && (
            <FilterPanel
              query={query}
              updateQuery={updateQuery}
              resetQuery={resetQuery}
              onClose={() => setShowFilter(false)}
            />
          )}
        </div>
      </div>

      {/* Order Tickets Grid */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 p-16 text-center shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800">No active orders</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            No orders match the current filter criteria or queue.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              updateStatus={updateStatus}
              finalizeCheckout={finalizeCheckout}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-stone-200/80 px-1">
          <p className="text-xs text-stone-400 tabular-nums">
            Page <span className="font-semibold text-stone-800">{currentPage}</span> of{" "}
            <span className="font-semibold text-stone-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            {/* First */}
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev */}
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
              )
              .reduce<(number | "...")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-8 h-8 flex items-center justify-center text-xs text-stone-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all tabular-nums cursor-pointer ${
                      currentPage === p
                        ? "bg-orange-600 text-white shadow-xs"
                        : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-2xs"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Last */}
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-30 cursor-pointer shadow-2xs"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagePage;
