import { DISH_KEY } from "@/config/constants/api"
import api from "@/config/api/axios"
import useFetchSWR from "@/hooks/useFetchSWR"
import { IDish, IResponse, Query } from "@/interfaces"
import { convertToParams } from "@/utils"
import { SWRResponse } from "swr"

const getDishesSWR = (query: Query, config?: object): SWRResponse<IResponse<IDish[]>> => {
    const { data, ...rest } = useFetchSWR(`${DISH_KEY}`, query, config)
    // console.log("data: ", data)
    return { data: data as IResponse<IDish[]>, ...rest }
}

const getDishes = async (query: Query, config?: object): Promise<IResponse<IDish[]>> => {
    const params = convertToParams(query)
    const response = await api.get(`${DISH_KEY}?${params}`, config)

    return response.data
}


// const createDish = async (dish: IDish, config?: object) => {
//     const response = await api.post(`${DISH_KEY}/${ADD}`, dish, config)

//     return response.data
// }

// const updateDish = async (dish: IDish, config?: object) => {
//     const response = await api.put(`${DISH_KEY}/${UPDATE}`, dish, config)

//     return response.data
// }

// const deleteDish = async (dishID: number, config?: object) => {
//     const response = await api.delete(`${DISH_KEY}/${DELETE}/${dishID}`, config)

//     return response.data
// }

// const mutateDishes = () => mutate(`${DISH_KEY}`)

export const dishes_services = {
    getDishesSWR,
    getDishes,
    // getDishSearch,
    // createDish,
    // updateDish,
    // deleteDish
}