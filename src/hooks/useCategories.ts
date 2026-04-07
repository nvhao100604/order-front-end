import { CATEGORY_KEY } from "@/config/constants/api"
import useFetchSWR from "./useFetchSWR"

const getCategoriesSWR = (page: number, limit: number, config?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${CATEGORY_KEY}?page=${page}&limit=${limit}`, undefined, config)

    return { data, isLoading, error }
}

export {
    getCategoriesSWR
}