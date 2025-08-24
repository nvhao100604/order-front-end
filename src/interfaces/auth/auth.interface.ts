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
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    user: User
    token: string
    message: string
}