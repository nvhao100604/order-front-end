import { Status } from "./enum"

export interface UserBase {
    username: string
    name: string
    email: string
    phoneNumber: string
    address?: string
    status: Status
}

export interface UserCreate extends UserBase {
    password: string
    roleID?: number
}

export interface UserUpdate {
    name?: string
    email?: string
    phoneNumber?: string
    address?: string
    status?: Status
}

export interface UserResponse extends UserBase {
    id: number
    roleID?: number
    createdAt: string
    updatedAt: string
}

export interface UserFilter extends UserUpdate { }