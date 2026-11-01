import api from "@/config/api/axios";
import { ISystemHealthResponse } from "@/interfaces";
import { AxiosRequestConfig } from "axios";

const checkHealth = async (options?: AxiosRequestConfig): Promise<ISystemHealthResponse> => {
    try {
        const response = await api.get<ISystemHealthResponse>('/health', options);
        return response.data;
    } catch (err: any) {
        // Fallback to /api/v1/health if /health returns 404
        if (err.response?.status === 404) {
            const fallbackRes = await api.get<ISystemHealthResponse>('/api/v1/health', options);
            return fallbackRes.data;
        }
        throw err;
    }
};

export const health_services = {
    checkHealth,
};

