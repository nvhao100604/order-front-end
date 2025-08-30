import { IDish } from "@/interfaces"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart, updateTotal } from "@/redux/slices/cartSlices"

const useAddToCart = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = (dish: IDish) => {
        console.log(dish)
        dispatch(addToCart(dish))
        dispatch(updateTotal())
    }

    return handleAddToCart
}

export { useAddToCart }