import { ReactNode } from "react"
import { SWRConfig } from "swr"

const SWRProvider = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <SWRConfig
                value={{
                    revalidateOnFocus: false,
                    dedupingInterval: 10000,
                }}
            >
                {children}
            </SWRConfig>
        </>
    )
}

export default SWRProvider