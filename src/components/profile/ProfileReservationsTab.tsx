'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import { IReservationResponse } from '@/interfaces'
import { formatter } from '@/utils'
import {
    FiCalendar,
    FiClock,
    FiUsers,
    FiMapPin,
    FiChevronLeft,
    FiChevronRight,
    FiArrowRight,
} from 'react-icons/fi'

interface ProfileReservationsTabProps {
    allReservations: IReservationResponse[]
    handleCancelReservation: (id: number) => void
}

const ITEMS_PER_PAGE = 6

const getReservationStatusAccent = (status?: string) => {
    switch (status?.toUpperCase()) {
        case 'CONFIRMED':
            return 'border-l-emerald-500 bg-emerald-50/20'
        case 'CANCELLED':
        case 'REJECTED':
            return 'border-l-rose-500 bg-rose-50/20'
        case 'PENDING':
        default:
            return 'border-l-amber-500 bg-amber-50/20'
    }
}

function ReservationItemCard({
    res,
    onCancelReservation,
}: {
    res: IReservationResponse
    onCancelReservation: (id: number) => void
}) {
    const accentStyle = getReservationStatusAccent(res.status)

    return (
        <div className={`p-5 rounded-xl border border-[#EBE6DD] border-l-4 ${accentStyle} hover:bg-[#F7F5F0]/60 transition-all space-y-4 shadow-xs`}>
            <div className="flex items-center justify-between border-b border-[#EBE6DD] pb-3">
                <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-[#C4823F]" />
                    <span className="font-bold text-stone-900 text-base">
                        {formatter.date(res.reservationTime)}
                    </span>
                </div>
                <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        res.status === 'CONFIRMED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : res.status === 'CANCELLED'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                >
                    {res.status}
                </span>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
                <p className="flex items-center gap-2">
                    <FiClock className="w-3.5 h-3.5 text-stone-400" />
                    Time: <strong className="text-stone-900">{formatter.time(res.reservationTime)}</strong>
                </p>
                <p className="flex items-center gap-2">
                    <FiUsers className="w-3.5 h-3.5 text-stone-400" />
                    Guests: <strong className="text-stone-900">{res.numberOfGuests} Guests</strong>
                </p>
                <p className="flex items-center gap-2">
                    <FiMapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>Table:</span> <strong className="text-stone-900">{res.tableID ? `Table #${res.tableID}` : 'Assigning Table'}</strong>
                </p>
                {res.specialRequests && (
                    <p className="pt-1 text-stone-500 italic">
                        Notes: &quot;{res.specialRequests}&quot;
                    </p>
                )}
            </div>

            {(res.status === 'PENDING' || res.status === 'CONFIRMED') && (
                <div className="pt-2 border-t border-[#EBE6DD] flex justify-end">
                    <button
                        onClick={() => onCancelReservation(res.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                    >
                        Cancel Reservation
                    </button>
                </div>
            )}
        </div>
    )
}

export function ProfileReservationsTab({
    allReservations,
    handleCancelReservation,
}: ProfileReservationsTabProps) {
    const [currentPage, setCurrentPage] = useState<number>(1)

    const totalReservations = allReservations.length
    const totalPages = Math.ceil(totalReservations / ITEMS_PER_PAGE) || 1

    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalReservations)
    const currentReservations = allReservations.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DD] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4">
                <div>
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                        Reservation History
                    </h2>
                    <p className="text-xs text-stone-500 font-normal mt-0.5">
                        History of table bookings ({totalReservations} total)
                    </p>
                </div>
                <Link
                    href={ROUTES.GUEST.RESERVATION}
                    className="px-4 py-2 rounded-xl bg-[#C4823F] hover:bg-[#B27333] text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
                >
                    <FiCalendar className="w-4 h-4" />
                    <span>New Reservation</span>
                </Link>
            </div>

            {totalReservations === 0 ? (
                <div className="text-center py-16 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#F7F5F0] text-stone-500 flex items-center justify-center mx-auto border border-[#EBE6DD]">
                        <FiCalendar className="w-6 h-6 text-stone-400" />
                    </div>
                    <p className="text-sm font-semibold text-stone-800">
                        No table reservations found.
                    </p>
                    <Link
                        href={ROUTES.GUEST.RESERVATION}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F1A17] hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                        <span>Book a Table Now</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentReservations.map((res: IReservationResponse) => (
                            <ReservationItemCard
                                key={res.id}
                                res={res}
                                onCancelReservation={handleCancelReservation}
                            />
                        ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-stone-500 font-medium">
                                Showing <span className="font-bold text-stone-800">{startIndex + 1}</span>–
                                <span className="font-bold text-stone-800">{endIndex}</span> of{' '}
                                <span className="font-bold text-stone-800">{totalReservations}</span> reservations
                            </p>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handlePageChange(safeCurrentPage - 1)}
                                    disabled={safeCurrentPage === 1}
                                    className="p-2 rounded-xl border border-[#E2DDD5] bg-white text-stone-700 hover:bg-[#F7F5F0] disabled:opacity-40 disabled:hover:bg-white transition-all text-xs font-semibold flex items-center gap-1"
                                >
                                    <FiChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">Prev</span>
                                </button>

                                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                                            safeCurrentPage === page
                                                ? 'bg-[#1F1A17] text-white shadow-xs'
                                                : 'bg-white border border-[#E2DDD5] text-stone-700 hover:bg-[#F7F5F0]'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(safeCurrentPage + 1)}
                                    disabled={safeCurrentPage === totalPages}
                                    className="p-2 rounded-xl border border-[#E2DDD5] bg-white text-stone-700 hover:bg-[#F7F5F0] disabled:opacity-40 disabled:hover:bg-white transition-all text-xs font-semibold flex items-center gap-1"
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
