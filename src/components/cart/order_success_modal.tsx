'use client'

import React from 'react'
import { Modal } from '../app'
import { FiCheckCircle, FiTruck, FiShoppingBag, FiX } from 'react-icons/fi'
import formatter from '@/utils/formatter'

interface OrderSuccessModalProps {
    isOpen: boolean
    onClose: () => void
    totalAmount: number
    itemsCount: number
    onTrackOrder: () => void
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
    isOpen,
    onClose,
    totalAmount,
    itemsCount,
    onTrackOrder,
}) => {
    if (!isOpen) return null

    return (
        <Modal handleClick={onClose}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center relative border border-green-100 animate-scale-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <FiX className="w-5 h-5" />
                </button>

                <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-1 font-serif">
                    Đặt Đơn Thành Công!
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Cảm ơn quý khách đã đặt món tại Foodie Restaurant. Đơn hàng của bạn đã được gửi xuống nhà bếp.
                </p>

                <div className="bg-amber-50/60 rounded-xl p-4 mb-6 border border-amber-900/10 space-y-2 text-sm text-left">
                    <div className="flex items-center justify-between text-gray-700">
                        <span>Tổng số món:</span>
                        <span className="font-bold text-gray-900">{itemsCount} món</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-700 pt-1 border-t border-amber-900/10">
                        <span>Tổng thanh toán:</span>
                        <span className="font-extrabold text-green-600 text-base">
                            {formatter.currency(totalAmount)}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onTrackOrder}
                        className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <FiTruck className="w-4 h-4" />
                        Theo Dõi Tiến Độ Đơn Hàng
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <FiShoppingBag className="w-4 h-4" />
                        Tiếp Tục Gọi Món
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default OrderSuccessModal
