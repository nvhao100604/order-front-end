import { ORDER_KEY } from "@/config"
import { useFetchSWR } from "@/hooks"
import { Query } from '../../interfaces/query/query.interface';
import { IOrderCreate } from "@/interfaces";
import api from "@/config/api/axios";

const getOrders = (query: Query, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(ORDER_KEY, query, option)

    return { data, isLoading, error }
}

const getOrder = (id: number, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${ORDER_KEY}/${id}`, undefined, option)
    return { data, isLoading, error }
}

const postOrder = async (order: IOrderCreate, option?: object) => {
    const response = await api.post(ORDER_KEY, order, option)

    return response.data
}

export const orders_services = {
    getOrders,
    getOrder,
    postOrder
}
