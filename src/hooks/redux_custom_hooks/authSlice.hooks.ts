import { LoginCredentials, RegisterPayload } from "@/interfaces"
import { UserUpdate } from "@/interfaces/user.interface"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { initializeAuth, loginUser, logout, refreshToken, registerUser, setUser, updateProfile } from "@/redux/slices/authSlices";
import { user_services } from "@/services";
import { useEffect } from "react";

const useAuth = () => {
    const dispatch = useAppDispatch()
    const authState = useAppSelector(state => state.auth)

    const login = (credentials: LoginCredentials) => dispatch(loginUser(credentials)).unwrap()
    const register = (payload: RegisterPayload) => dispatch(registerUser(payload)).unwrap()
    const logoutAction = () => dispatch(logout())
    const refresh = () => dispatch(refreshToken()).unwrap()
    const update = (data: UserUpdate) => dispatch(updateProfile(data)).unwrap()
    const initialize = () => dispatch(initializeAuth())

    return {
        ...authState,
        login,
        register,
        logout: logoutAction,
        refresh,
        updateProfile: update,
        initialize
    }
}

const useEnhancedAuth = (config?: object) => {
    const dispatch = useAppDispatch()
    const { data: swrData, mutate, isValidating, error: swrError } = user_services.getCurrentUserSWR(config)
    const { user, token, isAuthenticated } = useAppSelector(state => state.auth)

    useEffect(() => {
        if (swrData?.success && swrData.data) {
            dispatch(setUser(swrData.data))
        }
    }, [swrData, dispatch])

    const handleLogout = () => {
        dispatch(logout())
        mutate(undefined, false)
    }
    const login = (credentials: LoginCredentials) => dispatch(loginUser(credentials)).unwrap()
    const register = (payload: RegisterPayload) => dispatch(registerUser(payload)).unwrap()
    const refresh = () => dispatch(refreshToken()).unwrap()
    const update = (data: UserUpdate) => dispatch(updateProfile(data)).unwrap()
    const initialize = () => dispatch(initializeAuth())

    return {
        // Data & State
        user: swrData?.data || user,
        token,
        isAuthenticated,
        isLoading: isValidating,
        error: swrError || null,
        mutate,
        // Actions
        logout: handleLogout,
        login,
        register,
        refresh,
        updateProfile: update,
        initialize
    }
}

export {
    useAuth,
    useEnhancedAuth
}