import { defaultQuery, Query } from "@/interfaces";

const handleQuery = (query?: Query) => {
    const newQuery = query ?? defaultQuery;
    Object.keys(newQuery).forEach(key => {
        const element = newQuery[key];
        if (element === '' || element === null || element === undefined) {
            delete newQuery[key];
        }
    })
    return newQuery;
}

const convertToParams = (query?: Query) => {
    const handledQuery = handleQuery(query)
    const queryString = new URLSearchParams(handledQuery as any).toString()

    return queryString
}

export default convertToParams