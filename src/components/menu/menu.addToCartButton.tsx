import { useAppSelector } from "@/redux/hooks"
import { FiShoppingCart } from "react-icons/fi"

const AddToCart = ({ addToCart }: { addToCart: () => void }) => {
    const { isOpen } = useAppSelector(state => state.cart)

    return (
        <button
            onClick={addToCart}
            // Đã xóa justify-items-center thừa thãi, căn chỉnh lại padding cho cân đối hơn
            className="group flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2.5
            bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 
            text-white text-sm md:text-base font-bold rounded-xl shadow-md hover:shadow-lg 
            transition-all duration-300 active:scale-95 transform"
        >
            <FiShoppingCart className="text-lg md:text-xl group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span className="md:hidden">Add</span>
            {!isOpen && (
                <span className="hidden md:block whitespace-nowrap">
                    Add to Cart
                </span>
            )}
        </button>
    )
}

export default AddToCart