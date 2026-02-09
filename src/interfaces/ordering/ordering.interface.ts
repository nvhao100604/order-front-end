
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

export interface IOrderCreate {
    staffID: number;
    customerID: number;
    tableID?: number | null;
    totalPrice: number;
    notes?: string | null;
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