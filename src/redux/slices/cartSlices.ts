import { ICart, ICartState, IDish, tempDish } from '@/interfaces'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


const initialCart: ICart = {
    dishes: [],
    totalPrice: 0
}
const initialState: ICartState = {
    currentCart: initialCart,
    isOpen: false,
    isLoading: false,
    error: ""
}
const isExistedDish = (state: ICartState, checkingDish: IDish) => {
    const existedDish = state.currentCart.dishes.find(dish => dish.id === checkingDish.id)
    return existedDish
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state: ICartState, action: PayloadAction<IDish>) => {
            const newDish = action.payload
            const existedDish = isExistedDish(state, newDish)
            if (existedDish) {
                existedDish.quantity = (existedDish.quantity ?? 0) + 1
            } else {
                newDish.quantity = 1
                state.currentCart.dishes.push(newDish)
            }
        },
        removeFromCart: (state: ICartState, action: PayloadAction<IDish>) => {
            const removeDish = action.payload
            const existedDish = isExistedDish(state, removeDish)
            if (existedDish) {
                state.currentCart.dishes = state.currentCart.dishes.filter(dish => dish.id !== removeDish.id)
            } else {
                console.log("Dish not exist")
            }
        },
        updateQuantity: (state: ICartState, action: PayloadAction<IDish>) => {
            const updatingDish = action.payload
            const existedDish = isExistedDish(state, updatingDish)
            if (existedDish) {
                existedDish.quantity = (updatingDish.quantity ?? 1)
            } else {
                console.log("Dish not exist")
            }
        },
        updateTotal: (state: ICartState) => {
            const total = state.currentCart.dishes.reduce((sum, dish) => {
                return sum += dish.checked ? dish.price * (dish.quantity ?? 1) : 0
            }, 0)
            state.currentCart.totalPrice = total
        },
        openCart: (state: ICartState) => {
            state.isOpen = true
        },
        closeCart: (state: ICartState) => {
            state.isOpen = false
        },
        controlCart: (state: ICartState) => {
            state.isOpen = !state.isOpen
        },
        selectDish: (state: ICartState, action: PayloadAction<IDish>) => {
            const selectedDish = action.payload
            const existedDish = isExistedDish(state, selectedDish)
            if (existedDish) {
                existedDish.checked = !selectedDish.checked
            } else {
                console.log("Dish not exist")
            }
        },
        selectAllDish: (state: ICartState) => {
            const cartList = state.currentCart.dishes.map(dish => ({
                ...dish,
                checked: true
            }))
            state.currentCart.dishes = cartList
        },
        unSelectAllDish: (state: ICartState) => {
            const cartList = state.currentCart.dishes.map(dish => ({
                ...dish,
                checked: false
            }))
            state.currentCart.dishes = cartList
        },
        removeAll: (state: ICartState) => {
            state.currentCart = initialCart
        },
        removeMultiDishes: (state: ICartState) => {
            const removeList = state.currentCart.dishes.filter(dish => dish.checked != true)
            state.currentCart.dishes = removeList
        }
    },
})

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    updateTotal,
    openCart,
    closeCart,
    controlCart,
    selectDish,
    selectAllDish,
    unSelectAllDish,
    removeAll,
    removeMultiDishes

} = cartSlice.actions

export default cartSlice.reducer