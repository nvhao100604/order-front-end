'use client'
import useSWR, { SWRConfiguration } from "swr"
import { useEnhancedAuth } from "./redux_custom_hooks/authSlice.hooks"

const useSWRWithAuth = <T>(
    key: string | null,
    options?: SWRConfiguration<T>
) => {
    const { isAuthenticated } = useEnhancedAuth()

    return useSWR<T>(
        isAuthenticated ? key : null,
        {
            errorRetryCount: 3,
            revalidateOnFocus: false,
            ...options,
        }
    )
}

export { useSWRWithAuth }