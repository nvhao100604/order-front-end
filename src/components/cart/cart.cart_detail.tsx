'use client'
import { useAppSelector } from "@/redux/hooks"
import formatter from './../../utils/formatter';
import { useSubmitOrder } from "@/hooks";
import { useState } from "react";
import { ICartItem, IOrderDetailBase, Total } from "@/interfaces";
import { Modal } from "../app";

const convertItemToDetail = (item: ICartItem): IOrderDetailBase => {
    return {
        dishID: item.id,
        quantity: item.quantity,
        price: item.price
    }
}

const CartDetail = () => {
    // const [order, setOrder] = useState<IOrder>(tempOrder)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const taxNumber = 8.5;
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

    const onCheckout = () => placeOrder({
        staffID: 1,
        customerID: 1,
        notes: "tình cha",
        details: details,
        totalPrice: calculateTotal()
    })

    return (
        <>
            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatter.format(calculateTotal().subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span>{`Tax (${taxNumber}%)`}</span>
                    <span>{formatter.format(calculateTotal().tax)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span>{formatter.format(calculateTotal().delivery)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>{formatter.format(calculateTotal().total)}</span>
                </div>
                <button
                    onClick={() => setShowConfirmModal(true)}
                    disabled={cartLength === 0}
                    className="w-full bg-green-500 hover:bg-green-600 text-white mt-4 py-3 rounded-lg font-semibold text-lg 
                disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Place Order
                </button>
            </div>
            {showConfirmModal &&
                <Modal handleClick={() => setShowConfirmModal(false)}>
                    <div className="flex-1 items-center bg-white rounded-2xl p-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm checkout</h3>
                        <p className="mb-6">Are you sure you want to place this order?</p>
                        <div className="mb-4 rounded-b-md border-2 border-t-0 p-2">
                            {filtered_dish.map((item) => (
                                <div
                                    className="flex place-content-stretch items-center justify-between text-md mx-12 my-2"
                                    key={item.id}>
                                    <div className="flex items-center gap-4">
                                        <img className="shrink-0 w-12 h-12 rounded-sm object-cover"
                                            src={item.imgUrl}
                                            alt={item.name} />
                                        <h3>{item.name}</h3>
                                    </div>
                                    <div className="font-medium">x {item.quantity}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-md font-bold place-items-end mb-4 text-end">
                            Total: {formatter.format(calculateTotal().total)}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onCheckout}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
}

export default CartDetail