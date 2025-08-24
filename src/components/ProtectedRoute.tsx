'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
    children: ReactNode
    requiredRoles?: string[]
    fallback?: ReactNode
}

const ProtectedRoute = ({
    children,
    requiredRoles,
    fallback = (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
    ),
}: ProtectedRouteProps) => {
    const { isAuthenticated, user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
            return
        }

        if (
            !isLoading &&
            isAuthenticated &&
            requiredRoles &&
            user &&
            !requiredRoles.includes(user.role)
        ) {
            router.push('/unauthorized')
            return
        }
    }, [isAuthenticated, user, isLoading, router, requiredRoles])

    if (isLoading) {
        return <>{fallback}</>
    }

    if (!isAuthenticated) {
        return null
    }

    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        return null
    }

    return <>{children}</>
}

export default ProtectedRoute