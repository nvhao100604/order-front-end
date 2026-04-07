'use client'
import { defaultQuery, IOrderFilter, OrderStatus } from "@/interfaces";
import { useState, useRef, useEffect } from "react";
import { FilterPanel, OrderItem } from "./manage.component";
import useQuery from "@/hooks/useQuery";
import { useTableCheckout } from "@/hooks/redux_custom_hooks/staffSlice.hooks";
import useRefresh from "@/hooks/useRefresh";
import { orders_services } from "@/services/order.services";
import { ORDER_KEY } from "@/config/constants/api";
import { useGetOrders } from "@/hooks/useOrder";

const StaffManagePage = () => {
    const [query, updateQuery, resetQuery] = useQuery(defaultQuery)
    const finalizeCheckout = useTableCheckout()
    const refresh = useRefresh()
    const { data } = useGetOrders(query)
    const orders = data?.data || []
    const currentPage = query.page ?? 1
    const totalPages = Math.ceil((data?.meta?.total ?? 1) / (data?.meta?.limit ?? 1))

    const [showFilter, setShowFilter] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)

    const filterKeys: (keyof IOrderFilter)[] = ["status", "min_price", "max_price", "staffID", "customerID", "tableID", "start_date", "end_date"]
    const activeFilterCount = filterKeys.filter(k => query[k] !== undefined && query[k] !== "").length

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node))
                setShowFilter(false)
        }
        if (showFilter) document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [showFilter])

    const updateStatus = async (orderID: number, status: OrderStatus) => {
        // console.log("Id:", orderID)
        // console.log("status: ", status)
        try {
            const response = await orders_services.updateOrderStatus(orderID, status)
            if (response.success) {
                // console.log("New status: ", response.data?.status)
                //mutate chỗ này
                refresh(ORDER_KEY)
            } else {
                console.error(response.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const setPage = (newPage: number) => {
        updateQuery({
            ...query,
            page: newPage
        })
    }

    return (
        <main className="max-w-5xl w-full" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Header row */}
            <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold" style={{ color: "#3d2b1a" }}>Order Management</h1>
                    <p className="text-sm mt-0.5" style={{ color: "#a08060" }}>
                        {orders.length} order{orders.length !== 1 ? "s" : ""} in queue
                        {activeFilterCount > 0 && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                                style={{ background: "#fef3e2", color: "#92600a", border: "1px solid #f5c842" }}>
                                {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                            </span>
                        )}
                    </p>
                </div>

                {/* Filter trigger */}
                <div className="relative flex-shrink-0" ref={panelRef}>
                    <button
                        onClick={() => setShowFilter(v => !v)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{
                            background: showFilter ? "#4a3525" : activeFilterCount > 0 ? "#e85d1a" : "white",
                            color: showFilter || activeFilterCount > 0 ? "white" : "#4a3525",
                            border: "1.5px solid",
                            borderColor: showFilter ? "#4a3525" : activeFilterCount > 0 ? "#e85d1a" : "#dcc9b0",
                            boxShadow: "0 2px 8px rgba(139,107,74,0.12)",
                        }}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Advanced Filter
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
                                style={{ background: "rgba(255,255,255,0.3)" }}>
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

            {/* Order list */}
            <div className="space-y-3">
                {orders.map((order) => (
                    <OrderItem
                        key={order.id}
                        order={order}
                        updateStatus={updateStatus}
                        finalizeCheckout={finalizeCheckout}
                    />
                ))}

                {orders.length === 0 && (
                    <div className="rounded-2xl p-12 text-center"
                        style={{ background: "white", border: "1px dashed rgba(212,175,120,0.4)" }}>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ background: "#faf0e0" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0622a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                                <rect x="9" y="3" width="6" height="4" rx="1" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium" style={{ color: "#a08060" }}>No active orders</p>
                        <p className="text-xs mt-1" style={{ color: "#c8b49a" }}>New orders will appear here</p>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 px-1">
                    {/* Info */}
                    <p className="text-xs" style={{ color: "#a08060" }}>
                        Page <span className="font-semibold" style={{ color: "#4a3525" }}>{currentPage}</span> of{" "}
                        <span className="font-semibold" style={{ color: "#4a3525" }}>{totalPages}</span>
                    </p>

                    {/* Controls */}
                    <div className="flex items-center gap-1">
                        {/* First */}
                        <button
                            onClick={() => setPage(1)}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                            style={{ background: "#f5ede0", color: "#6b4e35" }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" />
                            </svg>
                        </button>

                        {/* Prev */}
                        <button
                            onClick={() => setPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                            style={{ background: "#f5ede0", color: "#6b4e35" }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce<(number | "...")[]>((acc, p, i, arr) => {
                                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...")
                                acc.push(p)
                                return acc
                            }, [])
                            .map((p, i) =>
                                p === "..." ? (
                                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs"
                                        style={{ color: "#a08060" }}>…</span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p as number)}
                                        className="w-8 h-8 rounded-lg text-xs font-semibold transition-all"
                                        style={{
                                            background: currentPage === p ? "#e85d1a" : "#f5ede0",
                                            color: currentPage === p ? "white" : "#6b4e35",
                                            boxShadow: currentPage === p ? "0 2px 8px rgba(232,93,26,0.3)" : "none",
                                        }}
                                    >
                                        {p}
                                    </button>
                                )
                            )
                        }

                        {/* Next */}
                        <button
                            onClick={() => setPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                            style={{ background: "#f5ede0", color: "#6b4e35" }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>

                        {/* Last */}
                        <button
                            onClick={() => setPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                            style={{ background: "#f5ede0", color: "#6b4e35" }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </main >
    )
}

export default StaffManagePage