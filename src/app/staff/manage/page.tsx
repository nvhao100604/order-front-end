'use client'
import { useTableCheckout, useUpdateStaffOrder } from "@/hooks";
import { useAppSelector } from "@/redux/hooks";
import { formatter } from "@/utils";

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    PENDING: { label: "Pending", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)" },
    PREPARING: { label: "Preparing", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)" },
    COMPLETED: { label: "Completed", color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
}

const StaffManagePage = () => {
    const { orders } = useAppSelector((state) => state.staff);
    const updateStatus = useUpdateStaffOrder();
    const finalizeCheckout = useTableCheckout();

    return (
        <main className="p-6 max-w-5xl mx-auto" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            <div className="mb-6">
                <h1 className="text-xl font-bold text-white">Order Management</h1>
                <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {orders.length} order{orders.length !== 1 ? "s" : ""} in queue
                </p>
            </div>

            <div className="space-y-3">
                {orders.map((order) => {
                    const cfg = statusConfig[order.status] ?? statusConfig.PENDING
                    return (
                        <div
                            key={order.id}
                            className="rounded-2xl p-5 transition-all"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-white text-sm">Order #{order.id}</span>
                                    <span
                                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                                    >
                                        {cfg.label}
                                    </span>
                                </div>
                                <span className="font-bold text-sm" style={{ color: "#fb923c" }}>
                                    {formatter.format(order.totalPrice)}
                                </span>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {order.status === "PENDING" && (
                                    <button
                                        onClick={() => updateStatus(order.id, "PREPARING")}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                        style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)" }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        Start Preparing
                                    </button>
                                )}
                                {order.status === "PREPARING" && (
                                    <button
                                        onClick={() => updateStatus(order.id, "COMPLETED")}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                        style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Mark as Completed
                                    </button>
                                )}
                                {order.status === "COMPLETED" && (
                                    <button
                                        onClick={() => finalizeCheckout(order.tableID || 0)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                                        style={{ background: "#fb923c", color: "white" }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                        Process Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}

                {orders.length === 0 && (
                    <div
                        className="rounded-2xl p-12 text-center"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}
                    >
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>No active orders</p>
                    </div>
                )}
            </div>
        </main>
    );
}

export default StaffManagePage