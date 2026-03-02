import api from "@/config/api/axios"
import { AuthResponse, AuthState, LoginCredentials, RegisterData, User } from "@/interfaces"
import { authServices } from "@/services/auth/auth.services"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

// Async thunks
const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>('auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            // 1. Lấy token từ API Login
            const response = await authServices.authLogin(credentials);
            const token = response.accessToken;

            // 2. Gọi API /me bằng cách truyền token vào Header thủ công
            // Vì lúc này token chưa có trong state hay localStorage để Interceptor tự lấy
            const userResponse = await api.get<User>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 3. Trả về cả 2 để extraReducers cập nhật vào biến (state)
            return {
                accessToken: token,
                user: userResponse.data
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    })

const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
    'auth/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<User>('/user/me');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

const registerUser = createAsyncThunk<
    AuthResponse,
    RegisterData,
    { rejectValue: string }
>('auth/registerUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await api.post<AuthResponse>('/auth/register', userData)
        // localStorage.setItem('token', response.data.accessToken)
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
        // localStorage.setItem('token', response.data.accessToken)
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
        // localStorage.setItem('user', JSON.stringify(response.data.user))
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
            // Không đọc token từ localStorage nữa
            // Chúng ta chỉ load thông tin user cơ bản (nếu muốn hiện UI nhanh)
            const userStr = localStorage.getItem('user');
            if (userStr) {
                state.user = JSON.parse(userStr);
            }
            // isLoading vẫn để true để chờ kết quả từ Silent Refresh
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
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
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                localStorage.setItem('user', JSON.stringify(action.payload.user));
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
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
                state.isLoading = false;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.isLoading = false;
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

export { loginUser, fetchCurrentUser, registerUser, refreshToken, updateProfile }
export const { logout, clearError, initializeAuth } = authSlice.actions
export default authSlice.reducer