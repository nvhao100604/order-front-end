'use client'

import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import { IReservationResponse } from '@/interfaces'
import { formatter } from '@/utils'
import { FiAward, FiShield, FiCalendar, FiClock, FiUsers, FiMapPin, FiArrowRight } from 'react-icons/fi'

interface ProfileHeroProps {
    profileUser: {
        name: string
        avatar: string
        joinDate: string
        memberTier: string
        totalOrders: number
    }
    upcomingReservation?: IReservationResponse
}

export function ProfileHero({ profileUser, upcomingReservation }: ProfileHeroProps) {
    return (
        <div
            className="rounded-3xl bg-gradient-to-r from-[#171311] via-[#241E19] to-[#171311] border border-[#D4AF37]/50 text-stone-100 p-6 sm:p-10 relative overflow-hidden"
            style={{
                boxShadow: '0 0 35px rgba(212, 175, 55, 0.18), 0 10px 30px rgba(0, 0, 0, 0.4)',
            }}
        >
            {/* Top Glowing Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_12px_#D4AF37]" />

            {/* Ambient Gold Glow Corner Circle */}
            <div
                className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)' }}
            />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                {/* Left: Avatar & Identity with Gold/White Gradient Text */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative shrink-0">
                        <div
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-[#251F1A] border border-[#D4AF37]/60 shadow-lg relative"
                            style={{ boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)' }}
                        >
                            <img
                                src={profileUser.avatar}
                                alt={profileUser.name}
                                className="w-full h-full object-cover rounded-full bg-stone-900"
                            />
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#2E241A] border border-[#D4AF37] text-[#F5E6C8] flex items-center justify-center"
                            style={{ boxShadow: '0 0 12px rgba(212, 175, 55, 0.4)' }}
                            title="VIP Member"
                        >
                            <FiAward className="w-4 h-4 stroke-[2.5] text-[#F3E5AB]" />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1
                                className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                                style={{
                                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8E8C9 50%, #D4AF37 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                {profileUser.name}
                            </h1>
                            <span
                                className="px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#2E241A] text-[#F5E6C8] border border-[#D4AF37]/70 flex items-center gap-1.5"
                                style={{ boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)' }}
                            >
                                <FiShield className="w-3 h-3 text-[#D4AF37]" />
                                {profileUser.memberTier}
                            </span>
                        </div>

                        <p className="text-xs text-stone-300 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block shadow-[0_0_8px_#D4AF37]" />
                            Member since: <span className="text-stone-100 font-semibold">{profileUser.joinDate}</span>
                        </p>

                        {/* Stats Info */}
                        <div className="pt-2 flex items-center gap-3 flex-wrap">
                            <div className="px-3.5 py-1.5 rounded-xl bg-[#2A221C] border border-[#D4AF37]/30 flex items-center gap-2">
                                <span className="text-xs text-stone-400 font-medium">Total Orders:</span>
                                <span className="text-sm font-extrabold text-[#F5E6C8]">{profileUser.totalOrders}</span>
                            </div>

                            <div className="px-3.5 py-1.5 rounded-xl bg-[#2A221C] border border-[#D4AF37]/30 flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-emerald-400">Active Status</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Glowing Dark Glass Upcoming Reservation Card */}
                <div
                    className="w-full lg:w-auto min-w-[280px] p-5 rounded-2xl bg-[#251F1A]/90 border border-[#D4AF37]/40 shadow-xl text-stone-200 backdrop-blur-md relative"
                    style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.12)' }}
                >
                    <div className="flex items-center justify-between gap-2 text-[#F5E6C8] text-xs font-bold uppercase tracking-wider mb-3 border-b border-[#D4AF37]/20 pb-2">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-[#D4AF37]" />
                            <span>Upcoming Reservation</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_8px_#D4AF37]" />
                    </div>

                    {upcomingReservation ? (
                        <div className="space-y-2.5 text-xs text-stone-300">
                            <p className="font-extrabold text-white text-base tracking-tight">
                                {formatter.date(upcomingReservation.reservationTime)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-stone-300">
                                <span className="flex items-center gap-1.5 bg-[#1A1512] px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                                    <FiClock className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    {formatter.time(upcomingReservation.reservationTime)}
                                </span>
                                <span className="flex items-center gap-1.5 bg-[#1A1512] px-2.5 py-1 rounded-lg border border-[#D4AF37]/20">
                                    <FiUsers className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    {upcomingReservation.numberOfGuests} Guests
                                </span>
                            </div>
                            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#D4AF37]/20">
                                <span className="text-stone-400">
                                    {upcomingReservation.tableID ? (
                                        <span className="inline-flex items-center gap-1 text-stone-100 font-medium">
                                            <FiMapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                                            Table #{upcomingReservation.tableID}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-stone-400">
                                            Assigning Table...
                                        </span>
                                    )}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                        upcomingReservation.status === 'CONFIRMED'
                                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                            : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                                    }`}
                                >
                                    {upcomingReservation.status}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-stone-400 font-medium">
                                No active table reservations scheduled.
                            </p>
                            <Link
                                href={ROUTES.GUEST.RESERVATION}
                                className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs font-bold transition-all text-[#1F1A17] shadow-md hover:brightness-110"
                                style={{ background: 'linear-gradient(135deg, #F8E8C9 0%, #D4AF37 100%)' }}
                            >
                                <span>Book a Table</span>
                                <FiArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
