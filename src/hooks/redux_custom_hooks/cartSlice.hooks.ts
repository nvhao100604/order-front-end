import { IDish } from "@/interfaces"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart, closeCart, controlCart, openCart, removeAll, removeFromCart, removeMultiDishes, selectAllDish, selectDish, unSelectAllDish, updateQuantity, updateTotal } from "@/redux/slices/cartSlices"

const useAddToCart = () => {
    const dispatch = useAppDispatch()

    const handleAddToCart = (dish: IDish) => {
        console.log(dish)
        dispatch(addToCart(dish))
        dispatch(updateTotal())
    }

    return handleAddToCart
}

const useUpdateQuantity = () => {
    const dispatch = useAppDispatch()
    const updateDishQuantity = (dish: IDish, change: number) => {
        dispatch(updateQuantity({ ...dish, quantity: (dish.quantity ?? 0) + change }))
        dispatch(updateTotal())
    }
    return updateDishQuantity
}

const useRemoveFromCart = () => {
    const dispatch = useAppDispatch()
    const removeDish = (dishToRemove: IDish) => dispatch(removeFromCart(dishToRemove))

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
    const toggleItemSelection = (dish: IDish) => dispatch(selectDish(dish))
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
    useCartControl
}