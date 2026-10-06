'use client'

import { useState, useEffect } from 'react'
import { defaultQuery, IOrderDetailResponse, OrderStatusKey, IReservationResponse } from '@/interfaces'
import { formatter } from '@/utils'
import { Header } from './app'
import { statusStyle } from '@/app/staff/manage/manage.component'
import { useGetReservations } from '@/hooks/useReservation'
import { useGetOrders } from '@/hooks/useOrder'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'
import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiClock,
    FiUsers,
    FiShoppingBag,
    FiPrinter,
    FiAward,
    FiSettings,
    FiEdit3,
    FiSave,
    FiCheckCircle,
    FiArrowRight,
    FiShield,
    FiChevronDown,
    FiChevronUp,
} from 'react-icons/fi'

import { reservation_services } from '@/services/reservation.services'
import { toast } from 'react-toastify'

type Tab = 'overview' | 'orders' | 'reservations' | 'settings'

const getStatusStyle = (status: OrderStatusKey) => {
    return statusStyle[status] ?? statusStyle.PENDING
}

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<Tab>('overview')
    const [editMode, setEditMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

    const { user, updateProfile } = useEnhancedAuth()

    const { data: reservationRes, mutate: mutateReservations } = useGetReservations(user?.email ? { email: user.email } : undefined)
    const allReservations = (reservationRes?.data as IReservationResponse[] | undefined) || []
    const upcomingReservation = allReservations.find(
        (r: IReservationResponse) => r.status === 'PENDING' || r.status === 'CONFIRMED'
    )

    const handleCancelReservation = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn hủy lượt đặt bàn này?')) return
        try {
            await reservation_services.cancelReservation(id)
            toast.success('Hủy lượt đặt bàn thành công!')
            mutateReservations()
        } catch {
            toast.error('Không thể hủy lượt đặt bàn. Vui lòng thử lại.')
        }
    }

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
                address: user.address || '',
            })
        }
    }, [user])

    const handleSaveProfile = async () => {
        if (!editMode) {
            setEditMode(true)
            return
        }

        setIsSaving(true)
        setStatusMsg(null)
        try {
            await updateProfile({
                name: form.name,
                email: form.email,
                phoneNumber: form.phone,
                address: form.address,
            })
            setEditMode(false)
            setStatusMsg({ type: 'success', text: 'Cập nhật hồ sơ cá nhân thành công!' })
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err?.message || 'Không thể cập nhật hồ sơ.' })
        } finally {
            setIsSaving(false)
        }
    }

    const { data: ordersData } = useGetOrders(
        {
            ...defaultQuery,
            customerID: user?.id,
        },
        { revalidateOnMount: true }
    )

    const orderHistory = ordersData?.data || []

    const profileUser = {
        name: user?.name || 'Khách hàng thân thiết',
        email: user?.email || 'Chưa cung cấp email',
        phone: user?.phoneNumber || 'Chưa cung cấp SĐT',
        address: user?.address || 'Chưa cập nhật địa chỉ',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'foodie'}`,
        joinDate: user?.createdAt ? formatter.date(user.createdAt) : 'Thành viên mới',
        memberTier: 'Thành Viên VIP Gold',
        totalOrders: orderHistory.length,
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Thông tin cá nhân', icon: <FiUser className="w-4 h-4" /> },
        { id: 'orders', label: 'Lịch sử đơn hàng', icon: <FiShoppingBag className="w-4 h-4" /> },
        { id: 'reservations', label: 'Lịch sử đặt bàn', icon: <FiCalendar className="w-4 h-4" /> },
        { id: 'settings', label: 'Cài đặt tài khoản', icon: <FiSettings className="w-4 h-4" /> },
    ]


    return (
        <div
            className="min-h-screen pb-16"
            style={{
                background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 50%, #EDE0CC 100%)',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {/* Background Texture */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main Navigation Header */}
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
                {/* Profile Hero Section */}
                <div
                    className="rounded-3xl overflow-hidden relative shadow-2xl border border-amber-900/10"
                    style={{
                        background: 'linear-gradient(135deg, #3D2B1F 0%, #5C4033 50%, #8B6B4A 100%)',
                    }}
                >
                    {/* Subtle Gold Pattern */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212,175,55,0.4) 20px, rgba(212,175,55,0.4) 21px)',
                        }}
                    />

                    <div className="relative p-6 sm:p-10 md:p-12">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            {/* Left: Avatar & Info */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-amber-900/40 p-1 shadow-2xl"
                                        style={{ border: '3px solid #D4AF37' }}
                                    >
                                        <img
                                            src={profileUser.avatar}
                                            alt={profileUser.name}
                                            className="w-full h-full object-cover rounded-full bg-amber-50"
                                        />
                                    </div>
                                    <div
                                        className="absolute -bottom-1 -right-1 p-2 rounded-full shadow-lg text-amber-950 font-bold"
                                        style={{ background: '#D4AF37' }}
                                        title="VIP Gold Member"
                                    >
                                        <FiAward className="w-4 h-4 stroke-[3]" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-50 font-serif tracking-tight">
                                            {profileUser.name}
                                        </h1>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1 shadow-sm"
                                            style={{ background: '#D4AF37', color: '#3D2B1F' }}
                                        >
                                            <FiShield className="w-3 h-3" />
                                            {profileUser.memberTier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-amber-200/70 font-medium">
                                        Thành viên từ: {profileUser.joinDate}
                                    </p>
                                    <div className="pt-2 flex items-center gap-6">
                                        <div>
                                            <p className="text-xl font-bold text-amber-300">
                                                {profileUser.totalOrders}
                                            </p>
                                            <p className="text-xs text-amber-200/60">Tổng đơn hàng</p>
                                        </div>
                                        <div className="h-8 w-px bg-amber-700/50" />
                                        <div>
                                            <p className="text-xl font-bold text-emerald-400">Đang hoạt động</p>
                                            <p className="text-xs text-amber-200/60">Trạng thái tài khoản</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upcoming Reservation Badge Card */}
                            <div
                                className="w-full lg:w-auto min-w-[260px] p-5 rounded-2xl border backdrop-blur-md shadow-lg"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: 'rgba(212, 175, 55, 0.3)',
                                }}
                            >
                                <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                                    <FiCalendar className="w-4 h-4 text-amber-400" />
                                    <span>Lượt Đặt Bàn Gần Nhất</span>
                                </div>

                                {upcomingReservation ? (
                                    <div className="space-y-1.5 text-sm text-amber-100">
                                        <p className="font-bold text-white text-base">
                                            {formatter.date(upcomingReservation.reservationTime)}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-amber-200/80">
                                            <span className="flex items-center gap-1">
                                                <FiClock className="w-3.5 h-3.5" />
                                                {formatter.time(upcomingReservation.reservationTime)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiUsers className="w-3.5 h-3.5" />
                                                {upcomingReservation.numberOfGuests} Khách
                                            </span>
                                        </div>
                                        <div className="pt-1 text-xs text-amber-300 font-semibold">
                                            {upcomingReservation.tableID
                                                ? `📍 Bàn số ${upcomingReservation.tableID}`
                                                : '⌛ Đang xếp bàn'}
                                            <span className="ml-2 px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 text-[10px] uppercase">
                                                {upcomingReservation.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-xs text-amber-200/70">
                                            Bạn chưa có lượt đặt bàn giữ chỗ nào sắp tới.
                                        </p>
                                        <Link
                                            href={ROUTES.GUEST.RESERVATION}
                                            className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                        >
                                            <span>Đặt Bàn Ngay</span>
                                            <FiArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Navigation Tabs */}
                <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/70 border border-amber-900/10 shadow-sm backdrop-blur-md">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                activeTab === tab.id
                                    ? 'bg-amber-900 text-amber-100 shadow-md scale-[1.01]'
                                    : 'text-amber-900/70 hover:bg-amber-100/50 hover:text-amber-950'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* TAB 1: OVERVIEW & PERSONAL INFO */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left 2 Cols: Editable Form */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
                            {statusMsg && (
                                <div
                                    className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                                        statusMsg.type === 'success'
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                                >
                                    <FiCheckCircle className="w-4 h-4 shrink-0" />
                                    <span>{statusMsg.text}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-amber-950 font-serif">
                                        Thông Tin Hồ Sơ
                                    </h2>
                                    <p className="text-xs text-amber-900/60">
                                        Quản lý và cập nhật thông tin liên hệ của bạn
                                    </p>
                                </div>

                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                                        editMode
                                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                                            : 'bg-amber-100/80 text-amber-900 hover:bg-amber-200 border border-amber-900/10'
                                    }`}
                                >
                                    {isSaving ? (
                                        'Đang lưu...'
                                    ) : editMode ? (
                                        <>
                                            <FiSave className="w-4 h-4" />
                                            <span>Lưu Thay Đổi</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiEdit3 className="w-4 h-4" />
                                            <span>Chỉnh Sửa</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FiUser className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Họ và Tên</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-amber-50/50"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-amber-950 px-4 py-3 bg-amber-50/50 rounded-xl border border-amber-900/10">
                                            {profileUser.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FiMail className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Địa Chỉ Email</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-amber-50/50"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-amber-950 px-4 py-3 bg-amber-50/50 rounded-xl border border-amber-900/10">
                                            {profileUser.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FiPhone className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Số Điện Thoại</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-amber-50/50"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-amber-950 px-4 py-3 bg-amber-50/50 rounded-xl border border-amber-900/10">
                                            {profileUser.phone}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FiMapPin className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Địa Chỉ Giao Hàng</span>
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-amber-50/50"
                                        />
                                    ) : (
                                        <p className="text-sm font-semibold text-amber-950 px-4 py-3 bg-amber-50/50 rounded-xl border border-amber-900/10 truncate">
                                            {profileUser.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right 1 Col: VIP Benefits & Quick Shortcuts */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-900/10 space-y-4">
                                <h3 className="font-bold text-amber-950 text-base font-serif flex items-center gap-2 border-b border-amber-900/10 pb-3">
                                    <FiAward className="w-5 h-5 text-amber-600" />
                                    <span>Đặc Quyền Hội Viên</span>
                                </h3>
                                <ul className="space-y-3 text-xs font-medium text-amber-900/80">
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Giảm 10% tổng hóa đơn cho mọi lượt đặt bàn</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Ưu tiên giữ bàn đẹp khu vực sân vườn</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Tặng quà sinh nhật & tráng miệng đặc biệt</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-3xl p-6 text-white shadow-lg space-y-3">
                                <h3 className="font-bold text-amber-200 text-base font-serif">
                                    Bạn muốn trải nghiệm ẩm thực?
                                </h3>
                                <p className="text-xs text-amber-100/70">
                                    Khám phá thực đơn độc quyền của Foodie Restaurant và đặt món giao tận nơi!
                                </p>
                                <Link
                                    href={ROUTES.GUEST.MENU}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Xem Thực Đơn</span>
                                    <FiArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: ORDER HISTORY */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
                        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-amber-950 font-serif">
                                    Lịch Sử Đơn Hàng
                                </h2>
                                <p className="text-xs text-amber-900/60">
                                    Danh sách các đơn hàng đã đặt tại nhà hàng ({orderHistory.length} đơn)
                                </p>
                            </div>
                        </div>

                        {orderHistory.length === 0 ? (
                            <div className="text-center py-16 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-900/10">
                                    <FiShoppingBag className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-semibold text-amber-950">
                                    Bạn chưa có đơn hàng nào.
                                </p>
                                <Link
                                    href={ROUTES.GUEST.MENU}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Đặt món ngay</span>
                                    <FiArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orderHistory.map((order) => {
                                    const isExpanded = expandedOrderId === order.id
                                    const statusBadgeStyle = getStatusStyle(order.status as OrderStatusKey)

                                    return (
                                        <div
                                            key={order.id}
                                            className="rounded-2xl border border-amber-900/10 overflow-hidden transition-all hover:border-amber-600/30"
                                        >
                                            <div
                                                onClick={() =>
                                                    setExpandedOrderId(isExpanded ? null : order.id)
                                                }
                                                className="p-5 bg-amber-50/30 hover:bg-amber-50/60 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-extrabold text-amber-950 text-base">
                                                            Đơn hàng #{order.id}
                                                        </h4>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeStyle}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-amber-900/60">
                                                        Thời gian đặt: {formatter.date(order.createdAt)} -{' '}
                                                        {formatter.time(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xs text-amber-900/60">Tổng tiền</p>
                                                        <p className="font-extrabold text-amber-900 text-base">
                                                            {order.totalPrice
                                                                ? formatter.currency(order.totalPrice)
                                                                : '0 đ'}
                                                        </p>
                                                    </div>

                                                    <Link
                                                        href={`/staff/invoice?orderId=${order.id}`}
                                                        target="_blank"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2.5 rounded-xl bg-white border border-amber-900/20 text-amber-900 hover:bg-amber-100 transition-colors text-xs font-bold flex items-center gap-1"
                                                        title="Xem Hóa Đơn K80"
                                                    >
                                                        <FiPrinter className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Hóa đơn</span>
                                                    </Link>

                                                    <div className="text-amber-800">
                                                        {isExpanded ? (
                                                            <FiChevronUp className="w-5 h-5" />
                                                        ) : (
                                                            <FiChevronDown className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Drawer */}
                                            {isExpanded && (
                                                <div className="p-5 bg-white border-t border-amber-900/10 space-y-3">
                                                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                                        Chi Tiết Món Ăn ({order.details?.length || 0} món):
                                                    </h5>
                                                    <div className="space-y-2">
                                                        {order.details?.map(
                                                            (detail: IOrderDetailResponse) => (
                                                                <div
                                                                    key={detail.id}
                                                                    className="flex items-center justify-between text-sm py-2 border-b border-amber-900/5 last:border-0"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            src={
                                                                                detail.dish?.imgUrl ||
                                                                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                                                                            }
                                                                            alt={detail.dish?.name}
                                                                            className="w-10 h-10 rounded-lg object-cover border border-amber-900/10"
                                                                        />
                                                                        <div>
                                                                            <p className="font-bold text-amber-950">
                                                                                {detail.dish?.name || 'Món ăn'}
                                                                            </p>                                                                            <p className="text-xs text-amber-900/60">
                                                                                {detail.price?.toLocaleString('vi-VN')} đ
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-bold text-amber-900">
                                                                        x{detail.quantity}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: RESERVATION HISTORY */}
                {activeTab === 'reservations' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
                        <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-amber-950 font-serif">
                                    Lịch Sử Đặt Bàn Giữ Chỗ
                                </h2>
                                <p className="text-xs text-amber-900/60">
                                    Danh sách lượt đặt giữ chỗ tại nhà hàng ({allReservations.length} lượt)
                                </p>
                            </div>
                            <Link
                                href={ROUTES.GUEST.RESERVATION}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                            >
                                <FiCalendar className="w-4 h-4" />
                                <span>Đặt Bàn Mới</span>
                            </Link>
                        </div>

                        {allReservations.length === 0 ? (
                            <div className="text-center py-16 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-900/10">
                                    <FiCalendar className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-semibold text-amber-950">
                                    Bạn chưa có lượt đặt bàn nào.
                                </p>
                                <Link
                                    href={ROUTES.GUEST.RESERVATION}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Đặt bàn giữ chỗ ngay</span>
                                    <FiArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allReservations.map((res: IReservationResponse) => (
                                    <div
                                        key={res.id}
                                        className="p-6 rounded-2xl border border-amber-900/10 bg-amber-50/30 hover:bg-amber-50/60 transition-all space-y-4 shadow-xs"
                                    >
                                        <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-4 h-4 text-amber-700" />
                                                <span className="font-extrabold text-amber-950 text-base">
                                                    {formatter.date(res.reservationTime)}
                                                </span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                                    res.status === 'CONFIRMED'
                                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                                        : res.status === 'CANCELLED'
                                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                                                }`}
                                            >
                                                {res.status}
                                            </span>
                                        </div>

                                        <div className="space-y-2 text-xs text-amber-900/80">
                                            <p className="flex items-center gap-2">
                                                <FiClock className="w-3.5 h-3.5 text-amber-700" />
                                                Giờ hẹn: <strong className="text-amber-950">{formatter.time(res.reservationTime)}</strong>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FiUsers className="w-3.5 h-3.5 text-amber-700" />
                                                Số lượng: <strong className="text-amber-950">{res.numberOfGuests} Khách</strong>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                📍 Sơ đồ bàn: <strong className="text-amber-950">{res.tableID ? `Bàn số ${res.tableID}` : 'Đang sắp xếp bàn'}</strong>
                                            </p>
                                            {res.specialRequests && (
                                                <p className="pt-1 text-amber-900/60 italic">
                                                    Ghi chú: &quot;{res.specialRequests}&quot;
                                                </p>
                                            )}
                                        </div>

                                        {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                            <div className="pt-2 border-t border-amber-900/10 flex justify-end">
                                                <button
                                                    onClick={() => handleCancelReservation(res.id)}
                                                    className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
                                                >
                                                    Hủy Đặt Bàn
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: SETTINGS SHORTCUT */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-amber-900/10 space-y-6">
                        <div className="border-b border-amber-900/10 pb-4">
                            <h2 className="text-xl font-bold text-amber-950 font-serif">
                                Cài Đặt & Bảo Mật Tài Khoản
                            </h2>
                            <p className="text-xs text-amber-900/60">
                                Tùy chỉnh ngôn ngữ, nhận thông báo và đổi mật khẩu đăng nhập
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-900/10">
                            <div>
                                <h4 className="font-bold text-amber-950 text-base">
                                    Trang Cài Đặt Hệ Thống Chuyên Sâu
                                </h4>
                                <p className="text-xs text-amber-900/60">
                                    Đổi mật khẩu, cài đặt thông báo SMS/Email và tùy chọn ngôn ngữ
                                </p>
                            </div>

                            <Link
                                href="/setting"
                                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <span>Mở Trang Cài Đặt</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}