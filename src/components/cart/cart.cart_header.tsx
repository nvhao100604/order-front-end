import { useAppDispatch } from "@/redux/hooks"
import { closeCart } from "@/redux/slices/cartSlices"
import { FiX } from "react-icons/fi"

const CartHeader = () => {
    const dispatch = useAppDispatch()
    const handleCloseCart = () => {
        dispatch(closeCart())
    }
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button
                    onClick={handleCloseCart}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <FiX size={24} />
                </button>
            </div>
        </>
    )
}
export default CartHeader