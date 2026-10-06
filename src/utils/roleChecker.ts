import { ROLES } from "@/config/constants/auth"
import { ROUTES } from "@/config/constants/route"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

const checkRole = (roleId: number, router: AppRouterInstance, redirectUrl?: string | null) => {
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
        router.push(redirectUrl)
        return
    }

    switch (roleId) {
        case ROLES.ADMIN: {
            router.push(ROUTES.STAFF.DASHBOARD)
            break
        }

        case ROLES.STAFF: {
            router.push(ROUTES.STAFF.DASHBOARD)
            break
        }

        default: {
            router.push(ROUTES.GUEST.HOME)
            break
        }
    }
}

export {
    checkRole
}