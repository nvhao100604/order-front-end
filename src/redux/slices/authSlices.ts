import { USER_STORAGE_KEY } from "@/config"
import { AuthResponse, AuthState, LoginCredentials, RegisterPayload, TokenResponse, UserResponse, UserUpdate } from "@/interfaces"
import { user_services } from "@/services"
import { auth_services } from "@/services/auth.services"
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

// Async thunks
const loginUser = createAsyncThunk<
    AuthResponse,
    LoginCredentials,
    { rejectValue: string }
>('auth/loginUser',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await auth_services.authLogin(credentials)
            if (!response.success || !response.data) {
                return rejectWithValue(response.message || 'Login failed')
            }
            const token: TokenResponse = response.data
            console.log(token)
            console.log(`Bearer ${token.access_token}`)
            const accessToken = token.access_token.trim()
            const userResponse = await user_services.getCurrentUser({
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log("user: ", userResponse)

            if (!userResponse.success || !userResponse.data) {
                return rejectWithValue(response.message || 'User Not Found')
            }

            return {
                access_token: token.access_token,
                token_type: token.token_type,
                user: userResponse.data
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Login failed')
        }
    })

// const fetchCurrentUser = createAsyncThunk<
//     UserResponse,
//     void,
//     { rejectValue: string }
// >(
//     'auth/fetchCurrentUser',
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await user_services.getCurrentUser()

//             if (!response.success || !response.data) {
//                 return rejectWithValue(response.message || 'Failed to fetch user')
//             }

//             return response.data
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user')
//         }
//     }
// )

const registerUser = createAsyncThunk<
    AuthResponse,
    RegisterPayload,
    { rejectValue: string }
>(
    'auth/registerUser',
    async (userData: RegisterPayload, { rejectWithValue }) => {
        try {
            const response = await auth_services.authRegister(userData)

            if (!response.success || !response.data) {
                return rejectWithValue(response.message || 'Registration failed')
            }

            const token: TokenResponse = response.data

            const userResponse = await user_services.getCurrentUser({
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`
                }
            })

            if (!userResponse.success || !userResponse.data) {
                return rejectWithValue(userResponse.message || 'User profile not found')
            }

            return {
                access_token: token.access_token,
                token_type: token.token_type,
                user: userResponse.data
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Registration failed')
        }
    }
)

const refreshToken = createAsyncThunk<
    AuthResponse,
    void,
    { rejectValue: string }
>(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await auth_services.authRefreshToken()

            if (!response.success || !response.data) {
                return rejectWithValue(response.message || 'Token refresh failed')
            }

            const token: TokenResponse = response.data;

            // Sau khi refresh token, lấy lại profile mới nhất (để đồng bộ quyền hạn/role)
            const userResponse = await user_services.getCurrentUser({
                headers: {
                    Authorization: `${token.token_type} ${token.access_token}`
                }
            });

            if (!userResponse.success || !userResponse.data) {
                return rejectWithValue(userResponse.message || 'Failed to sync user')
            }

            return {
                access_token: token.access_token,
                token_type: token.token_type,
                user: userResponse.data
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Token refresh failed')
        }
    });

const updateProfile = createAsyncThunk<
    UserResponse,
    UserUpdate,
    { rejectValue: string }
>(
    'auth/updateProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await user_services.updateProfile(userData)

            if (!response.success || !response.data) {
                return rejectWithValue(response.message || 'Profile update failed')
            }

            return response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Profile update failed')
        }
    });

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
            localStorage.removeItem(USER_STORAGE_KEY)
        },
        clearError: (state) => {
            state.error = null
        },
        initializeAuth: (state) => {
            const userStr = localStorage.getItem(USER_STORAGE_KEY)
            if (userStr) {
                state.user = JSON.parse(userStr)
            }
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
            state.isAuthenticated = true
            state.isLoading = false
        },
        setUser: (state, action: PayloadAction<UserResponse | null>) => {
            state.user = action.payload

            if (action.payload) {
                state.isAuthenticated = true;
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
            } else {
                state.isAuthenticated = false;
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
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
                state.isAuthenticated = true
                state.user = action.payload.user
                state.token = action.payload.access_token
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user))
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
                state.isAuthenticated = true
                state.token = action.payload.access_token
                state.user = action.payload.user
                state.error = null
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user))
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload || 'Registration failed'
            })
            // Refresh token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.access_token
                state.user = action.payload.user
                state.isAuthenticated = true
                state.isLoading = false
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload.user))
            })
            .addCase(refreshToken.rejected, (state) => {
                state.token = null
                state.isAuthenticated = false
                state.isLoading = false
            })
            // Update profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.user = action.payload
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload))
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.error = action.payload || 'Profile update failed'
            })
    },
})

export { loginUser, registerUser, refreshToken, updateProfile }
export const { logout, clearError, initializeAuth, setUser } = authSlice.actions
export default authSlice.reducer