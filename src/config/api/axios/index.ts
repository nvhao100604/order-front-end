// src/config/api/axios.ts
import axios from 'axios';
import { store } from '@/redux/store';
import { refreshToken, logout } from '@/redux/slices/authSlices';
import { BASE_SERVER_URL } from '@/config/constants/api';

const api = axios.create({
    baseURL: BASE_SERVER_URL,
    withCredentials: true,
});

// 1. Request Interceptor: Đính kèm accessToken từ RAM vào Header
api.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        // console.log("token: ", token)
        // console.log("Header: ", config.headers?.Authorization)
        if (token && !config.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý Silent Refresh khi gặp lỗi 401
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

api.interceptors.response.use(
    (response) => {
        console.log(`✅ [${response.config.method?.toUpperCase()}] ${response.config.url} - ${response.status}`)
        return response
    },
    async (error) => {
        const originalRequest = error.config
        const isRefreshUrl = originalRequest.url?.includes('/refresh-token')

        console.log(`❌ [${originalRequest.method?.toUpperCase()}] ${originalRequest.url} - ${error.response?.status} - ${error.response?.data?.detail || error.message}`)

        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshUrl) {
            originalRequest._retry = true

            if (isRefreshing) {
                return new Promise((resolve) => {
                    pendingRequests.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        resolve(api(originalRequest))
                    })
                })
            }

            isRefreshing = true
            console.log("🔄 Refreshing token...")

            try {
                const result = await store.dispatch(refreshToken()).unwrap()

                if (result.access_token) {
                    console.log("🔄 Token refreshed, retrying pending requests...")
                    pendingRequests.forEach(cb => cb(result.access_token))
                    pendingRequests = []
                    originalRequest.headers.Authorization = `Bearer ${result.access_token}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                console.log("❌ Refresh token failed, logging out...")
                pendingRequests = []
                store.dispatch(logout())
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api;