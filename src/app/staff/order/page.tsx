'use client';

import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  useSelectTable,
  useSetStaffCategory,
  useTableMergeControl,
} from "@/hooks/redux_custom_hooks/staffSlice.hooks";
import { getCategoriesSWR } from "@/hooks/useCategories";
import { getDishesSWR } from "@/hooks/useDishes";
import { getDashboardTablesSWR } from "@/hooks/useDashboard";
import { defaultQuery, IDish, IOrderDetailBase, IOrderCreate } from "@/interfaces";
import { formatter } from "@/utils";
import { postOrder } from "@/services/order.services";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { mutate } from "swr";
import { useSystemHealth } from "@/hooks/useSystemHealth";
import { ORDER_KEY, TABLE_KEY } from "@/config/constants/api";
import {
  Search,
  GitMerge,
  ChevronDown,
  UtensilsCrossed,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

interface POSCartItem {
  dish: IDish;
  quantity: number;
}

const StaffOrderPage = () => {
  const { user } = useAuth();
  const {
    tables: reduxTables,
    selectedTableId,
    activeCategory,
    mergingMode,
  } = useAppSelector((state) => state.staff);
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
  const [orderSuccessMsg, setOrderSuccessMsg] = useState("");
  const [orderErrorMsg, setOrderErrorMsg] = useState("");
  const { isDbConnected, isError: isHealthError } = useSystemHealth(30000);

  // Search query & image fallbacks
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const currentTableId = selectedTableId || (tables[0]?.id ?? 1);
  const currentCart = cartMap[currentTableId] || [];

  const handleAddDish = (dish: IDish) => {
    setCartMap((prev) => {
      const list = prev[currentTableId] || [];
      const existingIndex = list.findIndex((item) => item.dish.id === dish.id);
      if (existingIndex >= 0) {
        const updated = [...list];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return { ...prev, [currentTableId]: updated };
      } else {
        return { ...prev, [currentTableId]: [...list, { dish, quantity: 1 }] };
      }
    });
  };

  const handleUpdateQuantity = (dishId: number, delta: number) => {
    setCartMap((prev) => {
      const list = prev[currentTableId] || [];
      const updated = list
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[];

      return { ...prev, [currentTableId]: updated };
    });
  };

  const handleRemoveItem = (dishId: number) => {
    setCartMap((prev) => {
      const list = prev[currentTableId] || [];
      return {
        ...prev,
        [currentTableId]: list.filter((item) => item.dish.id !== dishId),
      };
    });
  };

  const subtotal = currentCart.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );
  const tax = subtotal * 0.085;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (currentCart.length === 0) return;
    if (!isDbConnected || isHealthError) {
      setOrderErrorMsg(
        "Cannot place order: Server database connection is currently unavailable (HTTP 503). Please wait until connection is restored."
      );
      return;
    }
    setIsSubmitting(true);
    setOrderSuccessMsg("");
    setOrderErrorMsg("");

    try {
      const details: IOrderDetailBase[] = currentCart.map((item) => ({
        dishID: item.dish.id,
        quantity: item.quantity,
        price: item.dish.price,
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
        notes: `Staff order for Table B${currentTableId}`,
      };

      const res = await postOrder(payload);
      if (res.success || res.data) {
        mutate(
          (key) =>
            typeof key === "string" &&
            (key.includes(ORDER_KEY) || key.includes(TABLE_KEY))
        );
        setOrderSuccessMsg(
          `Order #${res.data?.id || ""} placed successfully for Table B${currentTableId}!`
        );
        setCartMap((prev) => ({ ...prev, [currentTableId]: [] }));
      } else {
        setOrderErrorMsg(res.message || "Failed to place order.");
      }
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      if (status === 409) {
        setOrderErrorMsg(
          data?.message ||
            data?.detail ||
            "Order conflict or table is currently locked. Please try again."
        );
      } else if (status === 503) {
        setOrderErrorMsg(
          "Server maintenance or database connection unavailable (HTTP 503). Please wait for database reconnection before submitting orders."
        );
      } else if (status === 422) {
        setOrderErrorMsg(
          data?.detail ||
            data?.message ||
            "Invalid order data or payload conflict. Please verify items."
        );
      } else {
        setOrderErrorMsg(
          data?.detail || data?.message || err.message || "Error placing order."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDishes = allDishes.filter((d) => {
    const matchesCategory = activeCategory
      ? d.categoryId === activeCategory || d.category?.id === activeCategory
      : true;
    const matchesSearch = searchQuery.trim()
      ? d.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="-m-6 h-[calc(100vh-64px)] flex overflow-hidden bg-[#F8F7F4]">
      {/* ── LEFT: POS Menu Area ────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col h-full overflow-hidden pl-6 pr-6 pt-4 pb-4">
        {/* Compact Toolbar: Search + Compact Table Selector + Merge */}
        <div className="flex items-center gap-3 mb-3 shrink-0">
          {/* Search dishes */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200/80 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-xs"
            />
          </div>

          {/* Compact Table Selector */}
          <div className="relative shrink-0">
            <select
              value={currentTableId}
              onChange={(e) => {
                const id = Number(e.target.value);
                if (mergingMode) {
                  selectSourceTable(id);
                } else {
                  selectTable(id);
                }
              }}
              className="appearance-none bg-white border border-stone-200/80 rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer shadow-xs"
            >
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table B{table.id} ({table.status})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          </div>

          {/* Merge Tables Button */}
          <button
            onClick={handleToggleMerging}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0 ${
              mergingMode
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-stone-200/80 text-stone-700 hover:bg-stone-50"
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>{mergingMode ? "Merging..." : "Merge Tables"}</span>
          </button>
        </div>

        {/* Category Pills (Hidden scrollbar) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setCategory(null)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === null
                ? "bg-orange-600 text-white shadow-sm"
                : "bg-stone-100 hover:bg-stone-200/70 text-stone-600"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-stone-100 hover:bg-stone-200/70 text-stone-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Dish Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {isDishesLoading ? (
            <div className="text-stone-400 text-center py-16 text-xs">Loading menu items...</div>
          ) : filteredDishes.length === 0 ? (
            <div className="text-stone-400 text-center py-16 text-xs flex flex-col items-center">
              <UtensilsCrossed className="w-8 h-8 text-stone-300 mb-2" />
              <span>No dishes found in this category</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
              {filteredDishes.map((dish) => {
                const inCart = currentCart.find((i) => i.dish.id === dish.id);
                const hasError = imageErrors[dish.id];

                return (
                  <div
                    key={dish.id}
                    onClick={() => handleAddDish(dish)}
                    className="bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-500/50 transition-all cursor-pointer group flex flex-col relative"
                  >
                    {/* Image frame */}
                    <div className="aspect-[4/3] w-full bg-stone-100 relative overflow-hidden flex items-center justify-center">
                      {dish.imgUrl && !hasError ? (
                        <img
                          src={dish.imgUrl}
                          alt={dish.name}
                          onError={() => setImageErrors((prev) => ({ ...prev, [dish.id]: true }))}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 bg-stone-100">
                          <UtensilsCrossed className="w-7 h-7 stroke-1" />
                          <span className="text-[10px] text-stone-400 mt-1 font-medium">Foodie</span>
                        </div>
                      )}

                      {inCart && (
                        <span className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-orange-600 shadow-md tabular-nums">
                          {inCart.quantity}
                        </span>
                      )}
                    </div>

                    {/* Dish information */}
                    <div className="p-3 flex flex-col justify-between flex-1">
                      <h3 className="font-semibold text-xs text-stone-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {dish.name}
                      </h3>
                      <p className="text-xs font-bold text-orange-600 tabular-nums mt-1.5">
                        {formatter.currency(dish.price)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── RIGHT: Cart Summary Sidebar ─────────────────────────────────── */}
      <aside className="w-96 shrink-0 bg-white border-l border-stone-200 h-full flex flex-col justify-between shadow-xs">
        {/* Header */}
        <div className="p-4 border-b border-stone-200/80 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Order Summary</h2>
            <p className="text-[11px] text-stone-400">Review selected dishes</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/60 tabular-nums">
            Table B{currentTableId}
          </span>
        </div>

        {/* Feedback alerts */}
        {orderSuccessMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{orderSuccessMsg}</span>
          </div>
        )}

        {orderErrorMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl text-xs font-medium bg-red-50 text-red-800 border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{orderErrorMsg}</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {currentCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 text-stone-400 text-xs">
              <ShoppingBag className="w-10 h-10 text-stone-300 mb-2" />
              <p className="font-semibold text-stone-600">No dishes selected</p>
              <p className="text-[11px] text-stone-400 mt-1 max-w-[200px]">
                Click dishes on the menu to add them for Table B{currentTableId}.
              </p>
            </div>
          ) : (
            currentCart.map((item) => (
              <div
                key={item.dish.id}
                className="flex items-center justify-between p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <div className="flex-1 pr-2">
                  <p className="text-xs font-semibold text-stone-800 line-clamp-1">
                    {item.dish.name}
                  </p>
                  <p className="text-xs font-bold text-orange-600 tabular-nums mt-0.5">
                    {formatter.currency(item.dish.price)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateQuantity(item.dish.id, -1)}
                    className="w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-xs font-bold text-stone-900 w-5 text-center tabular-nums">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => handleUpdateQuantity(item.dish.id, 1)}
                    className="w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold text-stone-600 bg-white border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleRemoveItem(item.dish.id)}
                    className="w-7 h-7 rounded-lg text-xs flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals & Checkout */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50/50 space-y-2">
          <div className="flex justify-between text-xs text-stone-500">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium text-stone-800">
              {formatter.currency(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-stone-500">
            <span>Tax (8.5%)</span>
            <span className="tabular-nums font-medium text-stone-800">
              {formatter.currency(tax)}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
            <span>Total Amount</span>
            <span className="text-orange-600 tabular-nums">
              {formatter.currency(total)}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={currentCart.length === 0 || isSubmitting}
            className="w-full py-3 mt-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? "Placing Order..." : `Place Order (Table B${currentTableId})`}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default StaffOrderPage;
