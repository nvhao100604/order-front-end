'use client'

import React from 'react'
import { Modal } from '../app'
import { FiCheckCircle, FiTruck, FiShoppingBag, FiCalendar, FiHome, FiX, FiUsers, FiClock } from 'react-icons/fi'
import formatter from '@/utils/formatter'

export type SuccessModalType = 'ORDER' | 'RESERVATION'

export interface OrderSuccessData {
    totalAmount: number
    itemsCount: number
}

export interface ReservationSuccessData {
    fullName: string
    date: string
    time: string
    numberOfGuests: number
    tableID?: number | null
}

interface SuccessModalProps {
    isOpen: boolean
    onClose: () => void
    type: SuccessModalType
    orderData?: OrderSuccessData
    reservationData?: ReservationSuccessData
    onPrimaryAction: () => void
    onSecondaryAction: () => void
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    type,
    orderData,
    reservationData,
    onPrimaryAction,
    onSecondaryAction,
}) => {
    if (!isOpen) return null

    const isOrder = type === 'ORDER'

    return (
        <Modal handleClick={onClose}>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative border border-amber-900/10 animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <FiX className="w-5 h-5" />
                </button>

                {/* Icon Badge */}
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <h3 className="text-2xl font-bold text-amber-950 mb-1 font-serif">
                    {isOrder ? 'Đặt Đơn Thành Công!' : 'Đặt Bàn Thành Công!'}
                </h3>

                <p className="text-xs text-amber-900/60 mb-6 px-2 leading-relaxed">
                    {isOrder
                        ? 'Cảm ơn quý khách đã chọn món tại Foodie Restaurant. Đơn hàng của bạn đã được chuyển tới nhà bếp!'
                        : 'Cảm ơn quý khách đã giữ chỗ trước tại Foodie Restaurant. Chúng tôi rất hân hạnh được phục vụ bạn!'}
                </p>

                {/* Order Info Card */}
                {isOrder && orderData && (
                    <div className="bg-amber-50/60 rounded-2xl p-4 mb-6 border border-amber-900/10 space-y-2 text-xs text-left">
                        <div className="flex items-center justify-between text-amber-900">
                            <span>Tổng số món đã đặt:</span>
                            <span className="font-bold text-amber-950">{orderData.itemsCount} món</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-900 pt-2 border-t border-amber-900/10">
                            <span>Tổng thanh toán:</span>
                            <span className="font-black text-emerald-600 text-base">
                                {formatter.currency(orderData.totalAmount)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Reservation Info Card */}
                {!isOrder && reservationData && (
                    <div className="bg-amber-50/60 rounded-2xl p-4 mb-6 border border-amber-900/10 space-y-2 text-xs text-left">
                        <div className="flex items-center justify-between text-amber-900">
                            <span>Khách hàng:</span>
                            <span className="font-bold text-amber-950">{reservationData.fullName}</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-900">
                            <span>Thời gian giữ chỗ:</span>
                            <span className="font-bold text-amber-950 flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5 text-amber-700" />
                                {reservationData.time} - {reservationData.date}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-amber-900 pt-2 border-t border-amber-900/10">
                            <span>Số lượng khách:</span>
                            <span className="font-bold text-amber-950 flex items-center gap-1">
                                <FiUsers className="w-3.5 h-3.5 text-amber-700" />
                                {reservationData.numberOfGuests} Người
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onPrimaryAction}
                        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        {isOrder ? (
                            <>
                                <FiTruck className="w-4 h-4" />
                                <span>Theo Dõi Đơn Hàng</span>
                            </>
                        ) : (
                            <>
                                <FiCalendar className="w-4 h-4" />
                                <span>Xem Lịch Sử Đặt Bàn</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={onSecondaryAction}
                        className="w-full py-2.5 rounded-xl border border-amber-900/20 text-amber-900 hover:bg-amber-50 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                    >
                        {isOrder ? (
                            <>
                                <FiShoppingBag className="w-4 h-4" />
                                <span>Tiếp Tục Gọi Món</span>
                            </>
                        ) : (
                            <>
                                <FiHome className="w-4 h-4" />
                                <span>Quay Về Trang Chủ</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default SuccessModal
