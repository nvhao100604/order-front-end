'use client'
import { LoginCredentials, RegisterData } from "@/interfaces"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { clearError, initializeAuth, loginUser, logout, registerUser } from "@/redux/slices/authSlices"
import { useEffect } from "react"

const useAuth = () => {
    const dispatch = useAppDispatch()
    const auth = useAppSelector((state) => state.auth)

    useEffect(() => {
        // Initialize auth from localStorage on mount
        dispatch(initializeAuth())
    }, [dispatch])

    const login = async (credentials: LoginCredentials) => {
        const result = await dispatch(loginUser(credentials))
        return loginUser.fulfilled.match(result)
    }

    const register = async (userData: RegisterData) => {
        const result = await dispatch(registerUser(userData))
        return registerUser.fulfilled.match(result)
    }

    const logoutUser = () => {
        dispatch(logout())
    }

    const clearAuthError = () => {
        dispatch(clearError())
    }

    return {
        ...auth,
        login,
        register,
        logout: logoutUser,
        clearError: clearAuthError,
    }
}

export { useAuth }
