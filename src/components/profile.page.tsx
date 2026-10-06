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
        if (!confirm('Are you sure you want to cancel this reservation?')) return
        try {
            await reservation_services.cancelReservation(id)
            toast.success('Reservation cancelled successfully!')
            mutateReservations()
        } catch {
            toast.error('Failed to cancel reservation. Please try again.')
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
            setStatusMsg({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err?.message || 'Failed to update profile.' })
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
        name: user?.name || 'Valued Customer',
        email: user?.email || 'No email provided',
        phone: user?.phoneNumber || 'No phone provided',
        address: user?.address || 'No address provided',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'foodie'}`,
        joinDate: user?.createdAt ? formatter.date(user.createdAt) : 'New Member',
        memberTier: 'VIP Gold Member',
        totalOrders: orderHistory.length,
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Personal Info', icon: <FiUser className="w-4 h-4" /> },
        { id: 'orders', label: 'Order History', icon: <FiShoppingBag className="w-4 h-4" /> },
        { id: 'reservations', label: 'Reservation History', icon: <FiCalendar className="w-4 h-4" /> },
        { id: 'settings', label: 'Account Settings', icon: <FiSettings className="w-4 h-4" /> },
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
                    className="rounded-3xl overflow-hidden relative shadow-2xl border"
                    style={{
                        background: 'linear-gradient(135deg, #1C120C 0%, #2A1C12 40%, #3D2B1F 100%)',
                        borderColor: 'rgba(212, 175, 55, 0.25)',
                        boxShadow: '0 25px 50px -12px rgba(28, 18, 12, 0.5), 0 0 30px rgba(212, 175, 55, 0.08)'
                    }}
                >
                    {/* Ambient Gold radial glow background */}
                    <div
                        className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(232, 93, 26, 0.3) 0%, transparent 70%)' }}
                    />

                    {/* Geometric Gold Lines Pattern Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.04] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='none' stroke='%23D4AF37' stroke-width='1.5'/%3E%3C/svg%3E")`,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="relative p-6 sm:p-10 md:p-12">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                            {/* Left: Avatar & Info */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                <div className="relative shrink-0">
                                    <div
                                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden p-1 shadow-2xl relative"
                                        style={{
                                            background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #8A651E 100%)',
                                            boxShadow: '0 0 25px rgba(212, 175, 55, 0.3)'
                                        }}
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden p-0.5 bg-[#1C120C]">
                                            <img
                                                src={profileUser.avatar}
                                                alt={profileUser.name}
                                                className="w-full h-full object-cover rounded-full bg-amber-50/10"
                                            />
                                        </div>
                                    </div>
                                    <div
                                        className="absolute -bottom-1 -right-1 p-2 rounded-full shadow-xl text-amber-950 font-bold flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #F3E5AB, #D4AF37)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                            border: '1.5px solid #FFF'
                                        }}
                                        title="VIP Gold Member"
                                    >
                                        <FiAward className="w-4 h-4 stroke-[2.5]" />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1
                                            className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight"
                                            style={{
                                                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5EDE0 60%, #E6C875 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                            }}
                                        >
                                            {profileUser.name}
                                        </h1>
                                        <span
                                            className="px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase flex items-center gap-1.5 shadow-md backdrop-blur-md"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(138,101,30,0.3) 100%)',
                                                border: '1px solid rgba(212, 175, 55, 0.4)',
                                                color: '#F3E5AB',
                                                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            <FiShield className="w-3 h-3 text-amber-300" />
                                            {profileUser.memberTier}
                                        </span>
                                    </div>

                                    <p className="text-xs text-amber-200/60 font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 inline-block" />
                                        Member since: <span className="text-amber-100 font-semibold">{profileUser.joinDate}</span>
                                    </p>

                                    {/* Stats Grid Pill Container */}
                                    <div className="pt-2 flex items-center gap-4 flex-wrap">
                                        <div
                                            className="px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-3"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.04)',
                                                borderColor: 'rgba(255, 255, 255, 0.08)'
                                            }}
                                        >
                                            <div>
                                                <p className="text-base font-extrabold text-amber-300 leading-none">
                                                    {profileUser.totalOrders}
                                                </p>
                                                <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mt-0.5">Total Orders</p>
                                            </div>
                                        </div>

                                        <div
                                            className="px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-3"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.04)',
                                                borderColor: 'rgba(255, 255, 255, 0.08)'
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                </span>
                                                <div>
                                                    <p className="text-xs font-extrabold text-emerald-400 leading-none">Active</p>
                                                    <p className="text-[10px] text-amber-200/60 uppercase font-bold tracking-wider mt-0.5">Account Status</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Upcoming Reservation Glass Card */}
                            <div
                                className="w-full lg:w-auto min-w-[280px] p-6 rounded-3xl border backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-amber-400/40"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
                                    borderColor: 'rgba(212, 175, 55, 0.3)',
                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.35)'
                                }}
                            >
                                {/* Glass shine overlay */}
                                <div
                                    className="absolute -top-12 -right-12 w-24 h-24 rounded-full pointer-events-none opacity-20"
                                    style={{ background: 'radial-gradient(circle, #FFFFFF 0%, transparent 80%)' }}
                                />

                                <div className="flex items-center justify-between gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3.5 border-b border-amber-500/20 pb-2.5">
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="w-4 h-4 text-amber-400" />
                                        <span>Upcoming Reservation</span>
                                    </div>
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                </div>

                                {upcomingReservation ? (
                                    <div className="space-y-2.5 text-sm text-amber-100">
                                        <p className="font-extrabold text-white text-lg tracking-tight">
                                            {formatter.date(upcomingReservation.reservationTime)}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-amber-200/80">
                                            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/5">
                                                <FiClock className="w-3.5 h-3.5 text-amber-400" />
                                                {formatter.time(upcomingReservation.reservationTime)}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/5">
                                                <FiUsers className="w-3.5 h-3.5 text-amber-400" />
                                                {upcomingReservation.numberOfGuests} Guests
                                            </span>
                                        </div>
                                        <div className="pt-2 flex items-center justify-between text-xs text-amber-300 font-semibold border-t border-white/5">
                                            <span>
                                                {upcomingReservation.tableID ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <FiMapPin className="w-3.5 h-3.5 text-amber-400" />
                                                        Table #{upcomingReservation.tableID}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1">
                                                        <FiClock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                                                        Assigning Table
                                                    </span>
                                                )}
                                            </span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                    upcomingReservation.status === 'CONFIRMED'
                                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                        : 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                                                }`}
                                            >
                                                {upcomingReservation.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <p className="text-xs text-amber-200/70 font-medium">
                                            You have no upcoming table reservations.
                                        </p>
                                        <Link
                                            href={ROUTES.GUEST.RESERVATION}
                                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl text-xs font-extrabold transition-all shadow-lg text-amber-950 hover:brightness-110 active:scale-95"
                                            style={{
                                                background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 100%)',
                                                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
                                            }}
                                        >
                                            <span>Book a Table</span>
                                            <FiArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
                                        Profile Information
                                    </h2>
                                    <p className="text-xs text-amber-900/60">
                                        Manage and update your personal contact details
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
                                        'Saving...'
                                    ) : editMode ? (
                                        <>
                                            <FiSave className="w-4 h-4" />
                                            <span>Save Changes</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiEdit3 className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <FiUser className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Full Name</span>
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
                                        <span>Email Address</span>
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
                                        <span>Phone Number</span>
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
                                        <span>Delivery Address</span>
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
                                    <span>Member Privileges</span>
                                </h3>
                                <ul className="space-y-3 text-xs font-medium text-amber-900/80">
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>10% discount on total bill for all dining reservations</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Priority seating in premium garden view area</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                                        <span>Complimentary birthday gifts & special dessert treats</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gradient-to-br from-amber-900 to-amber-950 rounded-3xl p-6 text-white shadow-lg space-y-3">
                                <h3 className="font-bold text-amber-200 text-base font-serif">
                                    Craving a Great Meal?
                                </h3>
                                <p className="text-xs text-amber-100/70">
                                    Explore Foodie Restaurant's exclusive menu and get your favorites delivered!
                                </p>
                                <Link
                                    href={ROUTES.GUEST.MENU}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Explore Menu</span>
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
                                    Order History
                                </h2>
                                <p className="text-xs text-amber-900/60">
                                    List of orders placed at the restaurant ({orderHistory.length} orders)
                                </p>
                            </div>
                        </div>

                        {orderHistory.length === 0 ? (
                            <div className="text-center py-16 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-900/10">
                                    <FiShoppingBag className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-semibold text-amber-950">
                                    You have no past orders yet.
                                </p>
                                <Link
                                    href={ROUTES.GUEST.MENU}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Order Food Now</span>
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
                                                            Order #{order.id}
                                                        </h4>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeStyle}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-amber-900/60">
                                                        Order Time: {formatter.date(order.createdAt)} -{' '}
                                                        {formatter.time(order.createdAt)}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-xs text-amber-900/60">Total Price</p>
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
                                                        title="View K80 Invoice"
                                                    >
                                                        <FiPrinter className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Invoice</span>
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
                                                        Order Items ({order.details?.length || 0} items):
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
                                                                                {detail.dish?.name || 'Dish'}
                                                                            </p>
                                                                            <p className="text-xs text-amber-900/60">
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
                                    Reservation History
                                </h2>
                                <p className="text-xs text-amber-900/60">
                                    List of table reservations at the restaurant ({allReservations.length} reservations)
                                </p>
                            </div>
                            <Link
                                href={ROUTES.GUEST.RESERVATION}
                                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                            >
                                <FiCalendar className="w-4 h-4" />
                                <span>New Reservation</span>
                            </Link>
                        </div>

                        {allReservations.length === 0 ? (
                            <div className="text-center py-16 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-900/10">
                                    <FiCalendar className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-semibold text-amber-950">
                                    You have no table reservations yet.
                                </p>
                                <Link
                                    href={ROUTES.GUEST.RESERVATION}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-md"
                                >
                                    <span>Book a Table Now</span>
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
                                                Time: <strong className="text-amber-950">{formatter.time(res.reservationTime)}</strong>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FiUsers className="w-3.5 h-3.5 text-amber-700" />
                                                Guests: <strong className="text-amber-950">{res.numberOfGuests} Guests</strong>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <FiMapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                                <span>Table:</span> <strong className="text-amber-950">{res.tableID ? `Table #${res.tableID}` : 'Assigning Table'}</strong>
                                            </p>
                                            {res.specialRequests && (
                                                <p className="pt-1 text-amber-900/60 italic">
                                                    Notes: &quot;{res.specialRequests}&quot;
                                                </p>
                                            )}
                                        </div>

                                        {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                                            <div className="pt-2 border-t border-amber-900/10 flex justify-end">
                                                <button
                                                    onClick={() => handleCancelReservation(res.id)}
                                                    className="px-4 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors"
                                                >
                                                    Cancel Reservation
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
                                Account & Security Settings
                            </h2>
                            <p className="text-xs text-amber-900/60">
                                Customize language, notification preferences, and account security
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-900/10">
                            <div>
                                <h4 className="font-bold text-amber-950 text-base">
                                    Advanced System Settings
                                </h4>
                                <p className="text-xs text-amber-900/60">
                                    Change password, configure SMS/Email notifications, and language options
                                </p>
                            </div>

                            <Link
                                href="/setting"
                                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                            >
                                <span>Open Settings</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}