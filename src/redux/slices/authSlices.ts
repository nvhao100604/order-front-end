import api from "@/config/api/axios"
import { AuthResponse, AuthState, LoginCredentials, RegisterData, User } from "@/interfaces"
import { authServices } from "@/services/auth/auth.services"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

// Async thunks
const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>('auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authServices.authLogin(credentials)
            return response
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || 'Login failed'
            )
        }
    })

const registerUser = createAsyncThunk<
    AuthResponse,
    RegisterData,
    { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', userData)
        localStorage.setItem('token', response.data.accessToken)
        // localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || 'Registration failed'
        )
    }
})

const refreshToken = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: string }
>('auth/refreshToken', async (_, { rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/refresh')
        localStorage.setItem('token', response.data.accessToken)
        return response.data
    } catch (error: any) {
        return rejectWithValue('Token refresh failed')
    }
})

const updateProfile = createAsyncThunk<
    User,
    Partial<User>,
    { rejectValue: string }
>('auth/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.put<{ user: User }>('/auth/profile', userData)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data.user
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || 'Profile update failed'
        )
    }
})

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.error = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        },
        clearError: (state) => {
            state.error = null
        },
        initializeAuth: (state) => {
            const token = localStorage.getItem('token')
            // const userStr = localStorage.getItem('user')

            if (token) {
                try {
                    // const user = JSON.parse(userStr)
                    state.token = token
                    // state.user = user
                    state.isAuthenticated = true
                } catch (error) {
                    // Invalid stored data, clear it
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                // state.user = action.payload.user
                state.token = action.payload.accessToken
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Login failed'
                state.isAuthenticated = false
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                // state.user = action.payload.user
                state.token = action.payload.accessToken
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Registration failed'
            })
            // Refresh token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.accessToken
                // state.user = action.payload.user
                state.isAuthenticated = true
            })
            // Update profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload || 'Profile update failed'
            })
    },
})

export { loginUser, registerUser, refreshToken, updateProfile }
export const { logout, clearError, initializeAuth } = authSlice.actions
export default authSlice.reducer