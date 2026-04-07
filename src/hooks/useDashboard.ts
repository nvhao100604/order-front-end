import { IOrderResponse, IResponse, ITableResponse, Query } from "@/interfaces";
import useFetchSWR from "./useFetchSWR";
import { SWRConfiguration, SWRResponse } from "swr";
import { DASHBOARD_ORDERS_KEY, DASHBOARD_TABLES_KEY } from "@/config/constants/api";

const getDashboardOrdersSWR = (query?: Query<any>, option?: SWRConfiguration): SWRResponse<IResponse<IOrderResponse[]>> => {
    const { data, ...rest } = useFetchSWR(DASHBOARD_ORDERS_KEY, query, option);
    return { data, ...rest };
}

const getDashboardTablesSWR = (query?: Query<any>, option?: SWRConfiguration): SWRResponse<IResponse<ITableResponse[]>> => {
    const { data, ...rest } = useFetchSWR(DASHBOARD_TABLES_KEY, query, option);
    return { data, ...rest };
}

export {
    getDashboardOrdersSWR,
    getDashboardTablesSWR
}