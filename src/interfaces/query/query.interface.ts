export interface Query {
    [key: string]: string | number | undefined,
    id?: string,
    limit?: number,
    offset?: number,
    keyword?: string,
    typeID?: number
}

export const defaultQuery: Query = {
    limit: 12,
    offset: 0
} 
