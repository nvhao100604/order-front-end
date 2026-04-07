import { DISH_KEY } from "@/config/constants/api"
import api from "@/config/api/axios"
import { IDish, IResponse, Query } from "@/interfaces"
import { convertToParams } from "@/utils"

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
    getDishes,
    // getDishSearch,
    // createDish,
    // updateDish,
    // deleteDish
}