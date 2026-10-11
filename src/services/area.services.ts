import api from "@/config/api/axios";
import { AREA_KEY } from "@/config/constants/api";
import { IArea, IAreaLayoutResponse, IResponse } from "@/interfaces";
import { AxiosRequestConfig } from "axios";

const getAreas = async (options?: AxiosRequestConfig): Promise<IResponse<IArea[]>> => {
    const response = await api.get<IResponse<IArea[]>>(`${AREA_KEY}`, options);
    return response.data;
};

const getAreaLayout = async (areaId: number, options?: AxiosRequestConfig): Promise<IResponse<IAreaLayoutResponse>> => {
    const response = await api.get<IResponse<IAreaLayoutResponse>>(`${AREA_KEY}/${areaId}/layout`, options);
    return response.data;
};

export const area_services = {
    getAreas,
    getAreaLayout,
};
