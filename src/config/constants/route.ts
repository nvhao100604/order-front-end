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
        ABOUT: "/guest/#about-us"
    },
    STAFF: {
        DASHBOARD: "/staff/dashboard",
        ORDER: "/staff/order",
        MANAGE: "/staff/manage",
    },
    ADMIN: "/admin",
    CONTACT: "#footer",
    UNAUTHORIZED: "/unauthorized",
} as const