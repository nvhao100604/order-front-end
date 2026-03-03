export type Query<T = object> = T & {
    limit?: number;
    page?: number;
    [key: string]: any;
};

export const defaultQuery: Query = {
    limit: 8,
    page: 1
};