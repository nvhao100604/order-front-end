import api from "@/config/api/axios"
import { AUTH_KEY } from "@/config/constants/api"
import {
    IResponse,
    LoginCredentials,
    RegisterPayload,
    TokenResponse
} from "@/interfaces"
import { AxiosRequestConfig } from "axios"

// Login
const authLogin = async (
    credentials: LoginCredentials,
    options?: AxiosRequestConfig
): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>(
        `${AUTH_KEY}/login`,
        credentials,
        {
            ...options,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
    return response.data
}

// Register
const authRegister = async (
    payload: RegisterPayload,
    options?: object
): Promise<IResponse<TokenResponse>> => {
    const response = await api.post<IResponse<TokenResponse>>(
        `${AUTH_KEY}/register`,
        payload,
        options
    )
    return response.data
}

// Logout
const authLogout = async (
    options?: object
): Promise<IResponse<null>> => {
    const response = await api.post<IResponse<null>>(
        `${AUTH_KEY}/logout`,
        {},
        options
    )
    return response.data
}

// Refresh token
const authRefreshToken = async (
    options?: object
): Promise<IResponse<TokenResponse>> => {
    const response = await api.post<IResponse<TokenResponse>>(
        `${AUTH_KEY}/refresh-token`,
        {},
        options
    )
    return response.data
}

// Revoke all tokens
const authRevokeAll = async (
    options?: object
): Promise<IResponse<null>> => {
    const response = await api.post<IResponse<null>>(
        `${AUTH_KEY}/revoke-all-tokens`,
        {},
        options
    )
    return response.data
}

export const auth_services = {
    authLogin,
    authRegister,
    authLogout,
    authRefreshToken,
    authRevokeAll
}