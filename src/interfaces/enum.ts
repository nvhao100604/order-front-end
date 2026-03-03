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

export const OrderStatusMap: Record<OrderStatus, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PREPARING: "Preparing",
    SHIPPING: "Out for Delivery",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    UNPAID: "Pending Payment"
};