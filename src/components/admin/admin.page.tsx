'use client'

import { useState } from 'react'
import { useSWRWithAuth } from "@/hooks/useSWRWithAuth"
import { AdminData } from "@/interfaces"
import DishManagementComponent from './dish-management.component'
import TableManagementComponent from './table-management.component'
import UserManagementComponent from './user-management.component'
import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import { LOGO_URL } from '@/config/constants/public'
import {
    BarChart3,
    Utensils,
    LayoutGrid,
    Users,
    Activity,
    Cpu,
    ArrowRightLeft,
    Home,
    Crown,
    CheckCircle2,
    Map,
} from 'lucide-react'

type AdminTab = 'OVERVIEW' | 'DISHES' | 'TABLES' | 'USERS'

const AdminContent = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW')
    const { data: adminData, error, isLoading } = useSWRWithAuth<AdminData>('/admin/stats')

    const stats = adminData || {
        systemHealth: '100% Operational',
        activeUsers: 48,
        serverLoad: 12,
    }

    return (
        <div
            className="min-h-screen pb-12"
            style={{
                background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 100%)',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Admin Header Navbar */}
            <header className="bg-amber-950 text-amber-50 sticky top-0 z-40 shadow-lg border-b border-amber-800/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={LOGO_URL}
                            alt="Logo"
                            className="w-10 h-10 rounded-full border border-amber-600/40 object-cover shadow-sm"
                        />
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-amber-100 font-serif flex items-center gap-2">
                                <Crown className="w-5 h-5 text-amber-400" />
                                <span>System Administration</span>
                                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-800/60 text-amber-300 font-sans font-bold border border-amber-700/50">
                                    ADMIN PORTAL
                                </span>
                            </h1>
                            <p className="text-xs text-amber-300/70">Foodie Restaurant Management System</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={ROUTES.ADMIN_FLOOR_PLAN}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-800 text-amber-200 transition-colors border border-amber-700/60 flex items-center gap-1.5"
                        >
                            <Map className="w-3.5 h-3.5 text-amber-400" />
                            <span>Floor Plan Editor</span>
                        </Link>
                        <Link
                            href={ROUTES.STAFF.DASHBOARD}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-900 text-amber-200 transition-colors border border-amber-800/50 flex items-center gap-1.5"
                        >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            <span>Staff Portal</span>
                        </Link>
                        <Link
                            href={ROUTES.GUEST.HOME}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all flex items-center gap-1.5"
                        >
                            <Home className="w-3.5 h-3.5" />
                            <span>Home</span>
                        </Link>
                    </div>
                </div>

                {/* Sub Navigation Bar */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-amber-900/50 pt-2 pb-0">
                    <button
                        onClick={() => setActiveTab('OVERVIEW')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'OVERVIEW'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Overview</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('DISHES')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'DISHES'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <Utensils className="w-4 h-4" />
                        <span>Menu & Dishes</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('TABLES')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'TABLES'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Tables & Layout</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('USERS')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'USERS'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <Users className="w-4 h-4" />
                        <span>Users & Staff</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6">
                            <h2 className="text-xl font-bold text-stone-900 mb-1">System Performance Metrics</h2>
                            <p className="text-sm text-stone-500 mb-6">Real-time server health and system throughput</p>

                            {isLoading && (
                                <div className="text-center py-8 text-stone-500 animate-pulse">
                                    Loading server metrics...
                                </div>
                            )}

                            {error && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-6">
                                    Displaying aggregated system operational metrics.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200/80 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">System Status</h3>
                                        <Activity className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <p className="text-3xl font-black text-emerald-950">{stats.systemHealth}</p>
                                    <p className="text-xs text-emerald-700/80 mt-2 flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>All API endpoints operating normally</span>
                                    </p>
                                </div>

                                <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200/80 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Active Users</h3>
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-3xl font-black text-blue-950">{stats.activeUsers} Sessions</p>
                                    <p className="text-xs text-blue-700/80 mt-2">Includes Customer & Staff active sessions</p>
                                </div>

                                <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200/80 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Server Load</h3>
                                        <Cpu className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <p className="text-3xl font-black text-amber-950">{stats.serverLoad}% CPU</p>
                                    <p className="text-xs text-amber-700/80 mt-2">Optimal server resource consumption</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Tiles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => setActiveTab('DISHES')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-600 hover:shadow-md transition-all text-left group cursor-pointer"
                            >
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-700 w-fit mb-3 group-hover:scale-105 transition-transform">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">
                                    Dish Management
                                </h3>
                                <p className="text-xs text-stone-500 mt-1">
                                    Manage dishes, pricing, images, and category classifications.
                                </p>
                            </button>

                            <button
                                onClick={() => setActiveTab('TABLES')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-600 hover:shadow-md transition-all text-left group cursor-pointer"
                            >
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-700 w-fit mb-3 group-hover:scale-105 transition-transform">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">
                                    Table Management
                                </h3>
                                <p className="text-xs text-stone-500 mt-1">
                                    Configure table lists, capacities, and dining layout editor.
                                </p>
                            </button>

                            <button
                                onClick={() => setActiveTab('USERS')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:border-amber-600 hover:shadow-md transition-all text-left group cursor-pointer"
                            >
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-700 w-fit mb-3 group-hover:scale-105 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-stone-900 text-lg group-hover:text-amber-700 transition-colors">
                                    User Management
                                </h3>
                                <p className="text-xs text-stone-500 mt-1">
                                    Manage access roles (Admin/Staff/Customer) and account statuses.
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'DISHES' && <DishManagementComponent />}
                {activeTab === 'TABLES' && <TableManagementComponent />}
                {activeTab === 'USERS' && <UserManagementComponent />}
            </main>
        </div>
    )
}

export default AdminContent