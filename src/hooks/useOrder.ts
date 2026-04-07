import { ORDER_KEY } from "@/config/constants/api";
import useFetchSWR from "./useFetchSWR"; // Import TRỰC TIẾP file, không qua index
import { IOrderFilter, IOrderResponse, IResponse, Query } from "@/interfaces";
import { SWRConfiguration, SWRResponse } from "swr";

// Hook lấy danh sách đơn hàng
export const useGetOrders = (
    query: Query<IOrderFilter>,
    option?: SWRConfiguration
): SWRResponse<IResponse<IOrderResponse[]>> => {
    return useFetchSWR(ORDER_KEY, query, option);
}

// Hook lấy chi tiết một đơn hàng
export const useGetOrderDetail = (id: number | null, option?: SWRConfiguration) => {
    const { data, isLoading, error, mutate } = useFetchSWR(
        id ? `${ORDER_KEY}/${id}` : null,
        undefined,
        option
    );

    return {
        data: data as IResponse<IOrderResponse>,
        isLoading,
        error,
        mutate
    };
}