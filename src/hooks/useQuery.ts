'use client'
import { Query } from "@/interfaces"
import { useState } from "react"

const useQuery = (initialQuery: Query): [Query, (newQuery: Query) => void, () => void] => {
    const [query, setQuery] = useState(initialQuery)

    const updateQuery = (newQuery: Query) => {
        setQuery((prevQuery: Query) => ({
            ...prevQuery,
            ...newQuery
        })
        )
    }

    const resetQuery = () => {
        setQuery(initialQuery)
    }

    return [query, updateQuery, resetQuery]
}

export default useQuery