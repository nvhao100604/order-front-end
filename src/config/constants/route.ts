export const ROUTES = {
    LOGIN: "/login",
    REGISTER: "/register",
    GUEST: {
        HOME: "/guest",
        MENU: "/guest/menu",
        RESERVATION: "/guest/reservation",
        ABOUT: "/guest/#about-us"
    },
    STAFF: {
        DASHBOARD: "/staff/dashboard",
        ORDERS: "/staff/orders",
    },
    CONTACT: "#footer",
    UNAUTHORIZED: "/unauthorized",
} as const