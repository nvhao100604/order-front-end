import { ICart, ICartItem, ICartState, IDish, IOrderCreate, IOrderResponse } from '@/interfaces'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { orders_services } from '@/services'

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

const placeOrder = createAsyncThunk<
    IOrderResponse,
    IOrderCreate,
    { rejectValue: string }
>("order/placeOrder",
    async (order: IOrderCreate, { rejectWithValue }) => {
        try {
            const response = await orders_services.postOrder(order)
            console.log(response)
            if (response.success) {
                return response.data
            }
            return null

        } catch (error: any) {
            return rejectWithValue(
                error.response?.message || "Place Order failed."
            )
        }
    })
export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state: ICartState, action: PayloadAction<ICartItem>) => {
            const newDish = action.payload
            const existedDish = isExistedDish(state, newDish)
            if (existedDish) {
                existedDish.quantity = (existedDish.quantity ?? 0) + 1
            } else {
                state.currentCart.dishes.push(newDish)
            }
        },
        removeFromCart: (state: ICartState, action: PayloadAction<ICartItem>) => {
            const removeDish = action.payload
            console.log("quantity: " + action.payload.quantity)
            const existedDish = isExistedDish(state, removeDish)
            if (existedDish) {
                state.currentCart.dishes = state.currentCart.dishes.filter(dish => dish.id !== removeDish.id)
            } else {
                console.log("Dish not exist")
            }
        },
        updateQuantity: (state: ICartState, action: PayloadAction<ICartItem>) => {
            const updatingDish = action.payload
            console.log("quantity: " + action.payload.quantity)
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
        selectDish: (state: ICartState, action: PayloadAction<ICartItem>) => {
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
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => {
                state.isLoading = true
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                const list = action.payload.details
                const idToRemove = new Set(list.map(item => item.dishID))
                const new_dishes = state.currentCart.dishes.filter(cartItem =>
                    !idToRemove.has(cartItem.id)
                )
                state.currentCart.dishes = new_dishes
                state.isLoading = false
                state.error = ""
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || "An error has occurred."
            })
    }
})

export {
    placeOrder
}
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
    removeMultiDishes,

} = cartSlice.actions

export default cartSlice.reducer