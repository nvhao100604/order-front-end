'use client'

import { useAppSelector } from "@/redux/hooks"
import { useAuth } from '@/hooks'
import { formatter } from "@/utils"

const DashboardContent = () => {
    const { user, logout } = useAuth()
    const { tables, orders } = useAppSelector((state) => state.staff)

    // Derived stats from Redux state
    const totalRevenue = orders
        .filter((o) => o.status === "COMPLETED")
        .reduce((s, o) => s + o.totalPrice, 0)
    const todayOrders = orders.length
    const pendingOrders = orders.filter((o) => o.status === "PENDING").length
    const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length
    // const availableTables = tables.filter((t) => t.status === "AVAILABLE").length
    const reservedTables = tables.filter((t) => t.status === "RESERVED").length

    // Top dishes derived from order items
    const dishCountMap: Record<string, number> = {}
    orders.forEach((o) => {
        // o.details?.forEach((item: { name: string; quantity: number }) => {
        //     dishCountMap[item.name] = (dishCountMap[item.name] ?? 0) + item.quantity
        // })
    })
    const topDishes = Object.entries(dishCountMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))

    const stats = [
        {
            label: "Total Orders",
            value: todayOrders.toLocaleString(),
            sub: `${pendingOrders} pending`,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                    <rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
                </svg>
            ),
            color: '#2d7a2d', bg: '#f0faf0',
        },
        {
            label: "Tables In Use",
            value: `${occupiedTables}/${tables.length}`,
            // sub: `${availableTables} available`,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                </svg>
            ),
            color: '#c0622a', bg: '#fef3e2',
        },
        {
            label: "Revenue",
            value: formatter.format(totalRevenue),
            sub: "from completed orders",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            color: '#8b6b4a', bg: '#fdf6ec',
        },
        {
            label: "Pending",
            value: pendingOrders,
            sub: `${orders.filter(o => o.status === 'PREPARING').length} preparing`,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            color: '#6b4e35', bg: '#faf6f0',
        },
    ]

    return (
        <div
            className="min-h-screen"
            style={{
                // background: 'linear-gradient(135deg, #faf6f0 0%, #f5ede0 40%, #ede0cc 100%)',
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            }}
        >
            <div className="fixed inset-0 pointer-events-none opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
            }} />

            <div className="max-w-6xl mx-auto relative">
                <div className="mb-7">
                    <h2 className="text-2xl font-bold" style={{ color: '#4a3525' }}>
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]} 👋
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#a08060' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
                    {stats.map((s) => (
                        <div key={s.label} className="rounded-2xl p-5" style={{ background: 'white', boxShadow: '0 4px 24px rgba(139,107,74,0.1)' }}>
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-semibold" style={{ color: '#a08060' }}>{s.label.toUpperCase()}</p>
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                                    {s.icon}
                                </div>
                            </div>
                            <p className="text-2xl font-bold mb-1" style={{ color: '#4a3525' }}>{s.value}</p>
                            <p className="text-xs" style={{ color: '#b09070' }}>{s.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* User profile */}
                    <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 4px 24px rgba(139,107,74,0.1)' }}>
                        <h3 className="text-sm font-bold mb-4" style={{ color: '#4a3525' }}>YOUR ACCOUNT</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8b6b4a, #6b4e35)' }}>
                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-sm" style={{ color: '#4a3525' }}>{user?.name}</p>
                                <p className="text-xs" style={{ color: '#a08060' }}>{user?.email}</p>
                            </div>
                        </div>
                        {[{ label: 'User ID', value: `#${user?.id}` }, { label: 'Role', value: `Role ${user?.roleID}` }].map(row => (
                            <div key={row.label} className="flex justify-between py-2" style={{ borderTop: '1px solid #f5ede0' }}>
                                <span className="text-xs" style={{ color: '#a08060' }}>{row.label}</span>
                                <span className="text-xs font-semibold" style={{ color: '#4a3525' }}>{row.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Table status */}
                    <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 4px 24px rgba(139,107,74,0.1)' }}>
                        <h3 className="text-sm font-bold mb-4" style={{ color: '#4a3525' }}>TABLE STATUS</h3>
                        <div className="space-y-2">
                            {[
                                // { label: 'Available', value: availableTables, color: '#2d7a2d', bg: '#f0faf0' },
                                { label: 'Occupied', value: occupiedTables, color: '#c0622a', bg: '#fef3e2' },
                                { label: 'Reserved', value: reservedTables, color: '#6b4e35', bg: '#faf6f0' },
                            ].map(t => (
                                <div key={t.label} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: t.bg }}>
                                    <span className="text-sm font-medium" style={{ color: t.color }}>{t.label}</span>
                                    <span className="text-sm font-bold" style={{ color: t.color }}>{t.value} tables</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #f5ede0' }}>
                            <p className="text-xs text-center" style={{ color: '#b09070' }}>Total: {tables.length} tables</p>
                        </div>
                    </div>

                    {/* Top dishes */}
                    <div className="rounded-2xl p-6" style={{ background: 'white', boxShadow: '0 4px 24px rgba(139,107,74,0.1)' }}>
                        <h3 className="text-sm font-bold mb-4" style={{ color: '#4a3525' }}>TOP DISHES TODAY</h3>
                        {topDishes.length === 0 ? (
                            <p className="text-sm text-center py-4" style={{ color: '#b09070' }}>No orders yet</p>
                        ) : (
                            <div className="space-y-3">
                                {topDishes.map((dish, i) => (
                                    <div key={dish.name} className="flex items-center gap-3">
                                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={{ background: i === 0 ? '#fdefc3' : '#f5ede0', color: i === 0 ? '#8a6200' : '#6b4e35' }}>
                                            {i + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium" style={{ color: '#4a3525' }}>{dish.name}</p>
                                            <div className="h-1.5 rounded-full mt-1" style={{ background: '#f5ede0' }}>
                                                <div className="h-full rounded-full" style={{
                                                    width: `${Math.round((dish.count / (topDishes[0]?.count ?? 1)) * 100)}%`,
                                                    background: i === 0 ? '#e85d1a' : '#c0622a',
                                                }} />
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold" style={{ color: '#a08060' }}>{dish.count}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardContent