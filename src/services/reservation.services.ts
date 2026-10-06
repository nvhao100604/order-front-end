import api from "@/config/api/axios"
import { RESERVATION_KEY } from "@/config/constants/api"
import {
    IResponse,
    IReservationPayload,
    IReservationResponse,
    IReservationUpdatePayload,
    IReservationFilter,
    Query
} from "@/interfaces"
import { convertToParams } from "@/utils"
import { AxiosRequestConfig } from "axios"

// 1. Create reservation (Public)
const createPublicReservation = async (
    payload: IReservationPayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}`,
        payload,
        options
    )
    return response.data
}

// 2. Create reservation for logged-in user
const createMeReservation = async (
    payload: IReservationPayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/me`,
        payload,
        options
    )
    return response.data
}

// 3. Get reservation list (with filter & pagination)
const getReservations = async (
    query?: Query<IReservationFilter>,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse[]>> => {
    const queryString = query ? `${RESERVATION_KEY}?${convertToParams(query)}` : `${RESERVATION_KEY}`
    const response = await api.get<IResponse<IReservationResponse[]>>(
        queryString,
        options
    )
    return response.data
}

// 4. Get single reservation details
const getReservationById = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.get<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        options
    )
    return response.data
}

// 5. Update reservation / Confirm / Assign table
const updateReservation = async (
    id: number,
    payload: IReservationUpdatePayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.patch<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        payload,
        options
    )
    return response.data
}

// 6. Cancel reservation
const cancelReservation = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}/cancel`,
        {},
        options
    )
    return response.data
}

// 7. Delete reservation (Admin only)
const deleteReservation = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.delete<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        options
    )
    return response.data
}

export const reservation_services = {
    createPublicReservation,
    createMeReservation,
    getReservations,
    getReservationById,
    updateReservation,
    cancelReservation,
    deleteReservation
}
