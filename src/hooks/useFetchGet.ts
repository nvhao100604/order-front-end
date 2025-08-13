'use client'
import useSWR from "swr";

const useFetchGet = (path: string, query?: object) => {
    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const queryString = new URLSearchParams(query as any).toString()
    console.log(queryString)
    const pathString = `http://localhost:5041/api/${path}?${queryString}`
    const { data, error, isLoading } = useSWR(
        pathString,
        fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 60000,
    }
    )
    return { data, error, isLoading }
}

export default useFetchGet