import { UserCreate, UserResponse } from "./user.interface"

export interface AdminData {
    systemHealth: string
    activeUsers: number
    serverLoad: number
}

export interface AuthState {
    user: UserResponse | null
    token: string | null
    isLoading: boolean
    error: string | null
    isAuthenticated: boolean
}

export interface LoginCredentials {
    username: string
    password: string
}

export interface RegisterPayload extends UserCreate { }

export interface TokenResponse {
    access_token: string
    token_type: string
}
export interface AuthResponse extends TokenResponse {
    user: UserResponse
}