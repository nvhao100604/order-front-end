import { ROLES } from "@/config/constants/auth"
import { ROUTES } from "@/config/constants/route"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

export const getRoleFromUser = (user: any): number => {
    if (!user) return ROLES.GUEST;
    const raw = user.roleID ?? user.role_id ?? user.role;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed)) return parsed;
        if (raw.toUpperCase() === 'ADMIN') return ROLES.ADMIN;
        if (raw.toUpperCase() === 'STAFF') return ROLES.STAFF;
    }
    return ROLES.GUEST;
}

const checkRole = (roleId: number, router: AppRouterInstance, redirectUrl?: string | null) => {
    const isValidRedirect = redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')

    switch (roleId) {
        case ROLES.ADMIN: {
            if (isValidRedirect && (redirectUrl.startsWith('/admin') || redirectUrl.startsWith('/staff'))) {
                router.push(redirectUrl)
            } else {
                router.push(ROUTES.STAFF.DASHBOARD)
            }
            break
        }

        case ROLES.STAFF: {
            if (isValidRedirect && redirectUrl.startsWith('/staff')) {
                router.push(redirectUrl)
            } else {
                router.push(ROUTES.STAFF.DASHBOARD)
            }
            break
        }

        default: {
            if (isValidRedirect && !redirectUrl.startsWith('/staff') && !redirectUrl.startsWith('/admin')) {
                router.push(redirectUrl)
            } else {
                router.push(ROUTES.GUEST.HOME)
            }
            break
        }
    }
}

export {
    checkRole
}