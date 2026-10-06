export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface IReservationPayload {
    fullName: string
    email: string
    phoneNumber: string
    numberOfGuests: number
    reservationTime: string // ISO 8601 UTC string (e.g., "2026-10-10T19:00:00Z")
    specialRequests?: string
}

export interface IReservationUpdatePayload {
    fullName?: string
    email?: string
    phoneNumber?: string
    numberOfGuests?: number
    reservationTime?: string
    specialRequests?: string
    status?: ReservationStatus
    tableID?: number | null
}

export interface IReservationResponse {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    numberOfGuests: number
    reservationTime: string
    specialRequests: string | null
    status: ReservationStatus
    userID: number | null
    tableID: number | null
    createdAt: string
    updatedAt: string
}

export interface IReservationFilter {
    page?: number
    limit?: number
    status?: ReservationStatus
    email?: string
    phoneNumber?: string
    startDate?: string
    endDate?: string
}
