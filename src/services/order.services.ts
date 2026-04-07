import { ORDER_KEY } from "@/config/constants/api"
import { Query } from '../interfaces/query.interface';
import { IOrderCreate, IOrderFilter, IOrderResponse, IResponse, OrderStatus } from "@/interfaces";
import api from "@/config/api/axios";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";

const getOrders = async (query: Query<IOrderFilter>, option?: AxiosRequestConfig)
    : Promise<IResponse<IOrderResponse[]>> => {
    // console.log("query: ", query)
    const queryString = `${ORDER_KEY}?${convertToParams(query)}` || `${ORDER_KEY}`
    const response = await api.get<IResponse<IOrderResponse[]>>(queryString, option)

    return response.data
}

const postOrder = async (order: IOrderCreate, option?: object): Promise<IResponse<IOrderResponse>> => {
    const response = await api.post<IResponse<IOrderResponse>>(ORDER_KEY, order, option)

    return response.data
}

const updateOrderStatus = async (id: number, statusData: OrderStatus, option?: AxiosRequestConfig)
    : Promise<IResponse<IOrderResponse>> => {
    const response = await api.patch(`${ORDER_KEY}/${id}/status?new_status=${statusData}`, option)
    return response.data
}

export const orders_services = {
    getOrders,
    postOrder,
    updateOrderStatus,
}
