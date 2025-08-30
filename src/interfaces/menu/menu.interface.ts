export interface ICategory {
    id: number,
    name: string
}

export interface IDish {
    id: number,
    name: string,
    price: number,
    categoryId?: number,
    imgUrl: string,
    describe: string,
    quantity?: number,
    checked?: boolean
}

export const tempDish: IDish = {
    id: 0,
    name: "",
    price: 0,
    categoryId: 0,
    imgUrl: "",
    describe: "",
    quantity: 0,
    checked: false
}

// export type DishAPIResponse = { dishes: IDish[], isLoading: boolean, error: any } | null

