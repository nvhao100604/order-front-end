'use client'

import { LoginCredentials, RegisterPayload } from "@/interfaces"
import { UserUpdate } from "@/interfaces/user.interface"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { initializeAuth, loginUser, logout, refreshToken, registerUser, setUser, updateProfile } from "@/redux/slices/authSlices";
import { useEffect } from "react";
import { useCurrentUser } from "../useUser";

import { useSWRConfig } from "swr";

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
    const { mutate: globalMutate } = useSWRConfig()
    const { user, token, isAuthenticated, isLoading: reduxIsLoading } = useAppSelector(state => state.auth)

    const { data: swrData, mutate, isValidating, error: swrError } = useCurrentUser(
        token ? config : null
    )

    useEffect(() => {
        if (swrData?.success && swrData.data) {
            dispatch(setUser(swrData.data))
        }
    }, [swrData, dispatch])

    const handleLogout = () => {
        dispatch(logout())
        mutate(undefined, false)
        globalMutate(() => true, undefined, { revalidate: false })
    }
    const login = (credentials: LoginCredentials) => dispatch(loginUser(credentials)).unwrap()
    const register = (payload: RegisterPayload) => dispatch(registerUser(payload)).unwrap()
    const refresh = () => dispatch(refreshToken()).unwrap()
    const update = (data: UserUpdate) => dispatch(updateProfile(data)).unwrap()
    const initialize = () => dispatch(initializeAuth())

    const activeUser = (swrData?.data && user && swrData.data.id === user.id)
        ? swrData.data
        : (user || swrData?.data || null)

    return {
        // Data & State
        user: activeUser,
        token,
        isAuthenticated,
        isLoading: reduxIsLoading,
        isValidating,
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