'use client'
import { REFRESH_INTERVAL } from "@/config";
import { Query } from "@/interfaces";
import { convertToParams } from "@/utils";
import useSWR from "swr";

const useFetchSWR = (path: string | null, query?: Query, config?: object) => {
    const queryString = convertToParams(query)
    const pathString = path
        ? (query ? `${path}?${queryString}` : path)
        : null

    const { data, ...rest } = useSWR(
        pathString,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            refreshInterval: REFRESH_INTERVAL,
            ...config
        }
    )
    return { data, ...rest }
}

export default useFetchSWR