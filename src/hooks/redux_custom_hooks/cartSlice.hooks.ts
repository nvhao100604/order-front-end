import { ICartItem, IOrderCreate, IOrderDetailBase } from "@/interfaces"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart, closeCart, controlCart, openCart, placeOrder, removeAll, removeFromCart, removeMultiDishes, selectAllDish, selectDish, unSelectAllDish, updateQuantity, updateTotal } from "@/redux/slices/cartSlices"

const useAddToCart = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = (dish: ICartItem) => {
        console.log(dish)
        dispatch(addToCart(dish))
        dispatch(updateTotal())
    }

    return handleAddToCart
}

const useUpdateQuantity = () => {
    const dispatch = useAppDispatch()
    const updateDishQuantity = (dish: ICartItem, change: number) => {
        dispatch(updateQuantity({ ...dish, quantity: (dish.quantity ?? 0) + change }))
        dispatch(updateTotal())
    }
    return updateDishQuantity
}

const useRemoveFromCart = () => {
    const dispatch = useAppDispatch()
    const removeDish = (dishToRemove: ICartItem) => dispatch(removeFromCart(dishToRemove))

    return removeDish
}

const useMultiRemove = () => {
    const dispatch = useAppDispatch()

    const multiRemove = () => {
        dispatch(removeMultiDishes())
        dispatch(updateTotal())
    }
    return multiRemove
}

const useRemoveAll = () => {
    const dispatch = useAppDispatch()
    const removeAllDish = () => dispatch(removeAll())
    return removeAllDish
}

const useSelectItem = () => {
    const dispatch = useAppDispatch()
    const toggleItemSelection = (dish: ICartItem) => dispatch(selectDish(dish))
    return toggleItemSelection
}

const useSelectAll = () => {
    const dispatch = useAppDispatch()
    const selectAllDishes = (isSelected: boolean) => {
        if (isSelected) {
            dispatch(selectAllDish())
        } else {
            dispatch(unSelectAllDish())
        }
        dispatch(updateTotal())
    }

    return selectAllDishes
}

const useOpenCart = () => {
    const dispatch = useAppDispatch()

    const openCartList = () => dispatch(openCart())
    return openCartList
}

const useCloseCart = () => {
    const dispatch = useAppDispatch()

    const closeCartList = () => dispatch(closeCart())
    return closeCartList
}

const useCartControl = () => {
    const dispatch = useAppDispatch()
    const handleControlCart = () => dispatch(controlCart())
    return handleControlCart
}

const useSubmitOrder = () => {
    const dispatch = useAppDispatch()
    const closeCartList = async (order: IOrderCreate) => {
        console.log(order)
        await dispatch(placeOrder(order))
        dispatch(removeAll())
        dispatch(closeCart())
    }
    return closeCartList
}

export {
    useAddToCart,
    useUpdateQuantity,
    useRemoveFromCart,
    useMultiRemove,
    useRemoveAll,
    useSelectItem,
    useSelectAll,
    useOpenCart,
    useCloseCart,
    useCartControl,
    useSubmitOrder
}