'use client';

import Link from "next/link";
import { formatter } from "@/utils";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { getDashboardOrdersSWR, getDashboardTablesSWR } from "@/hooks/useDashboard";
import { ROUTES } from "@/config/constants/route";
import {
  ShoppingBag,
  LayoutGrid,
  DollarSign,
  Clock,
  UtensilsCrossed,
  Receipt,
  ArrowRight,
  Smile,
  Plus
} from "lucide-react";

const DashboardContent = () => {
  const { user } = useAuth();
  const tables_data = getDashboardTablesSWR();
  const orders_data = getDashboardOrdersSWR();

  const rawOrders = orders_data.data?.data;
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  const rawTables = tables_data.data?.data;
  const tables = Array.isArray(rawTables) ? rawTables : [];

  // Derived stats from state
  const totalRevenue = orders
    .filter((o) => o?.status === "COMPLETED")
    .reduce((s, o) => s + (o?.totalPrice ?? 0), 0);

  const todayOrders = orders.length;
  const pendingOrders = orders.filter((o) => o?.status === "PENDING").length;
  const preparingOrders = orders.filter((o) => o?.status === "PREPARING").length;
  const occupiedTables = tables.filter((t) => t?.status === "OCCUPIED").length;
  const availableTables = tables.filter((t) => t?.status === "EMPTY").length;
  const reservedTables = tables.filter((t) => t?.status === "RESERVED").length;

  const occupancyRate = tables.length > 0 ? Math.round((occupiedTables / tables.length) * 100) : 0;

  // Active orders queue
  const activeOrders = orders.filter(
    (o) => o?.status === "PENDING" || o?.status === "PREPARING"
  );

  // Top dishes derived from order items
  const dishCountMap: Record<string, number> = {};
  orders.forEach((o) => {
    if (Array.isArray(o?.details)) {
      o.details.forEach((detail) => {
        if (detail?.dish?.name) {
          dishCountMap[detail.dish.name] = (dishCountMap[detail.dish.name] ?? 0) + (detail.quantity ?? 1);
        }
      });
    }
  });
  const topDishes = Object.entries(dishCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => ({ name, count }));

  const stats = [
    {
      label: "Total Orders",
      value: todayOrders.toLocaleString("en-US"),
      sub: `${pendingOrders} pending`,
      icon: <ShoppingBag className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Tables In Use",
      value: `${occupiedTables}/${tables.length}`,
      sub: `${availableTables} available`,
      icon: <LayoutGrid className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      label: "Revenue",
      value: formatter.currency(totalRevenue),
      sub: "from completed orders",
      icon: <DollarSign className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50",
    },
    {
      label: "Pending",
      value: pendingOrders.toString(),
      sub: `${preparingOrders} preparing`,
      icon: <Clock className="w-5 h-5 text-stone-600" />,
      bg: "bg-stone-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
          <span>
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
              ? "afternoon"
              : "evening"}
            , {user?.name?.split(" ")[0] || "Staff"}
          </span>
          <Smile className="w-6 h-6 text-amber-500 shrink-0" />
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                {s.label}
              </span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>
                {s.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-900 tabular-nums mt-2">
                {s.value}
              </p>
              <p className="text-xs text-stone-500 mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2-Column Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Table Status */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Table Status
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 tabular-nums">
                {tables.length} total
              </span>
            </div>

            {/* Occupancy Progress */}
            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xs text-stone-500">Occupancy Rate</span>
                <span className="text-sm font-bold text-stone-900 tabular-nums">
                  {occupancyRate}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-amber-500 transition-all duration-500"
                  style={{ width: `${occupancyRate}%` }}
                />
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${tables.length > 0 ? Math.round((reservedTables / tables.length) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-800">Available</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 tabular-nums">
                  {availableTables} tables
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs font-semibold text-amber-800">Occupied</span>
                </div>
                <span className="text-xs font-bold text-amber-800 tabular-nums">
                  {occupiedTables} tables
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs font-semibold text-blue-800">Reserved</span>
                </div>
                <span className="text-xs font-bold text-blue-700 tabular-nums">
                  {reservedTables} tables
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100">
            <Link
              href={ROUTES.STAFF.TABLE_MAP}
              className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>View Table Floor Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: Top Dishes Today & Active Orders Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Dishes Today */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
              Top Dishes Today
            </h2>

            {topDishes.length === 0 ? (
              <div className="py-8 text-center">
                <UtensilsCrossed className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-400">No dish sales recorded yet today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topDishes.map((dish, i) => (
                  <div key={dish.name} className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 tabular-nums ${
                        i === 0
                          ? "bg-amber-100 text-amber-800 font-bold"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-semibold text-stone-800">
                          {dish.name}
                        </span>
                        <span className="text-xs font-medium text-stone-400 tabular-nums">
                          {dish.count} ordered
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-orange-500"
                          style={{
                            width: `${Math.round(
                              (dish.count / (topDishes[0]?.count ?? 1)) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Orders Queue */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Active Orders Queue
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 tabular-nums">
                {activeOrders.length} active
              </span>
            </div>

            {activeOrders.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <Receipt className="w-10 h-10 text-stone-300 mb-2" />
                <p className="text-sm font-semibold text-stone-700">No active orders</p>
                <p className="text-xs text-stone-400 max-w-sm mt-1">
                  All orders are completed. Tap below to start taking a new order for a table or customer.
                </p>
                <Link
                  href={ROUTES.STAFF.ORDER}
                  className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-medium text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Order</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {activeOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="py-3 flex items-center justify-between hover:bg-stone-50/50 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 font-bold text-xs flex items-center justify-center shrink-0">
                        #{order.id}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-800">
                          {order.tableID ? `Table B${order.tableID}` : "Online Order"}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {order.details?.length || 0} item{(order.details?.length || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          order.status === "PENDING"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs font-bold text-orange-600 tabular-nums">
                        {formatter.currency(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}

                {activeOrders.length > 5 && (
                  <div className="pt-3 text-center">
                    <Link
                      href={ROUTES.STAFF.MANAGE}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      View all {activeOrders.length} active orders →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
