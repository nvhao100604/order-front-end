"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { STAFF_TABS } from "@/redux/slices/staffSlice";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEnhancedAuth } from "@/hooks";
import { formatter } from "@/utils";
import { HiOutlineBell, HiOutlineXMark } from "react-icons/hi2";
import { MdOutlineLogout, MdOutlineMenu } from "react-icons/md";
import { LOGO_URL, ROUTES } from "@/config";

export default function StaffLayout({ children }: { children: ReactNode }) {
  const { orders } = useAppSelector((state) => state.staff)
  const { user, logout } = useEnhancedAuth()
  const pathname = usePathname()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showNotifPanel, setShowNotifPanel] = useState(false)

  const activeTab = pathname.split("/").pop()
  const newOrderNotifs = orders.filter(o => o.status === "PENDING")

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
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="p-2 rounded-xl transition-all"
                style={{ background: showNotifPanel ? "rgba(255,255,255,0.08)" : "transparent" }}
              >
                <HiOutlineBell
                  size={22}
                  style={{ color: newOrderNotifs.length > 0 ? "#e85d1a" : "rgba(255,255,255,0.35)" }}
                />
                {newOrderNotifs.length > 0 && (
                  <span
                    className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 animate-ping"
                    style={{ background: "#ef4444", borderColor: "#2a1f14" }}
                  />
                )}
              </button>

              {showNotifPanel && (
                <div
                  className="absolute right-0 mt-4 w-[280px] md:w-80 rounded-2xl shadow-2xl overflow-hidden"
                  style={{
                    background: "#2a1f14",
                    border: "1px solid rgba(212,175,120,0.15)",
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ borderBottom: "1px solid rgba(212,175,120,0.1)", background: "rgba(0,0,0,0.2)" }}
                  >
                    <p className="font-bold text-xs uppercase tracking-widest" style={{ color: "rgba(212,175,120,0.6)" }}>
                      Notifications
                    </p>
                    <HiOutlineXMark
                      className="cursor-pointer transition-colors"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                      onClick={() => setShowNotifPanel(false)}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {newOrderNotifs.length === 0 ? (
                      <div className="py-8 text-center text-sm italic" style={{ color: "rgba(255,255,255,0.15)" }}>
                        No new orders
                      </div>
                    ) : (
                      newOrderNotifs.map((order) => (
                        <Link
                          key={order.id}
                          href="/staff/manage"
                          onClick={() => setShowNotifPanel(false)}
                          className="block p-4 transition-colors"
                          style={{ borderBottom: "1px solid rgba(212,175,120,0.06)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <p className="text-sm font-bold text-white">New Order #{order.id}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {formatter.currency(order.totalPrice)} • {order.details.length} items
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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