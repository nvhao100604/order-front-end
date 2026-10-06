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
        <div className="rounded-3xl bg-[#1F1A17] border border-[#332A24] text-stone-100 p-6 sm:p-10 relative overflow-hidden shadow-xl">
            {/* Subtle warm accent line top edge */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C4823F]/40 to-transparent" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                {/* Left: Avatar & Personal Identity */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-[#2A231E] border border-[#3D322B] shadow-inner">
                            <img
                                src={profileUser.avatar}
                                alt={profileUser.name}
                                className="w-full h-full object-cover rounded-full bg-stone-800"
                            />
                        </div>
                        <div
                            className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#2E2520] border border-[#C4823F]/50 text-[#E8D4B0] shadow-md flex items-center justify-center"
                            title="VIP Member"
                        >
                            <FiAward className="w-4 h-4 stroke-[2]" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                {profileUser.name}
                            </h1>
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#2E2520] text-[#E4C590] border border-[#C4823F]/30 flex items-center gap-1.5">
                                <FiShield className="w-3 h-3 text-[#C4823F]" />
                                {profileUser.memberTier}
                            </span>
                        </div>

                        <p className="text-xs text-stone-400 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C4823F] inline-block" />
                            Member since: <span className="text-stone-200">{profileUser.joinDate}</span>
                        </p>

                        {/* Stats Info */}
                        <div className="pt-2 flex items-center gap-3 flex-wrap">
                            <div className="px-3.5 py-1.5 rounded-xl bg-[#2A231E] border border-[#382E27] flex items-center gap-2">
                                <span className="text-xs text-stone-400 font-medium">Orders:</span>
                                <span className="text-sm font-bold text-[#E4C590]">{profileUser.totalOrders}</span>
                            </div>

                            <div className="px-3.5 py-1.5 rounded-xl bg-[#2A231E] border border-[#382E27] flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-emerald-400">Active Status</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Upcoming Reservation Card */}
                <div className="w-full lg:w-auto min-w-[280px] p-5 rounded-2xl bg-[#2A231E]/90 border border-[#3D322B] shadow-md text-stone-200">
                    <div className="flex items-center justify-between gap-2 text-[#E4C590] text-xs font-semibold uppercase tracking-wider mb-3 border-b border-[#382E27] pb-2">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4 text-[#C4823F]" />
                            <span>Upcoming Reservation</span>
                        </div>
                        <span className="w-2 h-2 rounded-full bg-[#C4823F] animate-pulse" />
                    </div>

                    {upcomingReservation ? (
                        <div className="space-y-2.5 text-xs text-stone-300">
                            <p className="font-bold text-white text-base tracking-tight">
                                {formatter.date(upcomingReservation.reservationTime)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-stone-300">
                                <span className="flex items-center gap-1.5 bg-[#1F1A17] px-2.5 py-1 rounded-lg border border-[#332A24]">
                                    <FiClock className="w-3.5 h-3.5 text-[#C4823F]" />
                                    {formatter.time(upcomingReservation.reservationTime)}
                                </span>
                                <span className="flex items-center gap-1.5 bg-[#1F1A17] px-2.5 py-1 rounded-lg border border-[#332A24]">
                                    <FiUsers className="w-3.5 h-3.5 text-[#C4823F]" />
                                    {upcomingReservation.numberOfGuests} Guests
                                </span>
                            </div>
                            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#382E27]">
                                <span className="text-stone-400">
                                    {upcomingReservation.tableID ? (
                                        <span className="inline-flex items-center gap-1 text-stone-200">
                                            <FiMapPin className="w-3.5 h-3.5 text-[#C4823F]" />
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
                                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
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
                                className="inline-flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl text-xs font-semibold transition-all bg-[#C4823F] hover:bg-[#B27333] text-white shadow-sm"
                            >
                                <span>Book a Table</span>
                                <FiArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
