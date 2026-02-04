import { DISH_KEY } from "@/config"
import api from "@/config/api/axios"
import { useFetchSWR } from "@/hooks"
import { IDish, Query } from "@/interfaces"
import { convertToParams } from "@/utils"

const getDishesSWR = (query: Query, config?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${DISH_KEY}`, query, config)

    return { data, isLoading, error }
}

const getDishes = async (query: Query, config?: object) => {
    const params = convertToParams(query)
    const response = await api.get(`${DISH_KEY}?${params}`, config)

    return response.data
}

// const getDishSearch = (query: Query, config?: object) => {
//     const { data, isLoading, error } = useFetchSWR(`${DISH_KEY}/${SEARCH}`, query, config)

//     return { data, isLoading, error }
// }

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

export {
    getDishesSWR,
    getDishes,
    // getDishSearch,
    // createDish,
    // updateDish,
    // deleteDish
}