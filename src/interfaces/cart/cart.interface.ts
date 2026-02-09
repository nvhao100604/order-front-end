import { ICartItem } from "../ordering/ordering.interface"

export interface ICart {
    dishes: ICartItem[],
    totalPrice: number
}

export interface ICartState {
    currentCart: ICart,
    isOpen: boolean,
    isLoading: boolean,
    error: string
}

export interface ICartAction {
    type: string,
    payload?: ICartItem
}