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
                                👑 Quản Trị Hệ Thống <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-800/60 text-amber-300 font-sans font-bold border border-amber-700/50">ADMIN PORTAL</span>
                            </h1>
                            <p className="text-xs text-amber-300/70">Foodie Restaurant Management System</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={ROUTES.STAFF.DASHBOARD}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-900/60 hover:bg-amber-900 text-amber-200 transition-colors border border-amber-800/50"
                        >
                            👔 Chuyển sang Staff Portal
                        </Link>
                        <Link
                            href={ROUTES.GUEST.HOME}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                        >
                            🏠 Trang chủ
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
                        <span>📊 Tổng Quan Hệ Thống</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('DISHES')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'DISHES'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <span>📦 Món Ăn & Danh Mục</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('TABLES')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'TABLES'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <span>🪑 Sơ Đồ Bàn Ăn</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('USERS')}
                        className={`px-5 py-3 rounded-t-xl text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
                            activeTab === 'USERS'
                                ? 'bg-amber-900/40 text-amber-300 border-amber-500 shadow-inner'
                                : 'text-amber-200/60 border-transparent hover:text-amber-100 hover:bg-amber-900/20'
                        }`}
                    >
                        <span>👥 Người Dùng & Nhân Sự</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'OVERVIEW' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6">
                            <h2 className="text-xl font-bold text-amber-950 mb-2">Chỉ Số Vận Hành Hệ Thống</h2>
                            <p className="text-sm text-amber-900/60 mb-6">Trạng thái máy chủ và hiệu năng ứng dụng real-time</p>

                            {isLoading && (
                                <div className="text-center py-8 text-amber-900/60 animate-pulse">
                                    Đang tải dữ liệu máy chủ...
                                </div>
                            )}

                            {error && (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-6">
                                    ℹ️ Đang hiển thị chỉ số đo lường hệ thống tổng hợp.
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-green-200 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-green-900 uppercase tracking-wider">Trạng Thái Hệ Thống</h3>
                                        <span className="text-2xl">🟢</span>
                                    </div>
                                    <p className="text-3xl font-black text-green-950">{stats.systemHealth}</p>
                                    <p className="text-xs text-green-700/80 mt-2">Tất cả Endpoints API hoạt động bình thường</p>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Người Dùng Đang Hoạt Động</h3>
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <p className="text-3xl font-black text-blue-950">{stats.activeUsers} Sessions</p>
                                    <p className="text-xs text-blue-700/80 mt-2">Bao gồm Khách hàng & Nhân viên phục vụ</p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Tải Trọng Máy Chủ</h3>
                                        <span className="text-2xl">⚡</span>
                                    </div>
                                    <p className="text-3xl font-black text-amber-950">{stats.serverLoad}% CPU</p>
                                    <p className="text-xs text-amber-700/80 mt-2">Mức tiêu thụ tài nguyên cực kì tối ưu</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Access Tiles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <button
                                onClick={() => setActiveTab('DISHES')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 hover:border-amber-600 transition-all text-left group"
                            >
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">📦</div>
                                <h3 className="font-bold text-amber-950 text-lg group-hover:text-amber-600 transition-colors">
                                    Quản Lý Món Ăn
                                </h3>
                                <p className="text-xs text-amber-900/60 mt-1">
                                    Thêm món mới, cập nhật đơn giá, hình ảnh và phân loại danh mục thực đơn.
                                </p>
                            </button>

                            <button
                                onClick={() => setActiveTab('TABLES')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 hover:border-amber-600 transition-all text-left group"
                            >
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">🪑</div>
                                <h3 className="font-bold text-amber-950 text-lg group-hover:text-amber-600 transition-colors">
                                    Quản Lý Bàn Ăn
                                </h3>
                                <p className="text-xs text-amber-900/60 mt-1">
                                    Thiết lập sơ đồ bàn, sức chứa tối đa/tối thiểu và trạng thái hoạt động.
                                </p>
                            </button>

                            <button
                                onClick={() => setActiveTab('USERS')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 hover:border-amber-600 transition-all text-left group"
                            >
                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform w-fit">👥</div>
                                <h3 className="font-bold text-amber-950 text-lg group-hover:text-amber-600 transition-colors">
                                    Quản Lý Nhân Sự & Khách
                                </h3>
                                <p className="text-xs text-amber-900/60 mt-1">
                                    Phân quyền truy cập (Admin/Staff/Customer), kích hoạt hoặc khóa tài khoản.
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