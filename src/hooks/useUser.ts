// @/hooks/useUser.ts
import useFetchSWR from "./useFetchSWR";
import { USER_KEY } from "@/config/constants/api";

export const useCurrentUser = (config?: any) => {
    return useFetchSWR(config === null ? null : `${USER_KEY}/me`, undefined, config);
};