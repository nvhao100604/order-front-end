'use client'
import { useAppDispatch } from "@/redux/hooks";
import {
    setSelectedTableId,
    toggleMergingMode,
    setMergeSourceId,
    setStaffActiveCategory,
    updateLocalOrderStatus,
    clearTableAfterCheckout,
    setTables,
    setStaffOrders,
} from "@/redux/slices/staffSlice";
import { IOrderResponse, OrderStatus, IOrderFilter, ITableResponse } from "@/interfaces";
import { useEffect } from "react";

const useFetchOrders = (filter: IOrderFilter) => {
    const dispatch = useAppDispatch()

    const getOrders = async (filter: IOrderFilter) => {
        // try {
        //     const result = await dispatch(fetchOrders(filter)).unwrap()
        //     return result
        // } catch (error) {
        //     console.log("❌ Fetch orders error:", error)
        // }
    }

    useEffect(() => {
        getOrders(filter)
    }, [filter])

    return getOrders
}

const useSelectTable = () => {
    const dispatch = useAppDispatch();
    const selectTable = (tableId: number | null) => dispatch(setSelectedTableId(tableId));
    return selectTable;
};

const useTableMergeControl = () => {
    const dispatch = useAppDispatch();

    const handleToggleMerging = () => dispatch(toggleMergingMode());

    const selectSourceTable = (tableId: number | null) => dispatch(setMergeSourceId(tableId));

    return { handleToggleMerging, selectSourceTable };
};

const useSetStaffCategory = () => {
    const dispatch = useAppDispatch();
    const setCategory = (categoryId: number | null) => dispatch(setStaffActiveCategory(categoryId));
    return setCategory;
};

const useUpdateStaffOrder = () => {
    const dispatch = useAppDispatch();

    const changeStatus = (id: number, status: OrderStatus) => {
        dispatch(updateLocalOrderStatus({ id, status }));
    };

    return changeStatus;
};

const useTableCheckout = () => {
    const dispatch = useAppDispatch();
    const finalizeCheckout = (tableId: number) => dispatch(clearTableAfterCheckout(tableId));
    return finalizeCheckout;
};

const useSyncStaffData = () => {
    const dispatch = useAppDispatch();

    const syncTables = (tables: ITableResponse[]) => dispatch(setTables(tables));
    const syncOrders = (orders: IOrderResponse[]) => dispatch(setStaffOrders(orders));

    return { syncTables, syncOrders };
};

export {
    useFetchOrders,
    useSelectTable,
    useTableMergeControl,
    useSetStaffCategory,
    useUpdateStaffOrder,
    useTableCheckout,
    useSyncStaffData
};