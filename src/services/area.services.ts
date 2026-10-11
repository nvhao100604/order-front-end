import api from "@/config/api/axios";
import { AREA_KEY } from "@/config/constants/api";
import { IArea, IAreaLayoutResponse, IResponse, IUpdateLayoutPayload } from "@/interfaces";
import { AxiosRequestConfig } from "axios";

const getAreas = async (options?: AxiosRequestConfig): Promise<{ data: IArea[] }> => {
    const response = await api.get<any>(`${AREA_KEY}`, options);
    const data: IArea[] = Array.isArray(response.data)
        ? response.data
        : (Array.isArray(response.data?.data) ? response.data.data : []);
    return { data };
};

const getAreaLayout = async (areaId: number, options?: AxiosRequestConfig): Promise<{ data: IAreaLayoutResponse }> => {
    const response = await api.get<any>(`${AREA_KEY}/${areaId}/layout`, options);
    const data: IAreaLayoutResponse = response.data?.id !== undefined
        ? response.data
        : (response.data?.data?.id !== undefined ? response.data.data : response.data);
    return { data };
};

const updateAreaLayout = async (
    areaId: number,
    payload: IUpdateLayoutPayload,
    options?: AxiosRequestConfig
): Promise<{ data: IAreaLayoutResponse }> => {
    const response = await api.put<any>(
        `${AREA_KEY}/${areaId}/layout`,
        payload,
        options
    );
    const data: IAreaLayoutResponse = response.data?.id !== undefined
        ? response.data
        : (response.data?.data?.id !== undefined ? response.data.data : response.data);
    return { data };
};

export const area_services = {
    getAreas,
    getAreaLayout,
    updateAreaLayout,
};
