"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { HiOutlineBell, HiOutlineXMark } from "react-icons/hi2";
import { formatter } from "@/utils";
import { IOrderResponse } from "@/interfaces";

interface NotifPanelProps {
    orders: IOrderResponse[]
    show: boolean
    onToggle: () => void
    onClose: () => void
}

const NotifPanel = ({ orders, show, onToggle, onClose }: NotifPanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null)
    const newOrders = orders.filter(o => o.status === "PENDING")
    // console.log("all pending: ", orders.length)
    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node))
                onClose()
        }
        if (show) document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [show, onClose])

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                onClick={onToggle}
                className="p-2 rounded-xl transition-all"
                style={{ background: show ? "rgba(255,255,255,0.08)" : "transparent" }}
            >
                <HiOutlineBell
                    size={22}
                    style={{ color: newOrders.length > 0 ? "#e85d1a" : "rgba(255,255,255,0.35)" }}
                />
                {newOrders.length > 0 && (
                    <span
                        className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 animate-ping"
                        style={{ background: "#ef4444", borderColor: "#2a1f14" }}
                    />
                )}
            </button>

            {/* Dropdown panel */}
            {show && (
                <div
                    className="absolute right-0 mt-4 w-[280px] md:w-80 rounded-2xl shadow-2xl overflow-hidden"
                    style={{ background: "#2a1f14", border: "1px solid rgba(212,175,120,0.15)" }}
                >
                    {/* Panel header */}
                    <div
                        className="px-4 py-3 flex items-center justify-between"
                        style={{ borderBottom: "1px solid rgba(212,175,120,0.1)", background: "rgba(0,0,0,0.2)" }}
                    >
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-xs uppercase tracking-widest" style={{ color: "rgba(212,175,120,0.6)" }}>
                                Notifications
                            </p>
                            {newOrders.length > 0 && (
                                <span
                                    className="text-xs px-1.5 py-0.5 rounded-full font-black"
                                    style={{ background: "#e85d1a", color: "white" }}
                                >
                                    {newOrders.length}
                                </span>
                            )}
                        </div>
                        <HiOutlineXMark
                            className="cursor-pointer"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                            onClick={onClose}
                        />
                    </div>

                    {/* List */}
                    <div className="max-h-64 overflow-y-auto">
                        {newOrders.length === 0 ? (
                            <div className="py-8 text-center text-sm italic" style={{ color: "rgba(255,255,255,0.15)" }}>
                                No new orders
                            </div>
                        ) : (
                            newOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href="/staff/manage"
                                    onClick={onClose}
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
    )
}

export {
    NotifPanel
}