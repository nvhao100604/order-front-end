import useSWR, { SWRConfiguration } from "swr"
import { useAuth } from "./useAuth"
import api from "@/config/api/axios"

const fetcher = async (url: string) => {
    const response = await api.get(url)
    return response.data
}

const useSWRWithAuth = <T>(
    key: string | null,
    options?: SWRConfiguration<T>
) => {
    const { isAuthenticated } = useAuth()

    return useSWR<T>(
        isAuthenticated ? key : null,
        fetcher,
        {
            errorRetryCount: 3,
            revalidateOnFocus: false,
            ...options,
        }
    )
}

export { useSWRWithAuth }
