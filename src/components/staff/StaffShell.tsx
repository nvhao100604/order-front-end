"use client";

import { useState, type ReactNode } from "react";
import { STAFF_TABS } from "@/redux/slices/staffSlice";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, X, LogOut, AlertTriangle, RefreshCw } from "lucide-react";
import { NotifPanel } from "./staff.components";
import useOrderPolling from "@/hooks/useOrderPolling";
import { useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { ROUTES } from "@/config/constants/route";
import { LOGO_URL } from "@/config/constants/public";
import { getDashboardOrdersSWR } from "@/hooks/useDashboard";
import { useSystemHealth } from "@/hooks/useSystemHealth";

export default function StaffLayout({ children }: { children: ReactNode }) {
  useOrderPolling();
  const { health, isHealthy, isDbConnected, isError, refreshHealth } = useSystemHealth(30000);

  const orders_data = getDashboardOrdersSWR();
  const rawOrders = orders_data.data?.data;
  const orders = Array.isArray(rawOrders) ? rawOrders : [];
  const { user, logout } = useEnhancedAuth();
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const activeTab = pathname.split("/").pop() || "dashboard";

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#F8F7F4] text-stone-800 font-sans antialiased">
      {/* ── OVERLAY (Mobile) ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-[#1C1613] text-stone-300 flex flex-col justify-between
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div>
          {/* Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-stone-800/80">
            <Link href={ROUTES.STAFF.DASHBOARD} className="flex items-center gap-3 group">
              <img
                src={LOGO_URL}
                alt="Logo"
                className="w-9 h-9 rounded-xl object-cover transition-transform group-hover:scale-105"
              />
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-orange-500 leading-none mb-1">
                  Foodie POS
                </p>
                <p className="font-bold tracking-tight text-base text-white">Staff Portal</p>
              </div>
            </Link>
            <button
              className="lg:hidden p-1.5 text-stone-400 hover:text-white transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
              Main Menu
            </p>
            {STAFF_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.includes(`/staff/${tab.id}`);
              return (
                <Link
                  key={tab.id}
                  href={`/staff/${tab.id}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 transition-colors ${
                    isActive
                      ? "bg-orange-600 text-white font-medium rounded-xl shadow-sm"
                      : "text-stone-400 hover:bg-stone-800/60 hover:text-stone-200 rounded-xl"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Health Status */}
        <div className="p-4 border-t border-stone-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isHealthy && isDbConnected
                    ? "bg-emerald-500 animate-pulse"
                    : isError
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />
              <span className="font-medium">
                {isHealthy && isDbConnected
                  ? "System Healthy"
                  : isError
                  ? "DB Disconnected"
                  : "Checking..."}
              </span>
            </span>
            {health?.database?.latency_ms !== null && health?.database?.latency_ms !== undefined && (
              <span className="tabular-nums text-stone-500 text-[10px]">
                {health.database.latency_ms}ms
              </span>
            )}
          </div>
          <p className="text-[10px] font-medium text-stone-500 text-center tracking-wider">
            FOODIE RESTAURANT V4.0.26
          </p>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-6 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400 font-medium hidden sm:inline">Staff</span>
              <span className="text-stone-300 hidden sm:inline">/</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200/60 uppercase tracking-wide">
                {activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotifPanel
              orders={orders}
              show={showNotifPanel}
              onToggle={() => setShowNotifPanel((v) => !v)}
              onClose={() => setShowNotifPanel(false)}
            />

            <div className="w-px h-5 bg-stone-200 hidden sm:block" />

            {/* User profile & logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-stone-800 leading-tight">{user?.name || "Staff"}</p>
                <p className="text-[11px] font-medium text-stone-400 tabular-nums">
                  ID: #{user?.id || 1}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 text-orange-700 font-bold text-sm flex items-center justify-center select-none shadow-xs">
                {user?.name?.[0]?.toUpperCase() ?? "S"}
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 hover:text-red-600 hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* 503 Service Maintenance / DB Disconnection Banner */}
        {(!isDbConnected || isError) && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-950 font-medium shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong className="font-bold">System Notice:</strong> Server database is currently unreachable (HTTP 503 Service Unavailable). Critical operations may be temporarily restricted until connection is restored.
              </span>
            </div>
            <button
              onClick={() => refreshHealth()}
              className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ml-4 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Status</span>
            </button>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8F7F4]">
          {children}
        </main>
      </div>
    </div>
  );
}
