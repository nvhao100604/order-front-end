export interface Query {
    [key: string]: string | number | undefined,
    id?: string,
    limit?: number,
    page?: number,
    name?: string,
    categoryID?: number
}

export const defaultQuery: Query = {
    limit: 8,
    page: 1
} 
