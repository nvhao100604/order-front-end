import useFetchSWR from "./useFetchSWR";
import { RESERVATION_KEY } from "@/config/constants/api";
import { IReservationFilter, Query } from "@/interfaces";

export const useGetReservations = (query?: Query<IReservationFilter>, option?: object) => {
    return useFetchSWR(RESERVATION_KEY, query, option);
};

export const useGetReservation = (id: number | null, option?: object) => {
    return useFetchSWR(id ? `${RESERVATION_KEY}/${id}` : null, undefined, option);
};
