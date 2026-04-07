import { IDish, IResponse, Query } from "@/interfaces"
import { SWRConfiguration, SWRResponse } from "swr"
import useFetchSWR from "./useFetchSWR"
import { DISH_KEY } from "@/config/constants/api"

const getDishesSWR = (query: Query, config?: SWRConfiguration): SWRResponse<IResponse<IDish[]>> => {
    const { data, ...rest } = useFetchSWR(`${DISH_KEY}`, query, config)
    // console.log("data: ", data)
    return { data: data as IResponse<IDish[]>, ...rest }
}

export {
    getDishesSWR
}