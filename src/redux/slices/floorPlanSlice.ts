import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFloorItemPayload } from '@/interfaces';

export interface FloorPlanState {
    areaId: number | null;
    layoutVersion: number;
    serverItems: IFloorItemPayload[];
    draftItems: IFloorItemPayload[];
    isDirty: boolean;
    isSaving: boolean;
    saveError: string | null;
    selectedIndex: number | null;
}

const initialState: FloorPlanState = {
    areaId: null,
    layoutVersion: 1,
    serverItems: [],
    draftItems: [],
    isDirty: false,
    isSaving: false,
    saveError: null,
    selectedIndex: null,
};

export const floorPlanSlice = createSlice({
    name: 'floorPlan',
    initialState,
    reducers: {
        loadLayout: (
            state,
            action: PayloadAction<{
                areaId: number;
                layoutVersion: number;
                items: IFloorItemPayload[];
            }>
        ) => {
            state.areaId = action.payload.areaId;
            state.layoutVersion = action.payload.layoutVersion;
            state.serverItems = action.payload.items;
            state.draftItems = action.payload.items;
            state.isDirty = false;
            state.saveError = null;
            state.selectedIndex = null;
        },

        moveDraftItem: (
            state,
            action: PayloadAction<{ index: number; x: number; y: number }>
        ) => {
            const { index, x, y } = action.payload;
            if (state.draftItems[index]) {
                state.draftItems[index].x = x;
                state.draftItems[index].y = y;
                state.isDirty = true;
            }
        },

        addDraftItem: (state, action: PayloadAction<IFloorItemPayload>) => {
            state.draftItems.push(action.payload);
            state.isDirty = true;
            state.selectedIndex = state.draftItems.length - 1;
        },

        removeDraftItem: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            if (index >= 0 && index < state.draftItems.length) {
                state.draftItems.splice(index, 1);
                state.isDirty = true;
                state.selectedIndex = null;
            }
        },

        rotateDraftItem: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            if (state.draftItems[index]) {
                const current = state.draftItems[index].rotation ?? 0;
                state.draftItems[index].rotation = (current + 90) % 360;
                state.isDirty = true;
            }
        },

        updateDraftItem: (
            state,
            action: PayloadAction<{ index: number; updates: Partial<IFloorItemPayload> }>
        ) => {
            const { index, updates } = action.payload;
            if (state.draftItems[index]) {
                state.draftItems[index] = {
                    ...state.draftItems[index],
                    ...updates,
                };
                state.isDirty = true;
            }
        },

        selectItem: (state, action: PayloadAction<number | null>) => {
            state.selectedIndex = action.payload;
        },

        resetDraft: (state) => {
            state.draftItems = [...state.serverItems];
            state.isDirty = false;
            state.selectedIndex = null;
            state.saveError = null;
        },

        setSaving: (state, action: PayloadAction<boolean>) => {
            state.isSaving = action.payload;
        },

        commitSaveSuccess: (
            state,
            action: PayloadAction<{ layoutVersion?: number; items?: IFloorItemPayload[] } | undefined>
        ) => {
            if (action.payload?.layoutVersion !== undefined) {
                state.layoutVersion = action.payload.layoutVersion;
            }
            if (action.payload?.items) {
                state.serverItems = action.payload.items;
                state.draftItems = action.payload.items;
            } else {
                state.serverItems = [...state.draftItems];
            }
            state.isDirty = false;
            state.saveError = null;
        },

        setSaveError: (state, action: PayloadAction<string | null>) => {
            state.saveError = action.payload;
        },
    },
});

export const {
    loadLayout,
    moveDraftItem,
    addDraftItem,
    removeDraftItem,
    rotateDraftItem,
    updateDraftItem,
    selectItem,
    resetDraft,
    setSaving,
    commitSaveSuccess,
    setSaveError,
} = floorPlanSlice.actions;

export default floorPlanSlice.reducer;
