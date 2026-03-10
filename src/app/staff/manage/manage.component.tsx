import { IOrderFilter, IOrderResponse, OrderStatus, OrderStatusKey, OrderStatusMap, Query } from "@/interfaces";
import { formatter } from "@/utils";

// ─── Shared styles ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: "10px",
    border: "1.5px solid #dcc9b0", background: "#faf6f0",
    color: "#4a3525", fontSize: "13px", outline: "none",
    fontFamily: "'Inter', system-ui, sans-serif",
}
const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "11px", fontWeight: 600,
    letterSpacing: "0.05em", color: "rgba(107,78,53,0.6)",
    marginBottom: "5px", textTransform: "uppercase",
}

export const statusStyle: Record<OrderStatusKey, { color: string; bg: string; border: string }> = {
    PENDING: { color: "#92600a", bg: "#fef3e2", border: "#f5c842" },
    CONFIRMED: { color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd" },
    PREPARING: { color: "#1e4fa3", bg: "#eff6ff", border: "#93c5fd" },
    SHIPPING: { color: "#0e7490", bg: "#ecfeff", border: "#67e8f9" },
    COMPLETED: { color: "#166534", bg: "#f0fdf4", border: "#86efac" },
    CANCELLED: { color: "#991b1b", bg: "#fef2f2", border: "#fca5a5" },
    UNPAID: { color: "#854d0e", bg: "#fefce8", border: "#fde047" },
}

// ─── OrderItem ────────────────────────────────────────────────────────────────
interface OrderItemProps {
    order: IOrderResponse
    updateStatus: (orderID: number, status: OrderStatus) => void
    finalizeCheckout: (tableID: number) => void
}

const OrderItem = ({ order, updateStatus, finalizeCheckout }: OrderItemProps) => {
    const status = order.status as OrderStatusKey
    const sty = statusStyle[status] ?? statusStyle.PENDING

    return (
        <div
            className="rounded-2xl p-5 transition-all"
            style={{ background: "white", border: "1px solid rgba(212,175,120,0.25)", boxShadow: "0 2px 12px rgba(139,107,74,0.08)" }}
        >
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: "#3d2b1a" }}>Order #{order.id}</span>
                    {order.tableID ? (
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium"
                            style={{ background: "#faf0e0", color: "#8b6b4a", border: "1px solid #dcc9b0" }}>
                            Table {order.tableID}
                        </span>
                    )
                        :
                        <span className="text-xs px-2 py-0.5 rounded-md font-medium text-green-500"
                            style={{ background: "#faf0e0", border: "1px solid #dcc9b0" }}>
                            Online
                        </span>
                    }
                    {/* Status badge */}
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: sty.bg, color: sty.color, border: `1px solid ${sty.border}` }}>
                        {OrderStatusMap[status]}
                    </span>
                </div>
                <span className="font-bold text-sm" style={{ color: "#c0622a" }}>
                    {formatter.currency(order.totalPrice)}
                </span>
            </div>

            {/* Order items */}
            {order.details && order.details.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 pb-4" style={{ borderBottom: "1px solid #f5ede0" }}>
                    {order.details.map((d: any) => (
                        <span key={d.id} className="text-xs px-2.5 py-1 rounded-lg"
                            style={{ background: "#faf6f0", color: "#6b4e35", border: "1px solid #e8d5b8" }}>
                            {d.dish?.name ?? d.name}
                            {d.quantity > 1 && (
                                <span className="ml-1 font-bold" style={{ color: "#c0622a" }}>×{d.quantity}</span>
                            )}
                        </span>
                    ))}
                </div>
            )}

            {/* Actions row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Status selector */}
                <div className="relative flex-shrink-0">
                    <select
                        value={status}
                        onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:opacity-90"
                        style={{
                            background: sty.bg,
                            color: sty.color,
                            border: `1.5px solid ${sty.border}`,
                            outline: "none",
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    >
                        {(Object.keys(OrderStatusMap) as OrderStatusKey[]).map(key => (
                            <option key={key} value={key}>{OrderStatusMap[key]}</option>
                        ))}
                    </select>
                    {/* Chevron icon */}
                    <svg
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        style={{ color: sty.color }}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>

                {/* Process payment button (only when COMPLETED) */}
                {status === "COMPLETED" && (
                    <button onClick={() => finalizeCheckout(order.tableID || 0)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80 text-white"
                        style={{ background: "#e85d1a", boxShadow: "0 2px 8px rgba(232,93,26,0.3)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                        Process Payment
                    </button>
                )}
            </div>
        </div>
    )
}

// ─── Filter panel ─────────────────────────────────────────────────────────────
interface FilterPanelProps {
    query: Query<IOrderFilter>
    updateQuery: (patch: Query<IOrderFilter>) => void
    resetQuery: () => void
    onClose: () => void
}

const FilterPanel = ({ query, updateQuery, resetQuery, onClose }: FilterPanelProps) => (
    <div className="absolute right-0 mt-2 rounded-2xl overflow-hidden z-50"
        style={{ width: "340px", background: "white", border: "1.5px solid rgba(212,175,120,0.3)", boxShadow: "0 16px 48px rgba(74,53,37,0.18)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f5ede0", background: "#faf6f0" }}>
            <span className="font-bold text-sm" style={{ color: "#4a3525" }}>Advanced Filter</span>
            <button onClick={onClose} style={{ color: "rgba(107,78,53,0.4)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>

        <div className="p-5 space-y-4">
            {/* Status */}
            <div>
                <label style={labelStyle}>Status</label>
                <select value={query.status ?? ""} onChange={e => updateQuery({ status: (e.target.value as OrderStatus) || undefined })} style={inputStyle}>
                    <option value="">All statuses</option>
                    {(Object.entries(OrderStatusMap) as [OrderStatusKey, string][]).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Price range */}
            <div>
                <label style={labelStyle}>Price Range (₫)</label>
                <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={query.min_price ?? ""}
                        onChange={e => updateQuery({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                        style={{ ...inputStyle, width: "50%" }} />
                    <span style={{ color: "#c8b49a", fontSize: "12px", flexShrink: 0 }}>—</span>
                    <input type="number" placeholder="Max" value={query.max_price ?? ""}
                        onChange={e => updateQuery({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                        style={{ ...inputStyle, width: "50%" }} />
                </div>
            </div>

            {/* Table ID */}
            {/* <div>
                <label style={labelStyle}>Table</label>
                <input type="number" placeholder="Table number" value={query.tableID ?? ""}
                    onChange={e => updateQuery({ tableID: e.target.value ? Number(e.target.value) : undefined })}
                    style={inputStyle} />
            </div> */}

            {/* Staff ID */}
            {/* <div>
                <label style={labelStyle}>Staff ID</label>
                <input type="number" placeholder="Staff ID" value={query.staffID ?? ""}
                    onChange={e => updateQuery({ staffID: e.target.value ? Number(e.target.value) : undefined })}
                    style={inputStyle} />
            </div> */}

            {/* Customer ID */}
            {/* <div>
                <label style={labelStyle}>Customer ID</label>
                <input type="number" placeholder="Customer ID" value={query.customerID ?? ""}
                    onChange={e => updateQuery({ customerID: e.target.value ? Number(e.target.value) : undefined })}
                    style={inputStyle} />
            </div> */}

            {/* Date range */}
            <div>
                <label style={labelStyle}>Date Range</label>
                <div className="flex flex-col gap-2">
                    <div>
                        <span style={{ ...labelStyle, marginBottom: 3, fontSize: "10px" }}>From</span>
                        <input type="datetime-local" value={query.start_date ?? ""}
                            onChange={e => updateQuery({ start_date: e.target.value || undefined })}
                            style={inputStyle} />
                    </div>
                    <div>
                        <span style={{ ...labelStyle, marginBottom: 3, fontSize: "10px" }}>To</span>
                        <input type="datetime-local" value={query.end_date ?? ""}
                            onChange={e => updateQuery({ end_date: e.target.value || undefined })}
                            style={inputStyle} />
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4" style={{ borderTop: "1px solid #f5ede0", background: "#faf6f0" }}>
            <button
                onClick={() => { resetQuery(); onClose() }}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                style={{ background: "#f5ede0", color: "#6b4e35", border: "1px solid #dcc9b0" }}>
                Reset
            </button>
            <button
                onClick={onClose}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "#e85d1a", boxShadow: "0 2px 8px rgba(232,93,26,0.3)" }}>
                Done
            </button>
        </div>
    </div>
)

export {
    OrderItem,
    FilterPanel
}