import { ROLES, ROUTES } from "@/config"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

const checkRole = (roleId: number, router: AppRouterInstance) => {
    // console.log("Role id: " + roleId)
    switch (roleId) {
        case ROLES.ADMIN: {
            // console.log("push to " + ROLES.ADMIN)
            router.push(ROUTES.STAFF.DASHBOARD)
            break
        }

        case ROLES.STAFF: {
            // console.log("push to " + ROLES.STAFF)
            router.push(ROUTES.STAFF.DASHBOARD)
            break
        }

        default: {
            // console.log("push to " + ROLES.GUEST)
            router.push(ROUTES.GUEST.HOME)
            break
        }
    }
}

export {
    checkRole
}