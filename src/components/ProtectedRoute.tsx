'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import LoadingBox from './ui/loading'
import { ROUTES } from '@/config/constants/route'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'
import { IS_AUTHENTICATED_KEY } from '@/config/constants/storage'

import { getRoleFromUser } from '@/utils/roleChecker'

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
    const userRole = user ? getRoleFromUser(user) : undefined
    const isRoleAllowed = !requiredRoles || (userRole !== undefined && requiredRoles.includes(userRole))
    const router = useRouter()

    const wasLoggedIn = typeof window !== 'undefined' && localStorage.getItem(IS_AUTHENTICATED_KEY) === 'true'

    useEffect(() => {
        if (isLoading) return

        if (!isAuthenticated && !wasLoggedIn) {
            const currentUrl = typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : ROUTES.GUEST.HOME
            router.push(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(currentUrl)}`)
            return
        }

        if (requiredRoles && isAuthenticated && !isRoleAllowed) {
            router.push(ROUTES.UNAUTHORIZED)
            return
        }
    }, [isAuthenticated, isLoading, router, requiredRoles, isRoleAllowed, wasLoggedIn])

    if (isLoading) {
        return <>{fallback}</>
    }

    if (!isAuthenticated && !wasLoggedIn) {
        return <>{fallback}</>
    }

    if (requiredRoles && !isRoleAllowed && isAuthenticated) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

export default ProtectedRoute