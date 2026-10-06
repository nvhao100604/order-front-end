'use client'

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useSelectTable, useSetStaffCategory, useTableMergeControl } from "@/hooks/redux_custom_hooks/staffSlice.hooks";
import { getCategoriesSWR } from "@/hooks/useCategories";
import { getDishesSWR } from "@/hooks/useDishes";
import { getDashboardTablesSWR } from "@/hooks/useDashboard";
import { defaultQuery, IDish, IOrderDetailBase, IOrderCreate } from "@/interfaces";
import { formatter } from "@/utils";
import { postOrder } from "@/services/order.services";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";

interface POSCartItem {
    dish: IDish
    quantity: number
}

const StaffOrderPage = () => {
    const { user } = useAuth();
    const { tables: reduxTables, selectedTableId, activeCategory, mergingMode } = useAppSelector((state) => state.staff);
    const selectTable = useSelectTable();
    const { handleToggleMerging, selectSourceTable } = useTableMergeControl();
    const setCategory = useSetStaffCategory();

    // SWR Data Fetching
    const { data: categoryRes } = getCategoriesSWR(1, 50);
    const categories = categoryRes?.data || [];

    const { data: dishesRes, isLoading: isDishesLoading } = getDishesSWR(defaultQuery);
    const allDishes = dishesRes?.data || [];

    const { data: tablesRes } = getDashboardTablesSWR();
    const apiTables = tablesRes?.data || [];
    const tables = apiTables.length > 0 ? apiTables : reduxTables;

    // Cart items state mapping by table ID or active cart
    const [cartMap, setCartMap] = useState<Record<number, POSCartItem[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccessMsg, setOrderSuccessMsg] = useState('');
    const [orderErrorMsg, setOrderErrorMsg] = useState('');

    const currentTableId = selectedTableId || (tables[0]?.id ?? 1);
    const currentCart = cartMap[currentTableId] || [];

    const handleAddDish = (dish: IDish) => {
        setCartMap(prev => {
            const list = prev[currentTableId] || [];
            const existingIndex = list.findIndex(item => item.dish.id === dish.id);
            if (existingIndex >= 0) {
                const updated = [...list];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1
                };
                return { ...prev, [currentTableId]: updated };
            } else {
                return { ...prev, [currentTableId]: [...list, { dish, quantity: 1 }] };
            }
        });
    };

    const handleUpdateQuantity = (dishId: number, delta: number) => {
        setCartMap(prev => {
            const list = prev[currentTableId] || [];
            const updated = list.map(item => {
                if (item.dish.id === dishId) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : null;
                }
                return item;
            }).filter(Boolean) as POSCartItem[];

            return { ...prev, [currentTableId]: updated };
        });
    };

    const handleRemoveItem = (dishId: number) => {
        setCartMap(prev => {
            const list = prev[currentTableId] || [];
            return {
                ...prev,
                [currentTableId]: list.filter(item => item.dish.id !== dishId)
            };
        });
    };

    const subtotal = currentCart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    const handlePlaceOrder = async () => {
        if (currentCart.length === 0) return;
        setIsSubmitting(true);
        setOrderSuccessMsg('');
        setOrderErrorMsg('');

        try {
            const details: IOrderDetailBase[] = currentCart.map(item => ({
                dishID: item.dish.id,
                quantity: item.quantity,
                price: item.dish.price
            }));

            const payload: IOrderCreate = {
                customerID: user?.id || 1,
                staffID: user?.id,
                tableID: currentTableId,
                details,
                totalPrice: total,
                subtotal,
                tax,
                delivery: 0,
                notes: `Staff order for Table B${currentTableId}`
            };

            const res = await postOrder(payload);
            if (res.success || res.data) {
                setOrderSuccessMsg(`Order #${res.data?.id || ''} placed successfully for Table B${currentTableId}!`);
                setCartMap(prev => ({ ...prev, [currentTableId]: [] }));
            } else {
                setOrderErrorMsg(res.message || 'Failed to place order.');
            }
        } catch (err: any) {
            setOrderErrorMsg(err.response?.data?.detail || err.message || 'Error placing order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredDishes = activeCategory
        ? allDishes.filter(d => d.categoryId === activeCategory || d.category?.id === activeCategory)
        : allDishes;

    return (
        <main className="flex h-[calc(100vh-64px)] overflow-hidden" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>
            {/* Left/Middle: POS Menu */}
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
                                    background: currentTableId === table.id ? "#fb923c" : "rgba(255,255,255,0.05)",
                                    border: `1.5px solid ${currentTableId === table.id ? "#fb923c" : "rgba(255,255,255,0.08)"}`,
                                    color: currentTableId === table.id ? "white" : "rgba(255,255,255,0.6)",
                                }}
                            >
                                B{table.id} ({table.status})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category filter */}
                <div
                    className="flex gap-2 px-4 py-3 overflow-x-auto"
                    style={{ background: "#0d0d14", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                    <button
                        onClick={() => setCategory(null)}
                        className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                        style={{
                            background: activeCategory === null ? "white" : "rgba(255,255,255,0.07)",
                            color: activeCategory === null ? "#0d0d14" : "rgba(255,255,255,0.55)",
                        }}
                    >
                        All Categories
                    </button>
                    {categories.map((cat: any) => (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                            style={{
                                background: activeCategory === cat.id ? "white" : "rgba(255,255,255,0.07)",
                                color: activeCategory === cat.id ? "#0d0d14" : "rgba(255,255,255,0.55)",
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Menu grid */}
                <div className="flex-1 overflow-y-auto p-4" style={{ background: "#0f0f18" }}>
                    {isDishesLoading ? (
                        <div className="text-white/60 text-center py-12">Loading menu items...</div>
                    ) : filteredDishes.length === 0 ? (
                        <div className="text-white/40 text-center py-12">No dishes found in this category</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filteredDishes.map((dish) => {
                                const inCart = currentCart.find((i) => i.dish.id === dish.id);
                                return (
                                    <button
                                        key={dish.id}
                                        onClick={() => handleAddDish(dish)}
                                        className="relative flex flex-col items-start p-3 rounded-2xl text-left transition-all hover:scale-[1.02] group"
                                        style={{
                                            background: inCart ? "rgba(251,146,60,0.12)" : "rgba(255,255,255,0.03)",
                                            border: `1.5px solid ${inCart ? "rgba(251,146,60,0.4)" : "rgba(255,255,255,0.07)"}`,
                                        }}
                                    >
                                        <img
                                            src={dish.imgUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                                            alt={dish.name}
                                            className="w-full h-24 object-cover rounded-xl mb-2"
                                        />
                                        <p className="font-semibold text-xs text-white leading-snug line-clamp-1">{dish.name}</p>
                                        <p className="text-xs font-bold mt-1" style={{ color: "#fb923c" }}>{formatter.currency(dish.price)}</p>
                                        {inCart && (
                                            <span className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-orange-500 shadow">
                                                {inCart.quantity}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Right: Order Summary Sidebar */}
            <aside className="w-80 md:w-96 flex flex-col overflow-hidden" style={{ background: "#0b0b10" }}>
                <div className="p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-white tracking-wider">TABLE ORDER SUMMARY</h2>
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                            Table B{currentTableId}
                        </span>
                    </div>
                </div>

                {orderSuccessMsg && (
                    <div className="mx-4 mt-3 p-3 rounded-xl text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                        ✓ {orderSuccessMsg}
                    </div>
                )}

                {orderErrorMsg && (
                    <div className="mx-4 mt-3 p-3 rounded-xl text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                        ⚠ {orderErrorMsg}
                    </div>
                )}

                {/* Items list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {currentCart.length === 0 ? (
                        <div className="text-center py-16 text-white/30 text-xs">
                            No dishes selected for Table B{currentTableId}.
                            <br />Click menu items to add to order.
                        </div>
                    ) : (
                        currentCart.map(item => (
                            <div
                                key={item.dish.id}
                                className="flex items-center justify-between p-3 rounded-xl"
                                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <div className="flex-1 pr-2">
                                    <p className="text-xs font-medium text-white line-clamp-1">{item.dish.name}</p>
                                    <p className="text-xs font-semibold text-orange-400 mt-0.5">{formatter.currency(item.dish.price)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdateQuantity(item.dish.id, -1)}
                                        className="w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold transition-colors text-white/70 hover:bg-white/10"
                                        style={{ background: "rgba(255,255,255,0.05)" }}
                                    >
                                        -
                                    </button>
                                    <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdateQuantity(item.dish.id, 1)}
                                        className="w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold transition-colors text-white/70 hover:bg-white/10"
                                        style={{ background: "rgba(255,255,255,0.05)" }}
                                    >
                                        +
                                    </button>
                                    <button
                                        onClick={() => handleRemoveItem(item.dish.id)}
                                        className="w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-colors text-red-400 hover:bg-red-500/20"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Totals & Checkout */}
                <div className="p-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "#0e0e14" }}>
                    <div className="flex justify-between text-xs text-white/60">
                        <span>Subtotal</span>
                        <span>{formatter.currency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/60">
                        <span>Tax (8.5%)</span>
                        <span>{formatter.currency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Amount</span>
                        <span className="text-orange-400">{formatter.currency(total)}</span>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={currentCart.length === 0 || isSubmitting}
                        className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all hover:opacity-90 disabled:opacity-30 flex items-center justify-center gap-2 mt-3"
                        style={{ background: "#e85d1a", boxShadow: "0 4px 16px rgba(232,93,26,0.3)" }}
                    >
                        {isSubmitting ? "Placing Order..." : `Place Order (B${currentTableId})`}
                    </button>
                </div>
            </aside>
        </main>
    );
}

export default StaffOrderPage