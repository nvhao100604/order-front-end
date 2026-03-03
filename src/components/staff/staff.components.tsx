// ─── Dashboard Tab ─────────────────────────────────────────────────────────────

import { useSelectTable, useSetStaffCategory, useTableCheckout, useTableMergeControl, useUpdateStaffOrder } from "@/hooks";
import { useAppSelector } from "@/redux/hooks";
import { formatter } from "@/utils";

// const STATS =
//     [
//         { label: "Doanh thu", value: formatter.format(totalRevenue), icon: "💰", color: "from-emerald-900/60 to-emerald-950" },
//         { label: "Đơn đang chạy", value: activeOrders, icon: "🔄", color: "from-blue-900/60 to-blue-950" },
//         { label: "Bàn đang dùng", value: `${occupiedTables}/${tables.length}`, icon: "🪑", color: "from-orange-900/60 to-orange-950" },
//         { label: "Chờ xử lý", value: pendingOrders, icon: "⚡", color: "from-amber-900/60 to-amber-950" },
//     ]
function DashboardTab() {
    const { tables, orders } = useAppSelector((state) => state.staff);

    // Tính toán dựa trên trạng thái Uppercase mới
    const totalRevenue = orders
        .filter((o) => o.status === "COMPLETED")
        .reduce((s, o) => s + o.totalPrice, 0);

    // const activeOrders = orders.filter((o) => o.status !== "COMPLETED").length;
    // const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;
    // const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

    return (
        <main className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1 font-nunito">Today's Overview</h1>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* {STATS.map((stat) => (
                    <div key={stat.label} className={`rounded-2xl bg-gradient-to-br ${stat.color} border border-white/8 p-5`}>
                        <div className="text-2xl mb-2">{stat.icon}</div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-white/50 text-xs mt-1">{stat.label}</p>
                    </div>
                ))} */}
            </div>

            {/* Table map sử dụng TableStatus chuẩn */}
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {tables.map((table) => (
                    <div key={table.id}
                        className={`rounded-xl border-2 p-3 text-center transition-all 
                        ${table.status === 'OCCUPIED' ? 'border-orange-500 bg-orange-950' : 'border-slate-700 bg-slate-800'}`}>
                        <p className="font-bold text-sm text-white">B{table.id}</p>
                        <p className="text-white/40 text-xs">{table.status}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}


// ─── Order Tab ─────────────────────────────────────────────────────────────────

function OrderTab() {
    const { tables, selectedTableId, activeCategory, mergingMode, mergeSourceId } = useAppSelector((state) => state.staff);
    const selectTable = useSelectTable();
    const { handleToggleMerging, selectSourceTable } = useTableMergeControl();
    const setCategory = useSetStaffCategory();

    return (
        <main className="flex h-[calc(100vh-64px)] bg-[#0d0d14]">
            <section className="flex-1 flex flex-col overflow-hidden border-r border-white/8">
                {/* Table selector */}
                <div className="p-4 bg-[#111118] border-b border-white/8">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-bold text-white/70 uppercase tracking-wider">Select Table</p>
                        <button
                            onClick={handleToggleMerging}
                            className={`text-xs px-4 py-1.5 rounded-full border transition-all
                                ${mergingMode ? "bg-blue-500 border-blue-400 animate-pulse" : "bg-white/5 border-white/10"}`}
                        >
                            {mergingMode ? "Merging Mode Active..." : "🔗 Merge Tables"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tables.map((table) => (
                            <button
                                key={table.id}
                                onClick={() => mergingMode ? selectSourceTable(table.id) : selectTable(table.id)}
                                className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all
                                    ${selectedTableId === table.id ? "bg-orange-500 border-orange-400" : "bg-white/5 border-white/10"}`}
                            >
                                B{table.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category filter */}
                <div className="flex gap-2 px-4 py-3 border-b border-white/8 bg-[#0d0d14] overflow-x-auto">
                    {/* {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition-all ${activeCategory === cat ? "bg-white text-black font-semibold" : "bg-white/8 text-white/60 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))} */}
                </div>

                {/* Menu grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* {MENU.filter((m) => m.category === activeCategory).map((item) => {
                            const inCart = currentItems.find((i) => i.menuItem.id === item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => addItem(item)}
                                    className={`relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${inCart ? "bg-orange-500/15 border-orange-500/50" : "bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/20"
                                        }`}
                                >
                                    <span className="text-3xl mb-2">{item.emoji}</span>
                                    <p className="font-medium text-sm leading-snug">{item.name}</p>
                                    <p className="text-orange-400 text-sm font-semibold mt-1">{formatVND(item.price)}</p>
                                    {inCart && (
                                        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {inCart.quantity}
                                        </span>
                                    )}
                                </button>
                            );
                        })} */}
                    </div>
                </div>
            </section>
        </main>
    );
}

// ─── Manage Tab ────────────────────────────────────────────────────────────────
const ManageTab = () => {
    const { orders } = useAppSelector((state) => state.staff);
    const updateStatus = useUpdateStaffOrder();
    const finalizeCheckout = useTableCheckout();

    return (
        <main className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-nunito">Order Management</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-[#111118] border border-white/8 rounded-2xl p-5">
                        {/* Header đơn hàng */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold">Order #{order.id}</span>
                            <span className="text-orange-400 font-bold">{formatter.format(order.totalPrice)}</span>
                        </div>

                        {/* Actions chuyển đổi trạng thái */}
                        <div className="flex gap-2">
                            {order.status === "PENDING" && (
                                <button
                                    onClick={() => updateStatus(order.id, "PREPARING")}
                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30"
                                >
                                    Start Preparing
                                </button>
                            )}
                            {order.status === "PREPARING" && (
                                <button
                                    onClick={() => updateStatus(order.id, "COMPLETED")}
                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30"
                                >
                                    Mark as Completed
                                </button>
                            )}
                            {order.status === "COMPLETED" && (
                                <button
                                    onClick={() => finalizeCheckout(order.tableID || 0)}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-lg"
                                >
                                    💰 Process Payment
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}


export { DashboardTab, OrderTab, ManageTab }