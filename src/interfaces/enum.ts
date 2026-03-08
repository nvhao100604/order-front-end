export type TableStatus = "FREE" | "OCCUPIED" | "RESERVED" | "DELETED";

export type OrderStatus =
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPING"
    | "COMPLETED"
    | "CANCELLED"
    | "UNPAID";

export type DiscountCategory = "order" | "dish" | "customer";

export enum Status {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned"
}

export const OrderStatusMap = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    SHIPPING: "Out for Delivery",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    UNPAID: "Pending Payment",
} as const

export type OrderStatusKey = keyof typeof OrderStatusMap

export const OrderStatusOptions = Object.entries(OrderStatusMap).map(([key, value]) => ({
    key: key,
    value: value
}));
