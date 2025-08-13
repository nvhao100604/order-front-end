import { IDish } from "../menu/menu.interface";

export interface ICart {
    dishes: IDish[],
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
    payload?: IDish
}