export const ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        FORGOT_PASSWORD: "/auth/forgot-password"
    },
    GUEST: {
        HOME: "/guest",
        MENU: "/guest/menu",
        RESERVATION: "/guest/reservation",
        ABOUT: "/guest/#about-us",
        BEST_SELLER: "/guest/#best-seller"
    },
    STAFF: {
        DASHBOARD: "/staff/dashboard",
        ORDER: "/staff/order",
        MANAGE: "/staff/manage",
        TABLE_MAP: "/staff/table-map",
    },
    ADMIN: "/admin",
    CONTACT: "#footer",
    UNAUTHORIZED: "/unauthorized",
} as const