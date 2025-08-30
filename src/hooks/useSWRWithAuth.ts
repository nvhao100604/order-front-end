import useSWR, { SWRConfiguration } from "swr"
import { useAuth } from "./useAuth"

const useSWRWithAuth = <T>(
    key: string | null,
    options?: SWRConfiguration<T>
) => {
    const { isAuthenticated } = useAuth()

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
