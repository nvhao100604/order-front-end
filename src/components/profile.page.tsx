"use client";

import { defaultQuery, IOrderDetailResponse, OrderStatus, OrderStatusKey, OrderStatusMap } from "@/interfaces";
import { useAppSelector } from "@/redux/hooks";
import { orders_services } from "@/services";
import { formatter } from "@/utils";
import { useState } from "react";
import { Header } from "./app";
import { statusStyle } from "@/app/staff/manage/manage.component";

const getStatusStyle = (status: OrderStatusKey) => {
    return statusStyle[status] ?? statusStyle.PENDING;
};

type Tab = "overview" | "orders" | "settings";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>("overview");
    const [editMode, setEditMode] = useState(false);
    const auth = useAppSelector(state => state.auth.user)

    const { data } = orders_services.getOrdersSWR({
        ...defaultQuery,
        customerID: auth?.id,
    }, { revalidateOnMount: true }) ?? []

    const orderHistory = data?.data || []
    const mockUser = {
        name: auth?.name,
        email: auth?.email,
        phone: auth?.phoneNumber,
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=minhkhoa",
        joinDate: formatter.date(auth?.createdAt ?? ""),
        memberTier: "Gold Member",
        points: 2840,
        totalOrders: orderHistory.length,
        favoriteTable: "Table 12 – Garden View",
        upcomingReservation: {
            date: "Saturday, March 8, 2026",
            time: "7:00 PM",
            guests: 4,
            table: "Garden View",
        },
    };

    const tabs: { id: Tab; label: string; icon: string }[] = [
        { id: "overview", label: "Overview", icon: "◈" },
        { id: "orders", label: "Order History", icon: "◎" },
        // { id: "favorites", label: "Favorites", icon: "◇" },
        { id: "settings", label: "Settings", icon: "◉" },
    ];

    return (
        <div
            className="min-h-screen"
            style={{
                background: "linear-gradient(135deg, #faf6f0 0%, #f5ede0 40%, #ede0cc 100%)",
                fontFamily: "'Plus Jakarta Sans'",
            }}
        >
            {/* Noise overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Navbar */}
            <Header />
            <div className="max-w-6xl mx-auto px-4 py-10 relative">

                {/* Profile Hero */}
                <div
                    className="rounded-2xl overflow-hidden mb-8 relative"
                    style={{
                        background: "linear-gradient(160deg, #8b6b4a 0%, #6b4e35 60%, #4a3525 100%)",
                        boxShadow: "0 20px 60px rgba(74,53,37,0.35)",
                    }}
                >
                    {/* Diagonal pattern */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212,175,120,0.5) 20px, rgba(212,175,120,0.5) 21px)" }}
                    />

                    <div className="relative p-8 md:p-12">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <div
                                    className="w-28 h-28 rounded-full overflow-hidden"
                                    style={{ border: "3px solid rgba(212,175,120,0.7)", boxShadow: "0 0 0 6px rgba(212,175,120,0.15)" }}
                                >
                                    <img src={mockUser.avatar} alt={mockUser.name} className="w-full h-full object-cover" />
                                </div>
                                <div
                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs"
                                    style={{ background: "#d4af37", color: "#4a3525" }}
                                >
                                    ★
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                    <h1
                                        className="text-3xl md:text-4xl font-bold"
                                        style={{ color: "#faf0e0", letterSpacing: "-0.5px" }}
                                    >
                                        {mockUser.name}
                                    </h1>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
                                        style={{ background: "#d4af37", color: "#4a3525" }}
                                    >
                                        {mockUser.memberTier.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm mb-4" style={{ color: "rgba(212,175,120,0.8)" }}>
                                    Member since {mockUser.joinDate}
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    {[
                                        { val: mockUser.points.toLocaleString(), label: "Loyalty Points" },
                                        { val: mockUser.totalOrders, label: "Total Orders" },
                                        { val: "4.9", label: "Avg Rating" },
                                    ].map((s, i) => (
                                        <div key={s.label} className="flex gap-6">
                                            {i > 0 && <div style={{ borderLeft: "1px solid rgba(212,175,120,0.3)" }} />}
                                            <div className={i > 0 ? "pl-6" : ""}>
                                                <p className="text-2xl font-bold" style={{ color: "#d4af37" }}>{s.val}</p>
                                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reservation card */}
                            <div
                                className="flex-shrink-0 rounded-xl p-5 min-w-52"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(212,175,120,0.25)", backdropFilter: "blur(8px)" }}
                            >
                                <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "#d4af37" }}>
                                    UPCOMING RESERVATION
                                </p>
                                <p className="text-white font-semibold">{mockUser.upcomingReservation.date}</p>
                                <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                                    {mockUser.upcomingReservation.time} · {mockUser.upcomingReservation.guests} Guests
                                </p>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{mockUser.upcomingReservation.table}</p>
                                <button
                                    className="mt-3 text-xs font-semibold py-1 px-3 rounded-full transition-all hover:scale-105"
                                    style={{ background: "#e85d1a", color: "white" }}
                                >
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div
                    className="flex gap-1 mb-8 p-1 rounded-xl"
                    style={{ background: "rgba(139,107,74,0.12)", border: "1px solid rgba(139,107,74,0.2)" }}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300"
                            style={{
                                background: activeTab === tab.id ? "white" : "transparent",
                                color: activeTab === tab.id ? "#6b4e35" : "rgba(107,78,53,0.6)",
                                boxShadow: activeTab === tab.id ? "0 2px 12px rgba(139,107,74,0.2)" : "none",
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* OVERVIEW */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                        <div
                            className="md:col-span-2 rounded-2xl p-6"
                            style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold" style={{ color: "#4a3525" }}>Personal Information</h2>
                                <button
                                    onClick={() => setEditMode(!editMode)}
                                    className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:scale-105"
                                    style={{
                                        background: editMode ? "#e85d1a" : "#f5ede0",
                                        color: editMode ? "white" : "#6b4e35",
                                    }}
                                >
                                    {editMode ? "Save Changes" : "Edit Profile"}
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {[
                                    { label: "Full Name", value: mockUser.name, icon: "👤" },
                                    { label: "Email Address", value: mockUser.email, icon: "✉" },
                                    { label: "Phone Number", value: mockUser.phone, icon: "📞" },
                                    { label: "Favorite Table", value: mockUser.favoriteTable, icon: "🪑" },
                                ].map((field) => (
                                    <div key={field.label}>
                                        <label className="text-xs font-semibold tracking-wider" style={{ color: "rgba(107,78,53,0.5)" }}>
                                            {field.label.toUpperCase()}
                                        </label>
                                        {editMode ? (
                                            <input
                                                defaultValue={field.value}
                                                className="w-full mt-1 px-4 py-3 rounded-lg text-sm outline-none"
                                                style={{ border: "1.5px solid #d4af37", background: "#faf6f0", color: "#4a3525", fontFamily: "Georgia, serif" }}
                                            />
                                        ) : (
                                            <p className="mt-1 flex items-center gap-2 text-sm" style={{ color: "#4a3525" }}>
                                                <span>{field.icon}</span> {field.value}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Points card */}
                            <div
                                className="rounded-2xl p-6 text-center"
                                style={{ background: "linear-gradient(135deg, #d4af37 0%, #b8941e 100%)", boxShadow: "0 8px 32px rgba(212,175,55,0.3)" }}
                            >
                                <p className="text-sm font-semibold tracking-widest mb-3" style={{ color: "rgba(74,53,37,0.7)" }}>
                                    GOLD TIER POINTS
                                </p>
                                <p className="text-5xl font-bold mb-1" style={{ color: "#4a3525" }}>{mockUser.points.toLocaleString()}</p>
                                <p className="text-sm mb-4" style={{ color: "rgba(74,53,37,0.6)" }}>160 pts to Platinum</p>
                                <div className="w-full h-2 rounded-full mb-4" style={{ background: "rgba(74,53,37,0.2)" }}>
                                    <div className="h-full rounded-full" style={{ width: "94.7%", background: "#4a3525" }} />
                                </div>
                                <button
                                    className="w-full py-2 rounded-lg text-sm font-bold transition-all hover:scale-105"
                                    style={{ background: "#4a3525", color: "#d4af37" }}
                                >
                                    Redeem Points
                                </button>
                            </div>

                            {/* This month */}
                            <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}>
                                <h3 className="font-bold mb-4" style={{ color: "#4a3525" }}>This Month</h3>
                                {[
                                    { label: "Visits", value: "3", change: "+1" },
                                    { label: "Amount Spent", value: "₫1.5M", change: "+12%" },
                                    { label: "Points Earned", value: "340", change: "+18%" },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="flex justify-between items-center py-2"
                                        style={{ borderBottom: "1px solid #f5ede0" }}
                                    >
                                        <span className="text-sm" style={{ color: "rgba(107,78,53,0.6)" }}>{stat.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm" style={{ color: "#4a3525" }}>{stat.value}</span>
                                            <span
                                                className="text-xs px-2 py-0.5 rounded-full"
                                                style={{ background: "#f0faf0", color: "#2d7a2d" }}
                                            >
                                                {stat.change}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS */}
                {activeTab === "orders" && (
                    <div className="animate-fade-in">
                        <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}>
                            <div className="p-6 flex items-center justify-between" style={{ borderBottom: "1px solid #f5ede0" }}>
                                <h2 className="text-xl font-bold" style={{ color: "#4a3525" }}>Order History</h2>
                                <span className="text-sm" style={{ color: "rgba(107,78,53,0.5)" }}>{orderHistory.length} orders</span>
                            </div>
                            {orderHistory.map((order) => (
                                <div
                                    key={order.id}
                                    className="p-6 transition-colors group hover:bg-amber-50"
                                    style={{ borderBottom: "1px solid #f5ede0" }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="font-bold" style={{ color: "#4a3525" }}>{order.id}</span>
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                                    style={{
                                                        background: getStatusStyle(order.status).bg,
                                                        color: getStatusStyle(order.status).color,
                                                        border: getStatusStyle(order.status).border
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm mb-1" style={{ color: "rgba(107,78,53,0.5)" }}>
                                                {formatter.time(order.createdAt)}, {formatter.date(order.createdAt)}
                                            </p>
                                            <p className="text-sm" style={{ color: "#6b4e35" }}>
                                                {order.details.map((d: IOrderDetailResponse) => d.dish.name).join(" · ")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-lg font-bold" style={{ color: "#4a3525" }}>{formatter.currency(order.totalPrice)}</p>
                                            <button
                                                className="opacity-0 group-hover:opacity-100 text-xs px-3 py-2 rounded-lg transition-all font-semibold"
                                                style={{ background: "#f5ede0", color: "#6b4e35" }}
                                            >
                                                Reorder →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAVORITES */}
                {/* {activeTab === "favorites" && (
                    <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {favoriteItems.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center gap-5 p-5 rounded-2xl group hover:scale-[1.02] transition-all cursor-pointer"
                                style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}
                            >
                                <div
                                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                                    style={{ background: "#faf0e0" }}
                                >
                                    {item.emoji}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold" style={{ color: "#4a3525" }}>{item.name}</h3>
                                    <p className="text-xs mt-0.5" style={{ color: "rgba(107,78,53,0.5)" }}>{item.category}</p>
                                    <p className="text-sm font-semibold mt-1" style={{ color: "#d4af37" }}>{formatter.currency(item.price)}</p>
                                </div>
                                <button
                                    className="opacity-0 group-hover:opacity-100 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                                    style={{ background: "#e85d1a" }}
                                >
                                    +
                                </button>
                            </div>
                        ))}
                    </div>
                )} */}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                    <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Notifications */}
                        <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}>
                            <h2 className="text-xl font-bold mb-6" style={{ color: "#4a3525" }}>Notifications</h2>
                            {[
                                { label: "Reservation Reminders", desc: "Get notified 2h before your booking", enabled: true },
                                { label: "Special Offers", desc: "Exclusive deals for Gold members", enabled: true },
                                { label: "New Menu Items", desc: "Be first to know about seasonal dishes", enabled: false },
                                { label: "Points Updates", desc: "Alerts when you earn or redeem points", enabled: true },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex items-center justify-between py-4"
                                    style={{ borderBottom: "1px solid #f5ede0" }}
                                >
                                    <div>
                                        <p className="font-semibold text-sm" style={{ color: "#4a3525" }}>{item.label}</p>
                                        <p className="text-xs" style={{ color: "rgba(107,78,53,0.5)" }}>{item.desc}</p>
                                    </div>
                                    <div
                                        className="w-12 h-6 rounded-full flex items-center cursor-pointer"
                                        style={{
                                            background: item.enabled ? "#d4af37" : "#e0d5c8",
                                            padding: "2px",
                                            justifyContent: item.enabled ? "flex-end" : "flex-start",
                                        }}
                                    >
                                        <div className="w-5 h-5 rounded-full bg-white shadow" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Dietary */}
                            <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}>
                                <h2 className="text-xl font-bold mb-4" style={{ color: "#4a3525" }}>Dietary Preferences</h2>
                                <div className="flex flex-wrap gap-2">
                                    {["No Shellfish", "Low Sodium", "Halal", "No MSG", "Vegetarian Options"].map((pref, i) => (
                                        <span
                                            key={pref}
                                            className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105"
                                            style={{
                                                background: i < 3 ? "#4a3525" : "#f5ede0",
                                                color: i < 3 ? "#d4af37" : "#6b4e35",
                                                border: "1.5px solid",
                                                borderColor: i < 3 ? "#4a3525" : "#d4af37",
                                            }}
                                        >
                                            {i < 3 && "✓ "}{pref}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Account actions */}
                            <div className="rounded-2xl p-6" style={{ background: "white", boxShadow: "0 4px 24px rgba(139,107,74,0.1)" }}>
                                <h2 className="text-xl font-bold mb-4" style={{ color: "#4a3525" }}>Account Actions</h2>
                                <div className="flex flex-col gap-3">
                                    <button
                                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                                        style={{ background: "#f5ede0", color: "#6b4e35" }}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                                        style={{ background: "#e85d1a", color: "white" }}
                                    >
                                        Sign Out
                                    </button>
                                    <button
                                        className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                                        style={{ background: "#fff0f0", color: "#c0392b" }}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}