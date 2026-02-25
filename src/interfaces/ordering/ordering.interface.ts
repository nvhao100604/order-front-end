
export type TableStatus = "FREE" | "OCCUPIED" | "RESERVED";
export type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "COMPLETED" | "CANCELLED";

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
    describe: string
    category: ICategory
}

export interface ICartItem extends IDish {
    quantity: number,
    checked: boolean
}

export const tempDish: IDish = {
    id: 0,
    name: "",
    price: 0,
    categoryId: 0,
    imgUrl: "",
    describe: "",
    category: {
        id: 0,
        name: ""
    }
}

export const tempCartItem: ICartItem = {
    id: 0,
    name: "",
    price: 0,
    categoryId: 0,
    imgUrl: "",
    describe: "",
    category: {
        id: 0,
        name: ""
    },
    quantity: 0,
    checked: false
}

// export type DishAPIResponse = { dishes: IDish[], isLoading: boolean, error: any } | null


export interface ITable {
    id: number;
    status: TableStatus;
}

export interface IOrderDetailBase {
    dishID: number;
    quantity: number;
    price: number;
}

export interface IOrderDetailResponse extends IOrderDetailBase {
    id: number;
    orderID: number;
    dish: IDish;
}

export interface IOrder {
    staffID: number;
    customerID: number;
    tableID?: number | null;
    totalPrice?: Total;
    notes?: string | null;
    details: ICartItem[]
}

export interface IOrderCreate {
    staffID: number;
    customerID: number;
    tableID?: number | null;
    totalPrice?: Total;
    notes?: string | null;
    details: IOrderDetailBase[]
}

export interface Total {
    subtotal: number,
    tax: number,
    delivery: number,
    total: number
}


export const tempOrder: IOrder = {
    staffID: 0,
    customerID: 0,
    details: []
}

export interface IOrderResponse {
    id: number;
    dateOrder: string;
    status: OrderStatus;
    totalPrice: number;
    notes: string | null;
    details: IOrderDetailResponse[];
}

export interface IOrderFilter {
    dateOrder?: string;
    status?: OrderStatus;
    min_price?: number;
    max_price?: number;
    staffID?: number;
    customerID?: number;
    tableID?: number;
}