import api from "@/config/api/axios"
import { Query } from "@/interfaces"
import { convertToParams } from "@/utils"

const useFetchSWR = (path: string, query?: Query, config?: object) => {
    const queryString = convertToParams(query)
    // console.log(queryString)
    const pathString = `${path}?${queryString}`
    const response = api.get(pathString, config)

    return response
}

export default useFetchSWR