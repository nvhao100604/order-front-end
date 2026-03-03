'use client'

import { useEnhancedAuth } from '@/hooks'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import LoadingBox from './ui/loading'
import { ROUTES } from '@/config/constants/route'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: number[]
    fallback?: ReactNode
}

const ProtectedRoute = ({
    children,
    requiredRoles,
    fallback = (
        <LoadingBox />
    ),
}: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useEnhancedAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(ROUTES.LOGIN)
            return
        }

        if (
            !isLoading &&
            isAuthenticated &&
            requiredRoles &&
            user &&
            user.roleID !== undefined &&
            !requiredRoles.includes(user.roleID)
        ) {
            router.push(ROUTES.UNAUTHORIZED)
            return
        }
    }, [isAuthenticated, user, isLoading, router, requiredRoles])

    if (isLoading) {
        return <>{fallback}</>
    }

    if (!isAuthenticated) {
        return null
    }

    if (requiredRoles && user && user.roleID !== undefined && !requiredRoles.includes(user.roleID)) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute