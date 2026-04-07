import { DASHBOARD_KEY } from "@/config/constants/api";
import { Query } from '../interfaces/query.interface';
import { IOrderResponse, ITableResponse, IResponse } from "@/interfaces";
import api from "@/config/api/axios";
import { SWRConfiguration, SWRResponse } from "swr";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";
import useFetchSWR from "@/hooks/useFetchSWR";

const DASHBOARD_ORDERS_KEY = `${DASHBOARD_KEY}/orders`;
const DASHBOARD_TABLES_KEY = `${DASHBOARD_KEY}/tables`;

const getDashboardOrders = async (query?: Query<any>, option?: AxiosRequestConfig)
    : Promise<IResponse<IOrderResponse[]>> => {
    const queryString = query ? `${DASHBOARD_ORDERS_KEY}?${convertToParams(query)}` : DASHBOARD_ORDERS_KEY;
    const response = await api.get<IResponse<IOrderResponse[]>>(queryString, option);
    return response.data;
}

const getDashboardTables = async (query?: Query<any>, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const queryString = query ? `${DASHBOARD_TABLES_KEY}?${convertToParams(query)}` : DASHBOARD_TABLES_KEY;
    const response = await api.get<IResponse<ITableResponse[]>>(queryString, option);
    return response.data;
}

const getDashboardOrdersSWR = (query?: Query<any>, option?: SWRConfiguration): SWRResponse<IResponse<IOrderResponse[]>> => {
    const { data, ...rest } = useFetchSWR(DASHBOARD_ORDERS_KEY, query, option);
    return { data, ...rest };
}

const getDashboardTablesSWR = (query?: Query<any>, option?: SWRConfiguration): SWRResponse<IResponse<ITableResponse[]>> => {
    const { data, ...rest } = useFetchSWR(DASHBOARD_TABLES_KEY, query, option);
    return { data, ...rest };
}

export const dashboard_services = {
    getDashboardOrders,
    getDashboardTables,
    getDashboardOrdersSWR,
    getDashboardTablesSWR,
}