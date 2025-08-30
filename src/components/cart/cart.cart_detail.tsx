import { IDish } from "@/interfaces"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import formatter from './../../utils/formatter';
interface Total {
    subtotal: number,
    tax: number,
    delivery: number,
    total: number
}

const CartDetail = () => {
    const taxNumber = 8.5;
    const cartList = useAppSelector(state => state.cart)
    const cart = cartList.currentCart.dishes
    const cartLength = cart.reduce((length, dish) => length += dish.checked ? 1 : 0, 0)
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
    const onCheckout = () => {

    }
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