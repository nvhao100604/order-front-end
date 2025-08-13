import { useAppSelector } from "@/redux/hooks"
import { FiShoppingCart } from "react-icons/fi"

const AddToCart = ({ addToCart }: { addToCart: () => void }) => {
    const { isOpen } = useAppSelector(state => state.cart)
    return (
        <>
            <button className="flex items-center lg:px-2 md:py-3 sm:p-2 place-items-center
                text-sm text-cyan-100 rounded-xl bg-orange-500 hover:bg-orange-700"
                onClick={addToCart}
            >
                <FiShoppingCart />
                <span className="ml-2">{`Add ${isOpen ? "" : " to cart"}`}</span>
            </button>
        </>
    )
}

export default AddToCart