import { USER_KEY } from "@/config"
import api from "@/config/api/axios"
import { useFetchSWR } from "@/hooks"
import { IResponse } from "@/interfaces"
import { UserResponse } from "@/interfaces/user.interface"
import { SWRResponse } from "swr"

// Get current user
const getCurrentUser = async (
    options?: object
): Promise<IResponse<UserResponse>> => {
    const response = await api.get<IResponse<UserResponse>>(
        `${USER_KEY}/me`,
        options
    )
    return response.data
}

const getCurrentUserSWR = (
    config?: object
): SWRResponse<IResponse<UserResponse>> => {
    const { data, ...rest } = useFetchSWR(
        `${USER_KEY}/me`,
        undefined,
        config
    )

    return {
        data: data as IResponse<UserResponse>,
        ...rest
    }
}

// Update user profile
const updateProfile = async (
    options?: object
): Promise<IResponse<UserResponse>> => {
    const response = await api.post<IResponse<UserResponse>>(
        `${USER_KEY}`,
        options
    )
    return response.data
}

export const user_services = {
    getCurrentUser,
    updateProfile,
    getCurrentUserSWR
}