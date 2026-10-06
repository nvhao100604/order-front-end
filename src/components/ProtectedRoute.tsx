'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import LoadingBox from './ui/loading'
import { ROUTES } from '@/config/constants/route'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: number[]
    fallback?: ReactNode
}

const ProtectedRoute = ({
    children,
    requiredRoles,
    fallback = (
        <div className='flex m-auto h-screen'>
            <LoadingBox />
        </div>
    ),
}: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useEnhancedAuth()
    const userRole = user ? Number(user.roleID ?? (user as any)?.role_id ?? (user as any)?.role) : undefined
    const isRoleAllowed = !requiredRoles || (userRole !== undefined && !isNaN(userRole) && requiredRoles.includes(userRole))
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated) {
            const currentUrl = typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : ROUTES.GUEST.HOME
            router.push(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(currentUrl)}`)
            return
        }

        if (requiredRoles && !isRoleAllowed) {
            router.push(ROUTES.UNAUTHORIZED)
            return
        }
    }, [isAuthenticated, isLoading, router, requiredRoles, isRoleAllowed])

    if (isLoading) {
        return <>{fallback}</>
    }

    if (!isAuthenticated || !isRoleAllowed) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

export default ProtectedRoute