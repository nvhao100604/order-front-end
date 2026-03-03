// src/config/api/axios.ts
import axios from 'axios';
import { store } from '@/redux/store';
import { refreshToken, logout } from '@/redux/slices/authSlices';
import { BASE_SERVER_URL } from '@/config/constants';

const api = axios.create({
    baseURL: BASE_SERVER_URL,
    withCredentials: true,
});

// 1. Request Interceptor: Đính kèm accessToken từ RAM vào Header
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý Silent Refresh khi gặp lỗi 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const isRefreshUrl = originalRequest.url?.includes('/refresh-token');

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshUrl) {
            originalRequest._retry = true;

            try {
                const result = await store.dispatch(refreshToken()).unwrap();

                if (result.access_token) {
                    originalRequest.headers.Authorization = `Bearer ${result.access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                store.dispatch(logout());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;