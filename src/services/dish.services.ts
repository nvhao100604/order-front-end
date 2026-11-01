import { DISH_KEY } from "@/config/constants/api"
import api from "@/config/api/axios"
import { IDish, IResponse, Query } from "@/interfaces"
import { convertToParams } from "@/utils"

const getDishes = async (query: Query, config?: object): Promise<IResponse<IDish[]>> => {
    const params = convertToParams(query)
    const response = await api.get(`${DISH_KEY}?${params}`, config)

    return response.data
}

/**
 * Upload dish image to storage bucket
 * POST /api/v1/dishes/upload (multipart/form-data with key 'file')
 */
const uploadDishImage = async (file: File): Promise<IResponse<string>> => {
    const formData = new FormData()
    formData.append("file", file)
    const response = await api.post<IResponse<string>>(`${DISH_KEY}/upload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })
    return response.data
}

export const dishes_services = {
    getDishes,
    uploadDishImage,
}
