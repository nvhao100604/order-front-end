import api from "@/config/api/axios"
import { User } from "@/interfaces"

// Get current user
const getCurrentUser = async (options?: object): Promise<User> => {
    const response = await api.get<User>(
        "/users/me",
        options
    )
    return response.data
}

export const userServices = {
    getCurrentUser
}