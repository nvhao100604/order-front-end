"use client";

import { useState, type ReactNode } from "react";
import { useAppSelector } from "@/redux/hooks";
import { STAFF_TABS } from "@/redux/slices/staffSlice";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineLogout, MdOutlineMenu } from "react-icons/md";
import { NotifPanel } from "./staff.components";
import { dashboard_services } from "@/services/dashboard.services";
import useOrderWebSocket from "@/hooks/useOrderWebSocket";
import { useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { ROUTES } from "@/config/constants/route";
import { LOGO_URL } from "@/config/constants/public";
import { getDashboardOrdersSWR } from "@/hooks/useDashboard";

export default function StaffLayout({ children }: { children: ReactNode }) {
  useOrderWebSocket()

  const orders_data = getDashboardOrdersSWR()
  const orders = orders_data.data?.data ?? []
  const { user, logout } = useEnhancedAuth()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNotifPanel, setShowNotifPanel] = useState(false)

  const activeTab = pathname.split("/").pop()

  return (
    <div className="flex h-screen text-white font-sans overflow-hidden" style={{ background: "#1c1108" }}>

      {/* ── OVERLAY (Mobile) ── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[70] w-72 flex flex-col
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
        style={{
          background: "#2a1f14",
          borderRight: "1px solid rgba(212,175,120,0.12)",
        }}
      >
        {/* Logo */}
        <div
          className="p-6 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(212,175,120,0.1)", background: "rgba(0,0,0,0.15)" }}
        >
          <Link href={ROUTES.STAFF.DASHBOARD} className="flex items-center gap-3 group">
            <img
              src={LOGO_URL}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover transition-all group-hover:rotate-12"
              style={{
                border: "1px solid rgba(212,175,120,0.25)",
                boxShadow: "0 4px 12px rgba(232,93,26,0.15)",
              }}
            />
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black leading-none mb-1" style={{ color: "#d4af37" }}>
                Foodie POS
              </p>
              <p className="font-bold tracking-tight text-lg text-white">Staff Portal</p>
            </div>
          </Link>
          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiOutlineXMark size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          <p
            className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
            style={{ color: "rgba(212,175,120,0.35)" }}
          >
            Main Menu
          </p>
          {STAFF_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname.includes(`/staff/${tab.id}`);
            return (
              <Link
                key={tab.id}
                href={`/staff/${tab.id}`}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200"
                style={{
                  background: isActive ? "#e85d1a" : "transparent",
                  color: isActive ? "white" : "rgba(255,255,255,0.35)",
                  boxShadow: isActive ? "0 4px 16px rgba(232,93,26,0.25)" : "none",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)" }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent" }}
              >
                <Icon size={20} style={{ color: isActive ? "white" : "rgba(255,255,255,0.35)" }} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <div
          className="p-6 text-[10px] font-medium text-center"
          style={{ borderTop: "1px solid rgba(212,175,120,0.08)", color: "rgba(212,175,120,0.2)" }}
        >
          FOODIE RESTAURANT V4.0.26
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">

        {/* HEADER ──────────────────────────────────────────────────────── */}
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-8 py-4 backdrop-blur-xl"
          style={{
            background: "rgba(26,16,8,0.85)",
            borderBottom: "1px solid rgba(212,175,120,0.12)",
          }}
        >
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="lg:hidden p-2 -ml-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onClick={() => setIsSidebarOpen(true)}
            >
              <MdOutlineMenu size={24} />
            </button>

            <div className="flex items-center gap-2 md:gap-3">
              <span className="font-medium hidden sm:inline" style={{ color: "rgba(255,255,255,0.35)" }}>Staff</span>
              <span className="hidden sm:inline" style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
              <span
                className="text-xs md:text-sm px-3 py-1.5 rounded-lg font-bold whitespace-nowrap capitalize"
                style={{
                  background: "rgba(232,93,26,0.15)",
                  color: "#e85d1a",
                  border: "1px solid rgba(232,93,26,0.25)",
                }}
              >
                {activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <NotifPanel
              orders={orders}
              show={showNotifPanel}
              onToggle={() => setShowNotifPanel(v => !v)}
              onClose={() => setShowNotifPanel(false)}
            />

            <div className="w-px h-6 hidden sm:block" style={{ background: "rgba(212,175,120,0.12)" }} />

            {/* User info & logout */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-white leading-none mb-1">{user?.name || "Staff"}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#d4af37" }}>
                  ID: {user?.roleID || 1}
                </p>
              </div>

              <div
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black text-sm"
                style={{
                  background: "rgba(212,175,120,0.12)",
                  border: "1px solid rgba(212,175,120,0.2)",
                  color: "#d4af37",
                }}
              >
                {user?.name?.[0]?.toUpperCase() ?? "S"}
              </div>

              <button
                onClick={logout}
                className="flex items-center justify-center w-9 h-9 md:w-auto md:px-4 md:py-2 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "#ef4444"
                  el.style.color = "white"
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = "rgba(239,68,68,0.1)"
                  el.style.color = "#f87171"
                }}
              >
                <MdOutlineLogout className="text-lg md:mr-2" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative" style={{
          background: 'linear-gradient(135deg, #faf6f0 0%, #f5ede0 40%, #ede0cc 100%)',
        }}>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(232,93,26,0.04) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)" }} />
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}