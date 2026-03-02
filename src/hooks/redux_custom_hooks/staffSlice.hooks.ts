import { useAppDispatch } from "@/redux/hooks";
import {
    setActiveTab,
    setSelectedTableId,
    toggleMergingMode,
    setMergeSourceId,
    setStaffActiveCategory,
    updateLocalOrderStatus,
    clearTableAfterCheckout,
    StaffTab,
    setTables,
    setStaffOrders
} from "@/redux/slices/staffSlice";
import { ITable, IOrderResponse, OrderStatus } from "@/interfaces";

const useSetStaffTab = () => {
    const dispatch = useAppDispatch();
    const setTab = (tab: StaffTab) => dispatch(setActiveTab(tab));
    return setTab;
};

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

    const syncTables = (tables: ITable[]) => dispatch(setTables(tables));
    const syncOrders = (orders: IOrderResponse[]) => dispatch(setStaffOrders(orders));

    return { syncTables, syncOrders };
};

export {
    useSetStaffTab,
    useSelectTable,
    useTableMergeControl,
    useSetStaffCategory,
    useUpdateStaffOrder,
    useTableCheckout,
    useSyncStaffData
};