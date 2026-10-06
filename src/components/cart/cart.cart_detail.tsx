'use client'
import { useAppSelector } from "@/redux/hooks"
import formatter from './../../utils/formatter';
import { useState } from "react";
import { ICartItem, IOrderDetailBase, Total } from "@/interfaces";
import { Modal } from "../app";
import LoginModal from "../login/login.modal";
import SuccessModal from "../common/success_modal";
import { toast } from "react-toastify";
import { useSubmitOrder } from "@/hooks/redux_custom_hooks/cartSlice.hooks";
import { useRouter } from "next/navigation";

const convertItemToDetail = (item: ICartItem): IOrderDetailBase => {
    return {
        dishID: item.id,
        quantity: item.quantity,
        price: item.price
    }
}

const CartDetail = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [lastOrderTotal, setLastOrderTotal] = useState(0)
    const [lastOrderItemsCount, setLastOrderItemsCount] = useState(0)
    const taxNumber = 8.5;

    const auth = useAppSelector(state => state.auth)

    const cartList = useAppSelector(state => state.cart)
    const cart = cartList.currentCart.dishes

    const cartLength = cart.reduce((length, dish) => length += dish.checked ? 1 : 0, 0)

    const placeOrder = useSubmitOrder()
    const calculateTotal = (): Total => {
        const subtotal = cart.reduce((subtotal, dish) => subtotal += dish.checked ? dish.price * dish.quantity! : 0, 0)
        const tax = taxNumber * subtotal / 100
        const delivery = 0
        const total: Total = {
            subtotal: subtotal,
            tax: tax,
            delivery: delivery,
            total: subtotal + tax + delivery
        }
        return total
    }

    const filtered_dish = cart.filter(item => item.checked == true)
    const details = filtered_dish.map(convertItemToDetail)

    const onCheckout = async () => {
        if (auth.isAuthenticated && auth.user) {
            const currentTotal = calculateTotal().total
            const currentCount = filtered_dish.reduce((sum, item) => sum + item.quantity, 0)
            try {
                await placeOrder({
                    customerID: auth.user.id,
                    notes: "Đặt món trực tuyến",
                    details: details,
                    totalPrice: currentTotal,
                    subtotal: calculateTotal().subtotal,
                    delivery: calculateTotal().delivery,
                    tax: calculateTotal().tax
                })
                setLastOrderTotal(currentTotal)
                setLastOrderItemsCount(currentCount)
                setShowConfirmModal(false)
                setShowSuccessModal(true)
                toast.success("Đặt đơn hàng thành công!")
            } catch {
                toast.error("Đã xảy ra lỗi khi đặt đơn hàng. Vui lòng thử lại.")
            }
        } else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatter.currency(calculateTotal().subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{`Tax (${taxNumber}%)`}</span>
                    <span>{formatter.currency(calculateTotal().tax)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{formatter.currency(calculateTotal().delivery)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatter.currency(calculateTotal().total)}</span>
                </div>
                <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={cartLength === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white mt-4 py-3 rounded-lg font-semibold text-lg 
                disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                >
                    Place Order
                </button>
            </div>
            {showConfirmModal &&
                <Modal handleClick={() => setShowConfirmModal(false)}>
                    <div className="flex-1 items-center bg-white rounded-2xl p-6 shadow-xl max-w-lg">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm checkout</h3>
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to place this order?</p>
                        <div className="mb-4 rounded-xl border border-gray-200 p-3 max-h-48 overflow-y-auto">
                            {filtered_dish.map((item) => (
                                <div
                                    className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                                    key={item.id}>
                                    <div className="flex items-center gap-3">
                                        <img className="shrink-0 w-10 h-10 rounded-lg object-cover"
                                            src={item.imgUrl}
                                            alt={item.name} />
                                        <span className="font-medium text-gray-900">{item.name}</span>
                                    </div>
                                    <div className="font-semibold text-gray-700">x {item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-md font-bold text-right mb-6 text-gray-900">
                            Total: <span className="text-green-600">{formatter.currency(calculateTotal().total)}</span>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onCheckout}
                                className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-bold shadow-md transition-all"
                            >
                                Confirm Order
                            </button>
                        </div>
                    </div>
                </Modal>
            }

            {/* Order Success Popup Modal */}
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                type="ORDER"
                orderData={{
                    totalAmount: lastOrderTotal,
                    itemsCount: lastOrderItemsCount,
                }}
                onPrimaryAction={() => {
                    setShowSuccessModal(false)
                    router.push('/guest/order')
                }}
                onSecondaryAction={() => setShowSuccessModal(false)}
            />

            {isOpen && !auth.isAuthenticated &&
                <Modal handleClick={() => setIsOpen(false)}>
                    <LoginModal handleClose={() => setIsOpen(false)} />
                </Modal>
            }
        </>
    )
}

export default CartDetail
