'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import LoadingBox from './ui/loading'
import Modal from './app/app.modal'
import { ROUTES } from '@/config/constants/route'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'
import { IS_AUTHENTICATED_KEY } from '@/config/constants/storage'

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

    const wasLoggedIn = typeof window !== 'undefined' && localStorage.getItem(IS_AUTHENTICATED_KEY) === 'true'

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
        // If user session existed previously or currently exists, keep UI mounted underneath and display dark modal overlay
        if (isAuthenticated || user || wasLoggedIn) {
            return (
                <>
                    {children}
                    <Modal handleClick={() => {}}>
                        <div className="flex flex-col items-center justify-center p-8 bg-[#1F1A17]/95 border border-[#D4AF37]/40 rounded-2xl shadow-2xl backdrop-blur-md space-y-4">
                            <LoadingBox />
                            <p className="text-xs font-semibold text-stone-200 tracking-wide text-center">
                                Verifying session...
                            </p>
                        </div>
                    </Modal>
                </>
            )
        }
        return <>{fallback}</>
    }

    if (!isAuthenticated || !isRoleAllowed) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

export default ProtectedRoute