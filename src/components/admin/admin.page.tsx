'use client'

import { useState } from 'react'
import { useSWRWithAuth } from "@/hooks/useSWRWithAuth"
import { useSystemHealth } from "@/hooks/useSystemHealth"
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
    Database,
    AlertTriangle,
    RefreshCw,
    X,
    Server,
    Clock,
    ShieldCheck,
} from 'lucide-react'

type AdminTab = 'OVERVIEW' | 'DISHES' | 'TABLES' | 'USERS'

const AdminContent = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW')
    const [showHealthModal, setShowHealthModal] = useState(false)
    const [isManualRefreshing, setIsManualRefreshing] = useState(false)

    // Admin aggregated stats
    const { data: adminData, error, isLoading } = useSWRWithAuth<AdminData>('/admin/stats')

    // Live System Health Check (GET /health or fallback /api/v1/health)
    const {
        health,
        isHealthy,
        isDbConnected,
        isLoading: isHealthLoading,
        isError: isHealthError,
        refreshHealth,
    } = useSystemHealth(15000)

    const stats = adminData || {
        systemHealth: isHealthy && isDbConnected ? 'Healthy' : 'Unhealthy',
        activeUsers: 48,
        serverLoad: 12,
    }

    const handleManualRefresh = async () => {
        setIsManualRefreshing(true)
        try {
            await refreshHealth()
        } finally {
            setTimeout(() => setIsManualRefreshing(false), 500)
        }
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
                        {/* Live Health Status Indicator */}
                        <button
                            onClick={() => setShowHealthModal(true)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900/80 hover:bg-amber-900 text-amber-200 transition-colors border border-amber-700/60 flex items-center gap-2 cursor-pointer shadow-xs"
                            title="Click to view real-time system diagnostics"
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${
                                    isHealthy && isDbConnected
                                        ? 'bg-emerald-400 animate-pulse'
                                        : isHealthError
                                        ? 'bg-red-400'
                                        : 'bg-amber-400'
                                }`}
                            />
                            <Activity className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">
                                {isHealthy && isDbConnected
                                    ? 'System: Healthy'
                                    : isHealthError
                                    ? 'System: Unhealthy'
                                    : 'Checking...'}
                            </span>
                        </button>

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
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
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
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
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
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
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
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
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
                        {/* System Status & Performance Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-stone-100 gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-stone-900 mb-0.5">System Performance & Infrastructure</h2>
                                    <p className="text-sm text-stone-500">Real-time health check, PostgreSQL connection status, and system throughput</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleManualRefresh}
                                        disabled={isHealthLoading || isManualRefreshing}
                                        className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                                    >
                                        <RefreshCw
                                            className={`w-3.5 h-3.5 text-stone-500 ${
                                                isHealthLoading || isManualRefreshing ? 'animate-spin' : ''
                                            }`}
                                        />
                                        <span>Refresh Status</span>
                                    </button>
                                    <button
                                        onClick={() => setShowHealthModal(true)}
                                        className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                                    >
                                        <Activity className="w-3.5 h-3.5" />
                                        <span>Diagnostic Modal</span>
                                    </button>
                                </div>
                            </div>

                            {/* Database Disconnection Alert (HTTP 503 Notice) */}
                            {(!isDbConnected || isHealthError) && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-sm flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <p className="font-bold">
                                            Database Service Unavailable (HTTP 503)
                                        </p>
                                        <p className="text-xs text-red-800 leading-relaxed">
                                            The backend server has reported a loss of connection to the database. Client operations requiring database transactions (such as placing orders, splitting tables, and saving layouts) are currently disabled.
                                        </p>
                                        {health?.database?.error && (
                                            <p className="text-xs font-mono bg-red-100/80 px-2 py-1 rounded text-red-900 mt-2">
                                                {health.database.error}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* API Status */}
                                <div
                                    className={`p-6 rounded-2xl border shadow-xs ${
                                        isHealthy
                                            ? 'bg-emerald-50/70 border-emerald-200/80'
                                            : 'bg-red-50/70 border-red-200/80'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3
                                            className={`text-xs font-bold uppercase tracking-wider ${
                                                isHealthy ? 'text-emerald-900' : 'text-red-900'
                                            }`}
                                        >
                                            API Server
                                        </h3>
                                        <Server
                                            className={`w-5 h-5 ${
                                                isHealthy ? 'text-emerald-600' : 'text-red-600'
                                            }`}
                                        />
                                    </div>
                                    <p
                                        className={`text-2xl font-black ${
                                            isHealthy ? 'text-emerald-950' : 'text-red-950'
                                        }`}
                                    >
                                        {isHealthLoading
                                            ? 'Checking...'
                                            : isHealthy
                                            ? 'Healthy'
                                            : 'Unhealthy'}
                                    </p>
                                    <p
                                        className={`text-xs mt-2 flex items-center gap-1.5 ${
                                            isHealthy ? 'text-emerald-700/80' : 'text-red-700/80'
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                isHealthy ? 'bg-emerald-500' : 'bg-red-500'
                                            }`}
                                        />
                                        <span>Env: {health?.environment || 'development'}</span>
                                    </p>
                                </div>

                                {/* Database Status */}
                                <div
                                    className={`p-6 rounded-2xl border shadow-xs ${
                                        isDbConnected
                                            ? 'bg-emerald-50/70 border-emerald-200/80'
                                            : 'bg-red-50/70 border-red-200/80'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3
                                            className={`text-xs font-bold uppercase tracking-wider ${
                                                isDbConnected ? 'text-emerald-900' : 'text-red-900'
                                            }`}
                                        >
                                            Database
                                        </h3>
                                        <Database
                                            className={`w-5 h-5 ${
                                                isDbConnected ? 'text-emerald-600' : 'text-red-600'
                                            }`}
                                        />
                                    </div>
                                    <p
                                        className={`text-2xl font-black ${
                                            isDbConnected ? 'text-emerald-950' : 'text-red-950'
                                        }`}
                                    >
                                        {isHealthLoading
                                            ? 'Checking...'
                                            : isDbConnected
                                            ? 'Connected'
                                            : 'Disconnected'}
                                    </p>
                                    <p
                                        className={`text-xs mt-2 flex items-center gap-1.5 ${
                                            isDbConnected ? 'text-emerald-700/80' : 'text-red-700/80'
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                                isDbConnected ? 'bg-emerald-500' : 'bg-red-500'
                                            }`}
                                        />
                                        <span>
                                            Latency:{' '}
                                            {health?.database?.latency_ms !== null &&
                                            health?.database?.latency_ms !== undefined
                                                ? `${health.database.latency_ms} ms`
                                                : 'N/A'}
                                        </span>
                                    </p>
                                </div>

                                {/* Active Users */}
                                <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200/80 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                                            Active Users
                                        </h3>
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-2xl font-black text-blue-950">
                                        {stats.activeUsers} Sessions
                                    </p>
                                    <p className="text-xs text-blue-700/80 mt-2">
                                        Customer & Staff sessions
                                    </p>
                                </div>

                                {/* Server Load */}
                                <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200/80 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                            Server Load
                                        </h3>
                                        <Cpu className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <p className="text-2xl font-black text-amber-950">
                                        {stats.serverLoad}% CPU
                                    </p>
                                    <p className="text-xs text-amber-700/80 mt-2">
                                        Normal resource consumption
                                    </p>
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
                                    Upload dish photos, edit descriptions, adjust pricing, and organize menu categories.
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
                                    Configure table capacities, shape templates, and launch the 2D floor plan editor.
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
                                    Manage access roles (Admin/Staff/Customer) and handle credentials.
                                </p>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'DISHES' && <DishManagementComponent />}
                {activeTab === 'TABLES' && <TableManagementComponent />}
                {activeTab === 'USERS' && <UserManagementComponent />}
            </main>

            {/* System Status & Diagnostic Modal */}
            {showHealthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-xl overflow-hidden font-sans">
                        {/* Header */}
                        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Activity className="w-5 h-5 text-amber-400" />
                                <div>
                                    <h3 className="font-bold text-base leading-tight">System Status & Diagnostics</h3>
                                    <p className="text-xs text-stone-400">Endpoint: GET /health</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowHealthModal(false)}
                                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                            {/* Status Overview Banner */}
                            <div
                                className={`p-4 rounded-xl border flex items-center justify-between ${
                                    isHealthy && isDbConnected
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                        : 'bg-red-50 border-red-200 text-red-950'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-3 h-3 rounded-full shrink-0 ${
                                            isHealthy && isDbConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                                        }`}
                                    />
                                    <div>
                                        <p className="font-bold text-sm">
                                            {isHealthy && isDbConnected
                                                ? 'All Systems Operational'
                                                : 'Degraded Performance / Outage'}
                                        </p>
                                        <p className="text-xs opacity-80">
                                            {isHealthy && isDbConnected
                                                ? 'Backend and PostgreSQL database connections are responsive.'
                                                : 'Database connection failed. HTTP 503 status active.'}
                                        </p>
                                    </div>
                                </div>
                                <ShieldCheck
                                    className={`w-6 h-6 shrink-0 ${
                                        isHealthy && isDbConnected ? 'text-emerald-600' : 'text-red-500'
                                    }`}
                                />
                            </div>

                            {/* Details List */}
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-500 flex items-center gap-1.5">
                                        <Server className="w-3.5 h-3.5 text-stone-400" /> Server Status
                                    </span>
                                    <span className={`font-bold ${isHealthy ? 'text-emerald-700' : 'text-red-600'}`}>
                                        {health?.status || (isHealthLoading ? 'Checking...' : 'Unknown')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-500 flex items-center gap-1.5">
                                        <Database className="w-3.5 h-3.5 text-stone-400" /> Database Connection
                                    </span>
                                    <span className={`font-bold ${isDbConnected ? 'text-emerald-700' : 'text-red-600'}`}>
                                        {health?.database?.status || (isHealthLoading ? 'Checking...' : 'Disconnected')}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-500 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-stone-400" /> Latency
                                    </span>
                                    <span className="font-semibold text-stone-800 tabular-nums">
                                        {health?.database?.latency_ms !== null && health?.database?.latency_ms !== undefined
                                            ? `${health.database.latency_ms} ms`
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-500">Environment</span>
                                    <span className="font-semibold text-stone-800 capitalize">
                                        {health?.environment || 'development'}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-stone-100">
                                    <span className="text-stone-500">Server Timestamp</span>
                                    <span className="font-semibold text-stone-800 tabular-nums">
                                        {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'N/A'}
                                    </span>
                                </div>
                                {health?.database?.error && (
                                    <div className="py-2">
                                        <span className="text-red-600 font-bold block mb-1">Database Error:</span>
                                        <code className="block bg-red-50 text-red-900 border border-red-200 p-2.5 rounded-lg font-mono text-[11px] break-all">
                                            {health.database.error}
                                        </code>
                                    </div>
                                )}
                            </div>

                            {/* Raw JSON Debug View */}
                            <div>
                                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                                    Raw Payload
                                </p>
                                <pre className="bg-stone-900 text-emerald-400 p-3 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
                                    {JSON.stringify(health || { status: 'loading' }, null, 2)}
                                </pre>
                            </div>

                            {/* Actions */}
                            <div className="pt-2 flex items-center justify-end gap-3">
                                <button
                                    onClick={handleManualRefresh}
                                    disabled={isHealthLoading || isManualRefreshing}
                                    className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    <RefreshCw
                                        className={`w-3.5 h-3.5 ${
                                            isHealthLoading || isManualRefreshing ? 'animate-spin' : ''
                                        }`}
                                    />
                                    <span>Check Status Again</span>
                                </button>
                                <button
                                    onClick={() => setShowHealthModal(false)}
                                    className="px-5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminContent
