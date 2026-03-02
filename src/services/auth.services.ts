import api from "@/config/api/axios"
import {
    AuthResponse,
    LoginCredentials,
    RegisterPayload
} from "@/interfaces"

// Login
const authLogin = async (
    credentials: LoginCredentials,
    options?: object
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        credentials,
        options
    )
    return response.data
}

// Register
const authRegister = async (
    payload: RegisterPayload,
    options?: object
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/register",
        payload,
        options
    )
    return response.data
}

// Logout
const authLogout = async (options?: object) => {
    const response = await api.post(
        "/auth/logout",
        {},
        options
    )
    return response.data
}

// Refresh token
const authRefreshToken = async (
    options?: object
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/refresh-token",
        {},
        options
    )
    return response.data
}

// Revoke all tokens
const authRevokeAll = async (options?: object) => {
    const response = await api.post(
        "/auth/revoke-all-tokens",
        {},
        options
    )
    return response.data
}

export const authServices = {
    authLogin,
    authRegister,
    authLogout,
    authRefreshToken,
    authRevokeAll
}