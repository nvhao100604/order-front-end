'use client'
import { useSelectTable, useSetStaffCategory, useTableMergeControl } from "@/hooks/redux_custom_hooks/staffSlice.hooks";
import { useAppSelector } from "@/redux/hooks";

const StaffOrderPage = () => {
    const { tables, selectedTableId, activeCategory, mergingMode, mergeSourceId } = useAppSelector((state) => state.staff);
    const selectTable = useSelectTable();
    const { handleToggleMerging, selectSourceTable } = useTableMergeControl();
    const setCategory = useSetStaffCategory();

    return (
        <main className="flex h-[calc(100vh-64px)]" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            <section className="flex-1 flex flex-col overflow-hidden" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>

                {/* Table selector */}
                <div className="p-4" style={{ background: "#0f0f18", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                            Select Table
                        </p>
                        <button
                            onClick={handleToggleMerging}
                            className="text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1.5"
                            style={{
                                background: mergingMode ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.05)",
                                border: `1px solid ${mergingMode ? "rgba(96,165,250,0.5)" : "rgba(255,255,255,0.1)"}`,
                                color: mergingMode ? "#60a5fa" : "rgba(255,255,255,0.6)",
                            }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            {mergingMode ? "Merging Active..." : "Merge Tables"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {tables.map((table) => (
                            <button
                                key={table.id}
                                onClick={() => mergingMode ? selectSourceTable(table.id) : selectTable(table.id)}
                                className="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all"
                                style={{
                                    background: selectedTableId === table.id ? "#fb923c" : "rgba(255,255,255,0.05)",
                                    border: `1.5px solid ${selectedTableId === table.id ? "#fb923c" : "rgba(255,255,255,0.08)"}`,
                                    color: selectedTableId === table.id ? "white" : "rgba(255,255,255,0.6)",
                                }}
                            >
                                B{table.id}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category filter */}
                <div
                    className="flex gap-2 px-4 py-3 overflow-x-auto"
                    style={{ background: "#0d0d14", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    {/* {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                            style={{
                                background: activeCategory === cat ? "white" : "rgba(255,255,255,0.07)",
                                color: activeCategory === cat ? "#0d0d14" : "rgba(255,255,255,0.55)",
                            }}
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
                                    className="relative flex flex-col items-start p-4 rounded-2xl text-left transition-all"
                                    style={{
                                        background: inCart ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.03)",
                                        border: `1.5px solid ${inCart ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.07)"}`,
                                    }}
                                >
                                    <span className="text-3xl mb-2">{item.emoji}</span>
                                    <p className="font-medium text-sm text-white leading-snug">{item.name}</p>
                                    <p className="text-sm font-semibold mt-1" style={{ color: "#fb923c" }}>{formatter.currency(item.price)}</p>
                                    {inCart && (
                                        <span className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white bg-orange-500">
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

export default StaffOrderPage