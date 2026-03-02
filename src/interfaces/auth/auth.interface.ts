import { UserCreate } from "./user.interface"

export interface User {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
    createdAt?: string
}

export interface AuthState {
    user: User | null
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

export interface AuthResponse {
    user: User
    accessToken: string
    token_type: string
}