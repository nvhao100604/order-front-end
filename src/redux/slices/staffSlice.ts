import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrderResponse, OrderStatus, IOrderFilter, ITableResponse } from '@/interfaces';
import {
    HiOutlineChartBar,
    HiOutlineClipboardDocumentList,
    HiOutlineCog6Tooth
} from "react-icons/hi2";
import { orders_services } from '@/services';

// Định nghĩa các Tab dành cho nhân viên
export const STAFF_TABS = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: HiOutlineChartBar
    },
    {
        id: 'order',
        label: 'Order',
        icon: HiOutlineClipboardDocumentList
    },
    {
        id: 'manage',
        label: 'Manage',
        icon: HiOutlineCog6Tooth
    },
] as const;

// Xuất type để các Staff Hooks có thể import sử dụng
export type StaffTab = typeof STAFF_TABS[number]['id'];

interface IStaffState {
    selectedTableId: number | null;
    activeCategory: number | null;
    mergingMode: boolean;
    mergeSourceId: number | null;
    tables: ITableResponse[];
    orders: IOrderResponse[];
    isLoading: boolean;
    error: string;
}

const initialState: IStaffState = {
    selectedTableId: null,
    activeCategory: null,
    mergingMode: false,
    mergeSourceId: null,
    tables: [],
    orders: [],
    isLoading: false,
    error: ""
};

// const fetchOrders = createAsyncThunk<
//     IOrderResponse[],
//     IOrderFilter,
//     { rejectValue: string }
// >(
//     'staff/fetchOrders',
//     async (filter, { rejectWithValue }) => {
//         try {
//             const response = await orders_services.getOrders(filter || {})
//             if (!response.success || !response.data) {
//                 return rejectWithValue(response.message || 'Failed to fetch orders')
//             }
//             return response.data
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data?.detail || 'Failed to fetch orders')
//         }
//     }
// )

export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        // Cập nhật danh sách bàn từ API
        setTables: (state, action: PayloadAction<ITableResponse[]>) => {
            state.tables = action.payload;
        },

        // Chọn bàn cụ thể để thực hiện Order
        setSelectedTableId: (state, action: PayloadAction<number | null>) => {
            state.selectedTableId = action.payload;
        },

        // Bật/Tắt chế độ gộp bàn
        toggleMergingMode: (state) => {
            state.mergingMode = !state.mergingMode;
            if (!state.mergingMode) state.mergeSourceId = null;
        },

        // Ghi nhớ bàn nguồn khi thực hiện gộp bàn
        setMergeSourceId: (state, action: PayloadAction<number | null>) => {
            state.mergeSourceId = action.payload;
        },

        // Lọc món ăn theo danh mục trong tab Order
        setStaffActiveCategory: (state, action: PayloadAction<number | null>) => {
            state.activeCategory = action.payload;
        },

        // Cập nhật danh sách đơn hàng cho tab Manage
        setStaffOrders: (state, action: PayloadAction<IOrderResponse[]>) => {
            state.orders = action.payload;
        },

        // Cập nhật trạng thái đơn hàng cục bộ (Local Update)
        updateLocalOrderStatus: (state, action: PayloadAction<{ id: number, status: OrderStatus }>) => {
            const order = state.orders.find(o => o.id === action.payload.id);
            if (order) {
                order.status = action.payload.status;
            }
        },

        // Reset trạng thái bàn về FREE sau khi khách thanh toán
        clearTableAfterCheckout: (state, action: PayloadAction<number>) => {
            const table = state.tables.find(t => t.id === action.payload);
            if (table) {
                table.status = 'FREE'; // Khớp với TableStatus: "FREE" | "OCCUPIED" | "RESERVED"
            }
        }
    },
    extraReducers: (builder) => {
        //     builder
        //         .addCase(fetchOrders.pending, (state) => {
        //             state.isLoading = true
        //             state.error = ""
        //         })
        //         .addCase(fetchOrders.fulfilled, (state, action) => {
        //             state.isLoading = false
        //             state.orders = action.payload
        //             state.error = ""
        //         })
        //         .addCase(fetchOrders.rejected, (state, action) => {
        //             state.isLoading = false
        //             state.error = action.payload || 'Failed to fetch orders'
        //         })
    }
});

// export { fetchOrders }
export const {
    setTables,
    setSelectedTableId,
    toggleMergingMode,
    setMergeSourceId,
    setStaffActiveCategory,
    setStaffOrders,
    updateLocalOrderStatus,
    clearTableAfterCheckout
} = staffSlice.actions;

export default staffSlice.reducer;