export interface Dish {
    id: number,
    name: string,
    category: string,
    price: number,
    description: string,
    image: string,
    dietary: {
        vegetarian?: boolean,
        spiceLevel?: number
    }
}

export interface Category {
    id: string,
    name: string
}