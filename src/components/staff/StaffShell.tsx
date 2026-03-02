"use client";

import { useState, type ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useSetStaffTab } from "@/hooks";
import { STAFF_TABS } from "@/redux/slices/staffSlice";
import { formatter } from "@/utils";
import { HiOutlineBell, HiOutlineXMark } from "react-icons/hi2";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const { activeTab, orders } = useAppSelector((state) => state.staff);
  const setTab = useSetStaffTab();
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const newOrderNotifs = orders.filter(o => o.status === "PENDING");

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans selection:bg-orange-500/30">
      {/* ── Header & Navigation ────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-[#0d0d14]/80 border-b border-white/5 backdrop-blur-xl">

        {/* Brand Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">🍽️</div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-black leading-none mb-1">Foodie POS</p>
            <p className="font-bold tracking-tight leading-tight text-base">Staff Portal</p>
          </div>
        </div>

        {/* Central Navigation: Persistent across tab changes */}
        <nav className="flex gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
          {STAFF_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold transition-all duration-300 ${isActive
                  ? "bg-white text-black shadow-xl"
                  : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className={`text-lg ${isActive ? "text-orange-600" : ""}`} />
                <span className="hidden lg:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Notification System */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPanel(!showNotifPanel)}
            className={`p-2.5 rounded-xl transition-all border ${showNotifPanel ? "bg-white/10 border-white/20" : "bg-white/5 border-transparent"
              }`}
          >
            <HiOutlineBell size={22} className={newOrderNotifs.length > 0 ? "text-orange-500" : "text-white/60"} />
            {newOrderNotifs.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-[#0d0d14] animate-bounce">
                {newOrderNotifs.length}
              </span>
            )}
          </button>

          {showNotifPanel && (
            <div className="absolute right-0 mt-3 w-80 bg-[#15151f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-white/5">
                <p className="font-bold text-xs uppercase tracking-widest text-white/60">New Notifications</p>
                <HiOutlineXMark
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowNotifPanel(false)}
                />
              </div>
              <div className="max-h-80 overflow-y-auto">
                {newOrderNotifs.length === 0 ? (
                  <div className="py-10 text-center text-white/20 text-sm">No new alerts</div>
                ) : (
                  newOrderNotifs.map((order) => (
                    <div key={order.id} className="p-4 hover:bg-white/5 border-b border-white/5 transition-colors">
                      <p className="text-sm font-bold">New Order #{order.id}</p>
                      <p className="text-xs text-white/40 mt-1">{formatter.format(order.totalPrice)} • {order.details.length} items</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content Area ──────────────────────────────────────────────────── */}
      <main className="relative flex-1">
        {children}
      </main>
    </div>
  );
}