'use client'
import { useSWRConfig } from "swr";

const useRefresh = () => {
    const { mutate } = useSWRConfig();

    const refresh = (resource: string) => {
        const keyPrefix = resource
        //  === 'orders' ? ORDER_KEY : TABLE_KEY;
        // Tìm và làm mới tất cả key có tiền tố này

        mutate(
            (key) => {
                const match = Array.isArray(key) ? key[0] === keyPrefix : String(key).includes(keyPrefix);
                return match;
            },
            undefined,
            { revalidate: true }
        );
    };

    return refresh;
};

export default useRefresh