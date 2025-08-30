import { ADD, CATEGORY_KEY, DELETE, UPDATE } from "@/config"
import api from "@/config/api/axios"
import { useFetchSWR } from "@/hooks"
import { ICategory } from "@/interfaces"
import { mutate } from "swr"

const getCategoriesSWR = (config?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${CATEGORY_KEY}`, undefined, config)

    return { data, isLoading, error }
}

const getCategoryByID = async (categoryID: number, config?: object) => {
    const response = await api.get(`${CATEGORY_KEY}/${categoryID}`, config)

    return response.data
}

const createCategory = async (category: ICategory, config?: object) => {
    const response = await api.post(`${CATEGORY_KEY}/${ADD}`, category, config)

    return response.data
}

const updateCategory = async (category: ICategory, config?: object) => {
    const response = await api.put(`${CATEGORY_KEY}/${UPDATE}`, category, config)

    return response.data
}

const deleteCategory = async (categoryID: number, config?: object) => {
    const response = await api.delete(`${CATEGORY_KEY}/${DELETE}/${categoryID}`, config)

    return response.data
}

const mutateGetCategories = (config?: object) => mutate(`${CATEGORY_KEY}`, config)

export {
    getCategoriesSWR,
    getCategoryByID,
    createCategory,
    updateCategory,
    deleteCategory,
    mutateGetCategories
}