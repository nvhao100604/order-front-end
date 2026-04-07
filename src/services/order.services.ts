import { ORDER_KEY } from "@/config"
import { Query } from '../interfaces/query.interface';
import { IOrderCreate, IOrderFilter, IOrderResponse, IResponse, OrderStatus } from "@/interfaces";
import api from "@/config/api/axios";
import { SWRConfiguration, SWRResponse } from "swr";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";
import useFetchSWR from "@/hooks/useFetchSWR";

const getOrders = async (query: Query<IOrderFilter>, option?: AxiosRequestConfig)
    : Promise<IResponse<IOrderResponse[]>> => {
    // console.log("query: ", query)
    const queryString = `${ORDER_KEY}?${convertToParams(query)}` || `${ORDER_KEY}`
    const response = await api.get<IResponse<IOrderResponse[]>>(queryString, option)

    return response.data
}

const getOrdersSWR = (query: Query<IOrderFilter>, option?: SWRConfiguration): SWRResponse<IResponse<IOrderResponse[]>> => {
    const { data, ...rest } = useFetchSWR(ORDER_KEY, query, option)

    return { data, ...rest }
}

const getOrder = (id: number, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${ORDER_KEY}/${id}`, undefined, option)
    return { data, isLoading, error }
}

const postOrder = async (order: IOrderCreate, option?: object) => {
    const response = await api.post(ORDER_KEY, order, option)

    return response.data
}

const updateOrderStatus = async (id: number, statusData: OrderStatus, option?: AxiosRequestConfig)
    : Promise<IResponse<IOrderResponse>> => {
    const response = await api.patch(`${ORDER_KEY}/${id}/status?new_status=${statusData}`, option)
    return response.data
}

export const orders_services = {
    getOrders,
    getOrdersSWR,
    getOrder,
    postOrder,
    updateOrderStatus,
}
