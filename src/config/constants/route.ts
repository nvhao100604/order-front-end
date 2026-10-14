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
        INVOICE: "/staff/invoice",
    },
    ADMIN: "/admin",
    ADMIN_FLOOR_PLAN: "/admin/floor-plan",
    CONTACT: "#footer",
    UNAUTHORIZED: "/unauthorized",
} as const