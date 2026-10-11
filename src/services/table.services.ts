import { TABLE_KEY } from "@/config/constants/api";
import { Query } from '../interfaces/query.interface';
import { ITableFilter, ITableResponse, ITableCreate, IResponse, ITableUpdate, TableStatus } from "@/interfaces";
import api from "@/config/api/axios";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";
import useFetchSWR from "@/hooks/useFetchSWR";

const getTables = async (query?: Query<ITableFilter>, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const queryString = query ? `${TABLE_KEY}?${convertToParams(query)}` : `${TABLE_KEY}`;
    const response = await api.get<any>(queryString, option);
    const data: ITableResponse[] = Array.isArray(response.data?.data)
        ? response.data.data
        : (Array.isArray(response.data) ? response.data : []);
    return { ...response.data, data };
};

const getTable = (id: number, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${TABLE_KEY}/${id}`, undefined, option);
    return { data, isLoading, error };
};

const createTable = async (tableData: ITableCreate, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post<IResponse<ITableResponse>>(`${TABLE_KEY}`, tableData, option);
    return response.data;
};

const updateTableStatus = async (id: number, statusData: TableStatus, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}/status`, statusData, option);
    return response.data;
};

const updateTable = async (id: number, tableData: ITableUpdate, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}`, tableData, option);
    return response.data;
};

const openTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post(`${TABLE_KEY}/${id}/open`, {}, option);
    return response.data;
};

const closeTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post(`${TABLE_KEY}/${id}/close`, {}, option);
    return response.data;
};

const recommendTables = async (guests: number, areaId?: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const params: Record<string, any> = { guests };
    if (areaId) params.areaID = areaId;
    const response = await api.get<IResponse<ITableResponse[]>>(`${TABLE_KEY}/recommend?${convertToParams(params)}`, option);
    return response.data;
};

const mergeTables = async (tableIDs: number[], option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const response = await api.post(`${TABLE_KEY}/merge`, { tableIDs }, option);
    return response.data;
};

const splitTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post(`${TABLE_KEY}/${id}/split`, {}, option);
    return response.data;
};

const getUnplacedTables = async (option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const response = await api.get<any>(`${TABLE_KEY}?unplaced=true`, option);
    const data: ITableResponse[] = Array.isArray(response.data?.data)
        ? response.data.data
        : (Array.isArray(response.data) ? response.data : []);
    return { ...response.data, data };
};

const deleteTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.delete(`${TABLE_KEY}/${id}`, option);
    return response.data;
};

export const tables_services = {
    getTables,
    getTable,
    createTable,
    getUnplacedTables,
    updateTableStatus,
    updateTable,
    openTable,
    closeTable,
    recommendTables,
    mergeTables,
    splitTable,
    deleteTable
};