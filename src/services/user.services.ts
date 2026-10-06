import { USER_KEY } from "@/config/constants/api"
import api from "@/config/api/axios"
import { IResponse } from "@/interfaces"
import { UserResponse, UserUpdate } from "@/interfaces/user.interface"
import { AxiosRequestConfig } from "axios"
import { SWRResponse } from "swr"

// Get current user
const getCurrentUser = async (
    options?: AxiosRequestConfig
): Promise<IResponse<UserResponse>> => {
    const response = await api.get<IResponse<UserResponse>>(
        `${USER_KEY}/me`,
        options
    )
    return response.data
}

// const getCurrentUserSWR = (
//     config?: AxiosRequestConfig | null
// ): SWRResponse<IResponse<UserResponse>> => {
//     const { data, ...rest } = useFetchSWR(
//         config === null ? null : `${USER_KEY}/me`,
//         undefined,
//         config ?? undefined
//     )

//     return {
//         data: data as IResponse<UserResponse>,
//         ...rest
//     }
// }

// Update user profile
const updateProfile = async (
    payload: UserUpdate,
    options?: AxiosRequestConfig
): Promise<IResponse<UserResponse>> => {
    const response = await api.put<IResponse<UserResponse>>(
        `${USER_KEY}/me`,
        payload,
        options
    )
    return response.data
}

export const user_services = {
    getCurrentUser,
    updateProfile,
    // getCurrentUserSWR
}