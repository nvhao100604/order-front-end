export interface IResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    meta?: IMeta;
}

export interface IMeta {
    total: number;
    page: number;
    limit: number;
}