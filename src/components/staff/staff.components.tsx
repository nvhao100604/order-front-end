"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, X } from "lucide-react";
import { formatter } from "@/utils";
import { IOrderResponse } from "@/interfaces";

interface NotifPanelProps {
    orders: IOrderResponse[];
    show: boolean;
    onToggle: () => void;
    onClose: () => void;
}

const NotifPanel = ({ orders, show, onToggle, onClose }: NotifPanelProps) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const newOrders = orders.filter((o) => o.status === "PENDING");

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        if (show) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [show, onClose]);

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell button */}
            <button
                onClick={onToggle}
                className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                    show
                        ? "bg-stone-100 text-stone-900"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
                aria-label="View notifications"
            >
                <Bell className="w-5 h-5" />
                {newOrders.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                    </span>
                )}
            </button>

            {/* Dropdown panel */}
            {show && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-white border border-stone-200/80 shadow-xl overflow-hidden z-50">
                    {/* Panel header */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-stone-50/60">
                        <div className="flex items-center gap-2">
                            <p className="font-bold text-xs uppercase tracking-wider text-stone-600">
                                Notifications
                            </p>
                            {newOrders.length > 0 && (
                                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-orange-600 text-white tabular-nums">
                                    {newOrders.length}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* List */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-stone-100">
                        {newOrders.length === 0 ? (
                            <div className="py-8 text-center text-xs text-stone-400">
                                No new orders in queue
                            </div>
                        ) : (
                            newOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href="/staff/manage"
                                    onClick={onClose}
                                    className="block p-3.5 hover:bg-orange-50/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-stone-800">Order #{order.id}</p>
                                        <span className="text-[11px] font-bold text-orange-600 tabular-nums">
                                            {formatter.currency(order.totalPrice)}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-stone-400 mt-0.5">
                                        {order.details?.length || 0} item{order.details?.length !== 1 ? "s" : ""} • Table {order.tableID || "Online"}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export { NotifPanel };
