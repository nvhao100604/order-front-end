import { OrderStatus, TableStatus } from "./enum"

// CATEGORY
export interface ICategory {
    id: number,
    name: string
}

// DISH
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

// DISH-CART
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

// TABLE
export interface ITableBase {
    number: number;
    minCapacity: number;
    maxCapacity: number;
    status: TableStatus;
}

export interface ITableResponse extends ITableBase {
    id: number;
}

export interface ITableUpdate {
    number?: number;
    minCapacity?: number;
    maxCapacity?: number;
    status?: TableStatus;
}

export interface ITableFilter extends ITableUpdate {
    customer_search?: string;
    staff_search?: string;
}

// ORDER
export interface IOrder {
    staffID: number;
    customerID: number;
    tableID?: number | null;
    totalPrice?: Total;
    notes?: string | null;
    details: ICartItem[]
}

export interface IOrderResponse {
    id: number;
    status: OrderStatus;
    subtotal: number;
    tax: number;
    delivery: number;
    totalPrice: number;
    notes: string | null;
    staffID: number;
    customerID: number;
    tableID: number | null;
    discountID: number | null;
    details: IOrderDetailResponse[];
    createdAt: string;
    updatedAt: string;
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

export interface IOrderCreate {
    staffID?: number;
    customerID: number;
    tableID?: number | null;
    discountID?: number | null;
    subtotal: number,
    tax: number,
    delivery: number,
    totalPrice: number;
    notes?: string | null;
    details: IOrderDetailBase[]
}

export interface Total {
    subtotal: number,
    tax: number,
    delivery: number,
    total: number
}

export interface IOrderFilter {
    status?: OrderStatus;
    min_price?: number;
    max_price?: number;
    staffID?: number;
    customerID?: number;
    tableID?: number;
    start_date?: string;
    end_date?: string;
}

export const tempOrder: IOrder = {
    staffID: 0,
    customerID: 0,
    details: []
}