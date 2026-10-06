'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import { IOrderResponse, IOrderDetailResponse, OrderStatusKey } from '@/interfaces'
import { formatter } from '@/utils'
import { statusStyle } from '@/app/staff/manage/manage.component'
import {
    FiShoppingBag,
    FiChevronDown,
    FiChevronUp,
    FiChevronLeft,
    FiChevronRight,
    FiArrowRight,
    FiBox,
} from 'react-icons/fi'

interface ProfileOrdersTabProps {
    orderHistory: IOrderResponse[]
}

const ITEMS_PER_PAGE = 5

const getStatusStyle = (status: OrderStatusKey) => {
    return statusStyle[status] ?? statusStyle.PENDING
}

const getStatusAccentBorder = (status?: string) => {
    switch (status?.toUpperCase()) {
        case 'COMPLETED':
        case 'SERVED':
        case 'PAID':
            return 'border-l-emerald-500'
        case 'PENDING':
        case 'WAITING':
            return 'border-l-amber-500'
        case 'PREPARING':
        case 'PROCESSING':
        case 'COOKING':
            return 'border-l-blue-500'
        case 'CANCELLED':
        case 'REJECTED':
            return 'border-l-rose-500'
        default:
            return 'border-l-amber-500'
    }
}

function OrderItemCard({
    order,
    isExpanded,
    onToggleExpand,
}: {
    order: IOrderResponse
    isExpanded: boolean
    onToggleExpand: (orderId: number) => void
}) {
    const statusBadgeStyle = getStatusStyle(order.status as OrderStatusKey)
    const accentBorder = getStatusAccentBorder(order.status)
    const itemCount = order.details?.length || 0
    const firstDishName = order.details?.[0]?.dish?.name

    return (
        <div
            className={`rounded-xl border border-[#EBE6DD] border-l-4 ${accentBorder} overflow-hidden transition-all hover:border-[#C4823F]/40 shadow-xs hover:shadow-sm`}
        >
            <div
                onClick={() => onToggleExpand(order.id)}
                className="p-4 sm:p-5 bg-[#F7F5F0]/40 hover:bg-[#F7F5F0]/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
                <div className="space-y-1.5">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-bold text-stone-900 text-base">
                            Order #{order.id}
                        </h4>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadgeStyle}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-500 flex-wrap">
                        <span>
                            {formatter.date(order.createdAt)} at {formatter.time(order.createdAt)}
                        </span>
                        {itemCount > 0 && (
                            <>
                                <span className="text-stone-300">•</span>
                                <span className="flex items-center gap-1 text-stone-600 font-medium">
                                    <FiBox className="w-3.5 h-3.5 text-stone-400" />
                                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                                    {firstDishName && (
                                        <span className="text-stone-400 font-normal">
                                            ({firstDishName}
                                            {itemCount > 1 ? ` +${itemCount - 1} more` : ''})
                                        </span>
                                    )}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-left sm:text-right">
                        <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
                            Total Amount
                        </p>
                        <p className="font-bold text-[#C4823F] text-lg leading-tight">
                            {order.totalPrice ? formatter.currency(order.totalPrice) : '0 đ'}
                        </p>
                    </div>

                    <div className="p-2 rounded-xl bg-[#EFECE6] text-stone-600 group-hover:text-stone-900 transition-colors">
                        {isExpanded ? (
                            <FiChevronUp className="w-5 h-5 text-stone-700" />
                        ) : (
                            <FiChevronDown className="w-5 h-5 text-stone-700" />
                        )}
                    </div>
                </div>
            </div>

            {/* Details Drawer */}
            {isExpanded && (
                <div className="p-5 bg-white border-t border-[#EBE6DD] space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        <span>Ordered Dishes ({itemCount})</span>
                        <span>Subtotal</span>
                    </div>
                    <div className="space-y-2.5">
                        {order.details?.map((detail: IOrderDetailResponse) => (
                            <div
                                key={detail.id}
                                className="flex items-center justify-between text-sm py-2 border-b border-stone-100 last:border-0"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={
                                            detail.dish?.imgUrl ||
                                            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                                        }
                                        alt={detail.dish?.name || 'Dish'}
                                        className="w-11 h-11 rounded-xl object-cover border border-stone-200"
                                    />
                                    <div>
                                        <p className="font-semibold text-stone-900">
                                            {detail.dish?.name || 'Dish'}
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            {detail.price?.toLocaleString('vi-VN')} đ × {detail.quantity}
                                        </p>
                                    </div>
                                </div>
                                <span className="font-bold text-stone-900">
                                    {((detail.price || 0) * (detail.quantity || 1)).toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export function ProfileOrdersTab({ orderHistory }: ProfileOrdersTabProps) {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)

    const totalOrders = orderHistory.length
    const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE) || 1

    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalOrders)
    const currentOrders = orderHistory.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            setExpandedOrderId(null)
        }
    }

    const handleToggleExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId)
    }

    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DD] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4">
                <div>
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                        Order History
                    </h2>
                    <p className="text-xs text-stone-500 font-normal mt-0.5">
                        Showing past dining and takeaway orders ({totalOrders} total)
                    </p>
                </div>
            </div>

            {totalOrders === 0 ? (
                <div className="text-center py-16 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#F7F5F0] text-stone-500 flex items-center justify-center mx-auto border border-[#EBE6DD]">
                        <FiShoppingBag className="w-6 h-6 text-stone-400" />
                    </div>
                    <p className="text-sm font-semibold text-stone-800">
                        No past orders found.
                    </p>
                    <Link
                        href={ROUTES.GUEST.MENU}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1F1A17] hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm"
                    >
                        <span>Explore Menu</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-4">
                        {currentOrders.map((order) => (
                            <OrderItemCard
                                key={order.id}
                                order={order}
                                isExpanded={expandedOrderId === order.id}
                                onToggleExpand={handleToggleExpand}
                            />
                        ))}
                    </div>

                    {/* Pagination Bar */}
                    {totalPages > 1 && (
                        <div className="pt-4 border-t border-[#F0ECE1] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-stone-500 font-medium">
                                Showing <span className="font-bold text-stone-800">{startIndex + 1}</span>–
                                <span className="font-bold text-stone-800">{endIndex}</span> of{' '}
                                <span className="font-bold text-stone-800">{totalOrders}</span> orders
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
