'use client'
import { REFRESH_INTERVAL } from "@/config";
import { Query } from "@/interfaces";
import { convertToParams } from "@/utils";
import useSWR from "swr";

const useFetchSWR = (path: string, query?: Query, config?: object) => {
    const queryString = convertToParams(query)
    // console.log(queryString)
    const pathString = query ? `${path}?${queryString}` : `${path}`
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
    // console.log("check data: ", data)
    return { data, ...rest }
}

export default useFetchSWR