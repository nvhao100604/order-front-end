import api from "@/config/api/axios";
import { AuthResponse, LoginCredentials } from "@/interfaces";

const authLogin = async (credentials: LoginCredentials, option?: object) => {
    const response = await api.post<AuthResponse>('/Login/login', credentials, option)
    // Save token to localStorage
    localStorage.setItem('accessToken', response.data.accessToken)
    // localStorage.setItem('user', JSON.stringify(response.data.user))
    // console.log("check auth: ", response.headers)
    return response.data
}

export const authServices = { authLogin }