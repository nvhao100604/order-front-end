import api from "@/config/api/axios";
import { ISystemHealthResponse } from "@/interfaces";
import { AxiosRequestConfig } from "axios";

/**
 * Checks system health status from backend GET /health (or /api/v1/health fallback)
 * Handles both 200 OK (Healthy) and 503 Service Unavailable (Unhealthy / DB Disconnected).
 */
const checkHealth = async (options?: AxiosRequestConfig): Promise<ISystemHealthResponse> => {
    try {
        const response = await api.get<ISystemHealthResponse>('/health', {
            validateStatus: (status) => (status >= 200 && status < 300) || status === 503,
            ...options,
        });
        return response.data;
    } catch (err: any) {
        // Fallback to /api/v1/health if /health returns 404
        if (err.response?.status === 404) {
            try {
                const fallbackRes = await api.get<ISystemHealthResponse>('/api/v1/health', {
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 503,
                    ...options,
                });
                return fallbackRes.data;
            } catch (fallbackErr: any) {
                if (fallbackErr.response?.data && typeof fallbackErr.response.data === 'object') {
                    return fallbackErr.response.data as ISystemHealthResponse;
                }
                throw fallbackErr;
            }
        }

        if (err.response?.data && typeof err.response.data === 'object' && 'database' in err.response.data) {
            return err.response.data as ISystemHealthResponse;
        }

        throw err;
    }
};

export const health_services = {
    checkHealth,
};
