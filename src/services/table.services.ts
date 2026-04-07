
import { TABLE_KEY } from "@/config"
import { Query } from '../interfaces/query.interface';
import { ITableFilter, ITableResponse, IResponse, ITableUpdate, TableStatus } from "@/interfaces";
import api from "@/config/api/axios";
import { SWRResponse } from "swr";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";
import useFetchSWR from "@/hooks/useFetchSWR";

const getTables = async (query: Query<ITableFilter>, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const queryString = `${TABLE_KEY}?${convertToParams(query)}` || `${TABLE_KEY}`
    const response = await api.get<IResponse<ITableResponse[]>>(queryString, option)
    return response.data
}

const getTablesSWR = (query: Query<ITableFilter>, option?: object): SWRResponse<IResponse<ITableResponse[]>> => {
    const { data, ...rest } = useFetchSWR(TABLE_KEY, query, option)
    return { data, ...rest } as SWRResponse<IResponse<ITableResponse[]>>
}

const getTable = (id: number, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${TABLE_KEY}/${id}`, undefined, option)
    return { data, isLoading, error }
}

const updateTableStatus = async (id: number, statusData: TableStatus, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}/status`, statusData, option)
    return response.data
}

const updateTable = async (id: number, tableData: ITableUpdate, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}`, tableData, option)
    return response.data
}

const deleteTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.delete(`${TABLE_KEY}/${id}`, option)
    return response.data
}

export const tables_services = {
    getTables,
    getTablesSWR,
    getTable,
    updateTableStatus,
    updateTable,
    deleteTable
}