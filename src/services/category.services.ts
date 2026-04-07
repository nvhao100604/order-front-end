import { CATEGORY_KEY } from "@/config/constants/api"
import api from "@/config/api/axios"

const getCategories = async (page: number, limit: number, config?: object) => {
    const response = await api.get(`${CATEGORY_KEY}?page=${page}&limit=${limit}`, config)

    return response.data
}

const getCategoryByID = async (categoryID: number, config?: object) => {
    const response = await api.get(`${CATEGORY_KEY}/${categoryID}`, config)

    return response.data
}

// const createCategory = async (category: ICategory, config?: object) => {
//     const response = await api.post(`${CATEGORY_KEY}/${ADD}`, category, config)

//     return response.data
// }

// const updateCategory = async (category: ICategory, config?: object) => {
//     const response = await api.put(`${CATEGORY_KEY}/${UPDATE}`, category, config)

//     return response.data
// }

// const deleteCategory = async (categoryID: number, config?: object) => {
//     const response = await api.delete(`${CATEGORY_KEY}/${DELETE}/${categoryID}`, config)

//     return response.data
// }

// const mutateGetCategories = (config?: object) => mutate(`${CATEGORY_KEY}`, config)

const categories_services = {
    getCategories,
    getCategoryByID,
    // createCategory,
    // updateCategory,
    // deleteCategory,
    // mutateGetCategories
}
export default categories_services