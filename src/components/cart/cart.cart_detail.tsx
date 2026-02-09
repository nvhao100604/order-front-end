'use client'
import { useAppSelector } from "@/redux/hooks"
import formatter from './../../utils/formatter';
import { useSubmitOrder } from "@/hooks";
import { useState } from "react";
import { ICartItem, IOrder, IOrderCreate, IOrderDetailBase, tempOrder, Total } from "@/interfaces";

const convertItemToDetail = (item: ICartItem): IOrderDetailBase => {
    return {
        dishID: item.id,
        quantity: item.quantity,
        price: item.price
    }
}

const CartDetail = () => {
    // const [order, setOrder] = useState<IOrder>(tempOrder)
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
                onClick={onCheckout}
                disabled={cartLength === 0}
                className="w-full bg-green-500 hover:bg-green-600 text-white mt-4 py-3 rounded-lg font-semibold text-lg 
                disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Place Order
            </button>
        </div>
    )
}

export default CartDetail