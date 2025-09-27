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

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    username: string | User
    accessToken: string
    expriseIn: number
}