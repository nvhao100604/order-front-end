# POS Table Map & Reservation API Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect the POS Table Map interface (`/staff/table-map`) with live backend APIs (Tables, Areas, Layout, Reservations, and Table Ops), enabling real-time table booking, recommendation, assignment, check-in, and table opening.

**Architecture:** Implement domain services under `src/services/` for Areas and Table Ops, create a central data hook `useTableMapData` managing SWR fetching, background polling, and cache revalidation, and wire all UI components (`NewReservationDrawer`, `UpcomingReservations`, `TableActionPopover`, `FloorPlanCanvas`) to live handlers.

**Tech Stack:** Next.js 15 (App Router), TypeScript, SWR, Axios, React Toastify, Tailwind CSS.

**Spec:** `docs/superpowers/specs/2026-10-10-pos-table-map-api-integration-design.md`

## Global Constraints
- Connect strictly to existing FastAPI backend endpoints (`/areas`, `/tables`, `/reservations`).
- Maintain existing visual aesthetic (Figma v2 Warm Light theme: `#FBF5E4`, `#FFFDF7`, `#1F2535`, `#F25C14`).
- Use SWR for server cache with revalidation via `mutate`.
- All user-facing mutation operations must show `react-toastify` alerts (success/error).
- Phone numbers must adhere to 10-digit pattern (`^\d{10}$`).

---

### Task 1: Area Interfaces, API Constants, and Area Services

**Files:**
- Create: `src/interfaces/area.interface.ts`
- Modify: `src/interfaces/index.ts`
- Modify: `src/config/constants/api.ts:50-55`
- Create: `src/services/area.services.ts`

**Interfaces:**
- Consumes: None
- Produces: `IArea`, `IAreaLayout`, `IFloorItem`, `area_services.getAreas`, `area_services.getAreaLayout`

- [ ] **Step 1: Create Area interfaces**

Write `src/interfaces/area.interface.ts`:
```typescript
import { TableShape } from "./enum";
import { ITableResponse } from "./ordering.interface";

export type FloorItemKind = "TABLE" | "OBSTACLE" | "WALL";

export interface IFloorItem {
    id: number;
    areaID: number;
    tableId?: number | null;
    kind: FloorItemKind;
    shape?: TableShape | null;
    x: number;
    y: number;
    w: number;
    h: number;
    rotation?: number;
}

export interface IArea {
    id: number;
    name: string;
    gridW: number;
    gridH: number;
    layoutVersion: number;
}

export interface IAreaLayoutResponse extends IArea {
    items: IFloorItem[];
    tables: ITableResponse[];
}
```

- [ ] **Step 2: Export Area interfaces in `src/interfaces/index.ts`**

Add export in `src/interfaces/index.ts`:
```typescript
export * from './area.interface'
```

- [ ] **Step 3: Add `AREA_KEY` to `src/config/constants/api.ts`**

Add to `src/config/constants/api.ts`:
```typescript
export const AREA_KEY = "areas"
```

- [ ] **Step 4: Create Area service `src/services/area.services.ts`**

Write `src/services/area.services.ts`:
```typescript
import api from "@/config/api/axios";
import { AREA_KEY } from "@/config/constants/api";
import { IArea, IAreaLayoutResponse, IResponse } from "@/interfaces";
import { AxiosRequestConfig } from "axios";

const getAreas = async (options?: AxiosRequestConfig): Promise<IResponse<IArea[]>> => {
    const response = await api.get<IResponse<IArea[]>>(`${AREA_KEY}`, options);
    return response.data;
};

const getAreaLayout = async (areaId: number, options?: AxiosRequestConfig): Promise<IResponse<IAreaLayoutResponse>> => {
    const response = await api.get<IResponse<IAreaLayoutResponse>>(`${AREA_KEY}/${areaId}/layout`, options);
    return response.data;
};

export const area_services = {
    getAreas,
    getAreaLayout,
};
```

- [ ] **Step 5: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/interfaces/area.interface.ts src/interfaces/index.ts src/config/constants/api.ts src/services/area.services.ts
git commit -m "feat(api): add area interfaces and service client"
```

---

### Task 2: Enhance Table Services with Table Ops & Recommendation

**Files:**
- Modify: `src/services/table.services.ts`

**Interfaces:**
- Consumes: `TABLE_KEY`, `ITableResponse`, `IResponse`
- Produces: `tables_services.openTable`, `tables_services.recommendTables`, `tables_services.mergeTables`, `tables_services.closeTable`

- [ ] **Step 1: Add table operations & recommendation methods to `table.services.ts`**

Update `src/services/table.services.ts`:
```typescript
import { TABLE_KEY } from "@/config/constants/api";
import { Query } from '../interfaces/query.interface';
import { ITableFilter, ITableResponse, IResponse, ITableUpdate, TableStatus } from "@/interfaces";
import api from "@/config/api/axios";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";
import useFetchSWR from "@/hooks/useFetchSWR";

const getTables = async (query?: Query<ITableFilter>, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const queryString = query ? `${TABLE_KEY}?${convertToParams(query)}` : `${TABLE_KEY}`;
    const response = await api.get<IResponse<ITableResponse[]>>(queryString, option);
    return response.data;
};

const getTable = (id: number, option?: object) => {
    const { data, isLoading, error } = useFetchSWR(`${TABLE_KEY}/${id}`, undefined, option);
    return { data, isLoading, error };
};

const updateTableStatus = async (id: number, statusData: TableStatus, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}/status`, statusData, option);
    return response.data;
};

const updateTable = async (id: number, tableData: ITableUpdate, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.patch(`${TABLE_KEY}/${id}`, tableData, option);
    return response.data;
};

const openTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post(`${TABLE_KEY}/${id}/open`, {}, option);
    return response.data;
};

const closeTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.post(`${TABLE_KEY}/${id}/close`, {}, option);
    return response.data;
};

const recommendTables = async (guests: number, areaId?: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const params: Record<string, any> = { guests };
    if (areaId) params.areaID = areaId;
    const response = await api.get<IResponse<ITableResponse[]>>(`${TABLE_KEY}/recommend?${convertToParams(params)}`, option);
    return response.data;
};

const mergeTables = async (tableIDs: number[], option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse[]>> => {
    const response = await api.post(`${TABLE_KEY}/merge`, { tableIDs }, option);
    return response.data;
};

const deleteTable = async (id: number, option?: AxiosRequestConfig)
    : Promise<IResponse<ITableResponse>> => {
    const response = await api.delete(`${TABLE_KEY}/${id}`, option);
    return response.data;
};

export const tables_services = {
    getTables,
    getTable,
    updateTableStatus,
    updateTable,
    openTable,
    closeTable,
    recommendTables,
    mergeTables,
    deleteTable
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/services/table.services.ts
git commit -m "feat(api): add table operations and recommendation methods to table services"
```

---

### Task 3: Enhance Reservation Services with Check-in & Table Assignment

**Files:**
- Modify: `src/services/reservation.services.ts`

**Interfaces:**
- Consumes: `RESERVATION_KEY`, `IReservationPayload`, `IReservationResponse`
- Produces: `reservation_services.checkinReservation`, `reservation_services.assignTable`

- [ ] **Step 1: Add `checkinReservation` and `assignTable` in `reservation.services.ts`**

Update `src/services/reservation.services.ts`:
```typescript
import api from "@/config/api/axios";
import { RESERVATION_KEY } from "@/config/constants/api";
import {
    IResponse,
    IReservationPayload,
    IReservationResponse,
    IReservationUpdatePayload,
    IReservationFilter,
    Query
} from "@/interfaces";
import { convertToParams } from "@/utils";
import { AxiosRequestConfig } from "axios";

// 1. Create reservation (Public)
const createPublicReservation = async (
    payload: IReservationPayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}`,
        payload,
        options
    );
    return response.data;
};

// 2. Create reservation for logged-in user
const createMeReservation = async (
    payload: IReservationPayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/me`,
        payload,
        options
    );
    return response.data;
};

// 3. Get reservation list (with filter & pagination)
const getReservations = async (
    query?: Query<IReservationFilter>,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse[]>> => {
    const queryString = query ? `${RESERVATION_KEY}?${convertToParams(query)}` : `${RESERVATION_KEY}`;
    const response = await api.get<IResponse<IReservationResponse[]>>(
        queryString,
        options
    );
    return response.data;
};

// 4. Get single reservation details
const getReservationById = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.get<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        options
    );
    return response.data;
};

// 5. Update reservation / Confirm / Assign table
const updateReservation = async (
    id: number,
    payload: IReservationUpdatePayload,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.patch<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        payload,
        options
    );
    return response.data;
};

// 6. Assign table to reservation
const assignTable = async (
    id: number,
    tableId: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    return updateReservation(id, { tableID: tableId, status: 'CONFIRMED' }, options);
};

// 7. Check-in reservation
const checkinReservation = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<{ reservationID: number; orderID?: number | null; tableIDs: number[] }>> => {
    const response = await api.post<IResponse<{ reservationID: number; orderID?: number | null; tableIDs: number[] }>>(
        `${RESERVATION_KEY}/${id}/checkin`,
        {},
        options
    );
    return response.data;
};

// 8. Cancel reservation
const cancelReservation = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.post<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}/cancel`,
        {},
        options
    );
    return response.data;
};

// 9. Delete reservation (Admin only)
const deleteReservation = async (
    id: number,
    options?: AxiosRequestConfig
): Promise<IResponse<IReservationResponse>> => {
    const response = await api.delete<IResponse<IReservationResponse>>(
        `${RESERVATION_KEY}/${id}`,
        options
    );
    return response.data;
};

export const reservation_services = {
    createPublicReservation,
    createMeReservation,
    getReservations,
    getReservationById,
    updateReservation,
    assignTable,
    checkinReservation,
    cancelReservation,
    deleteReservation
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/services/reservation.services.ts
git commit -m "feat(api): add checkinReservation and assignTable to reservation services"
```

---

### Task 4: Table Map Layout Configuration & Data Merger

**Files:**
- Create: `src/config/tableMapLayout.ts`

**Interfaces:**
- Consumes: `POSTable`, `ITableResponse`, `TableArea`, `TableShape`
- Produces: `DEFAULT_AREAS`, `mapBackendTablesToPOSTables`

- [ ] **Step 1: Write `src/config/tableMapLayout.ts`**

```typescript
import { POSTable, TableArea, TableShape } from "@/types/posTableMap";
import { ITableResponse } from "@/interfaces";

export const DEFAULT_AREAS: TableArea[] = ['Floor 1', 'Garden', 'VIP Room', 'Bar Area'];

// Preconfigured coordinate layout for standard restaurant layout
interface TableLayoutSlot {
  shape: TableShape;
  area: TableArea;
  x: number;
  y: number;
  width: number;
  height: number;
}

const TABLE_LAYOUT_SLOTS: Record<number, TableLayoutSlot> = {
  1: { shape: 'Round', area: 'Floor 1', x: 36, y: 32, width: 96, height: 96 },
  2: { shape: 'Square', area: 'Floor 1', x: 168, y: 32, width: 112, height: 112 },
  3: { shape: 'Square', area: 'Floor 1', x: 308, y: 32, width: 112, height: 112 },
  8: { shape: 'Round', area: 'Floor 1', x: 628, y: 104, width: 96, height: 96 },
  4: { shape: 'Square', area: 'Floor 1', x: 36, y: 212, width: 112, height: 112 },
  5: { shape: 'Square', area: 'Floor 1', x: 160, y: 212, width: 112, height: 112 },
  6: { shape: 'Square', area: 'Floor 1', x: 348, y: 212, width: 112, height: 112 },
  7: { shape: 'Long', area: 'Floor 1', x: 488, y: 212, width: 192, height: 112 },
  9: { shape: 'Round', area: 'Floor 1', x: 36, y: 400, width: 96, height: 96 },
  10: { shape: 'Square', area: 'Floor 1', x: 168, y: 396, width: 112, height: 112 },
  11: { shape: 'Long', area: 'Floor 1', x: 308, y: 396, width: 192, height: 112 },
  12: { shape: 'Long', area: 'Floor 1', x: 524, y: 396, width: 224, height: 112 },
};

/**
 * Merge raw backend tables with visual layout coordinates.
 * Falls back to auto-grid arrangement if a table is not in preset slots.
 */
export function mapBackendTablesToPOSTables(rawTables: ITableResponse[]): POSTable[] {
  return rawTables.map((t, idx) => {
    const slot = TABLE_LAYOUT_SLOTS[t.id] || TABLE_LAYOUT_SLOTS[t.number] || {
      shape: (t.maxCapacity > 4 ? 'Long' : t.maxCapacity === 2 ? 'Round' : 'Square') as TableShape,
      area: 'Floor 1' as TableArea,
      x: 36 + (idx % 4) * 180,
      y: 32 + Math.floor(idx / 4) * 160,
      width: t.maxCapacity > 4 ? 192 : 112,
      height: 112,
    };

    return {
      id: `B${t.id}`,
      name: `B${t.number || t.id}`,
      shape: slot.shape,
      status: t.status as POSTable['status'],
      area: slot.area,
      capacity: t.maxCapacity || 4,
      x: slot.x,
      y: slot.y,
      width: slot.width,
      height: slot.height,
    };
  });
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/config/tableMapLayout.ts
git commit -m "feat(pos): create tableMapLayout mapping and coordinate configuration"
```

---

### Task 5: Central Data Hook `useTableMapData`

**Files:**
- Create: `src/hooks/useTableMapData.ts`

**Interfaces:**
- Consumes: `table_services`, `reservation_services`, `getDashboardTablesSWR`, `useGetReservations`, `POLL_INTERVAL`
- Produces: `useTableMapData` hook returning `tables`, `upcomingReservations`, `areaCounts`, `statusCounts`, `handlers`

- [ ] **Step 1: Write `src/hooks/useTableMapData.ts`**

```typescript
'use client';

import { useState, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { POLL_INTERVAL, TABLE_KEY, RESERVATION_KEY, DASHBOARD_TABLES_KEY } from '@/config/constants/api';
import { getDashboardTablesSWR } from '@/hooks/useDashboard';
import { useGetReservations } from '@/hooks/useReservation';
import { tables_services } from '@/services/table.services';
import { reservation_services } from '@/services/reservation.services';
import { POSTable, TableArea, TableStatus, ReservationItem } from '@/types/posTableMap';
import { mapBackendTablesToPOSTables, DEFAULT_AREAS } from '@/config/tableMapLayout';
import { IReservationPayload, IReservationResponse } from '@/interfaces';

export function useTableMapData() {
  const [activeArea, setActiveArea] = useState<TableArea>('Floor 1');
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'ALL'>('ALL');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // 1. Fetch live tables with background polling
  const { data: tablesRes } = getDashboardTablesSWR(undefined, {
    refreshInterval: POLL_INTERVAL,
    revalidateOnFocus: true,
  });

  // 2. Fetch live reservations
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { data: reservationsRes } = useGetReservations(
    { startDate: todayISO },
    { refreshInterval: POLL_INTERVAL, revalidateOnFocus: true }
  );

  // 3. Map backend tables to canvas POSTables
  const posTables = useMemo<POSTable[]>(() => {
    const raw = tablesRes?.data;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return mapBackendTablesToPOSTables(raw);
  }, [tablesRes]);

  // 4. Map backend reservations to POS ReservationItem
  const upcomingReservations = useMemo<ReservationItem[]>(() => {
    const raw: IReservationResponse[] = reservationsRes?.data || [];
    if (!Array.isArray(raw)) return [];

    const now = new Date();
    return raw
      .filter((r) => r.status === 'PENDING' || r.status === 'CONFIRMED')
      .map((r) => {
        const resTime = new Date(r.reservationTime);
        const diffMinutes = Math.round((resTime.getTime() - now.getTime()) / 60000);
        const isLate = diffMinutes < 0;

        return {
          id: `R${r.id}`,
          customerName: r.fullName,
          phone: r.phoneNumber,
          time: resTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          guestCount: r.numberOfGuests,
          tableId: r.tableID ? `B${r.tableID}` : 'Unassigned',
          status: isLate ? 'LATE' : 'NORMAL',
          lateMinutes: isLate ? Math.abs(diffMinutes) : undefined,
          remainingMinutes: !isLate ? diffMinutes : undefined,
          note: r.specialRequests || undefined,
        };
      });
  }, [reservationsRes]);

  // 5. Dynamic area counts
  const areaCounts = useMemo<Record<TableArea, { available: number; total: number }>>(() => {
    const counts = DEFAULT_AREAS.reduce((acc, area) => {
      acc[area] = { available: 0, total: 0 };
      return acc;
    }, {} as Record<TableArea, { available: number; total: number }>);

    posTables.forEach((t) => {
      if (counts[t.area]) {
        counts[t.area].total += 1;
        if (t.status === 'EMPTY') {
          counts[t.area].available += 1;
        }
      }
    });

    return counts;
  }, [posTables]);

  // 6. Dynamic status counts
  const statusCounts = useMemo<Record<TableStatus | 'ALL', number>>(() => {
    const counts: Record<TableStatus | 'ALL', number> = {
      ALL: posTables.length,
      EMPTY: 0,
      OCCUPIED: 0,
      PAY: 0,
      RESERVED: 0,
      CLEAN: 0,
      LATE: 0,
    };

    posTables.forEach((t) => {
      if (counts[t.status] !== undefined) {
        counts[t.status] += 1;
      }
    });

    return counts;
  }, [posTables]);

  // 7. Filtered tables for active view
  const filteredTables = useMemo<POSTable[]>(() => {
    return posTables.filter((t) => {
      const matchArea = t.area === activeArea;
      const matchFilter = activeFilter === 'ALL' || t.status === activeFilter;
      return matchArea && matchFilter;
    });
  }, [posTables, activeArea, activeFilter]);

  const selectedTable = useMemo<POSTable | null>(() => {
    return posTables.find((t) => t.id === selectedTableId) || posTables[0] || null;
  }, [posTables, selectedTableId]);

  // Revalidate helper
  const revalidateAll = useCallback(() => {
    mutate((key) => typeof key === 'string' && (
      key.includes(TABLE_KEY) || key.includes(RESERVATION_KEY) || key.includes(DASHBOARD_TABLES_KEY)
    ));
  }, []);

  // Handlers
  const handleCreateReservation = useCallback(async (data: {
    guests: number;
    name: string;
    phone: string;
    email?: string;
    note?: string;
    date?: string;
    time?: string;
    selectedTableOption?: string;
  }) => {
    try {
      const numericTableId = data.selectedTableOption?.replace(/\D/g, '') ? Number(data.selectedTableOption.replace(/\D/g, '')) : undefined;
      let reservationISO: string;
      if (data.date && data.time && data.date !== 'Today') {
        reservationISO = new Date(`${data.date}T${data.time}:00.000Z`).toISOString();
      } else {
        const now = new Date();
        const [h, m] = (data.time || '19:00').split(':').map(Number);
        now.setHours(h, m, 0, 0);
        reservationISO = now.toISOString();
      }

      const payload: IReservationPayload = {
        fullName: data.name,
        phoneNumber: data.phone.replace(/\s+/g, ''),
        email: data.email || `guest.${data.phone.replace(/\s+/g, '')}@foodie.local`,
        numberOfGuests: data.guests,
        reservationTime: reservationISO,
        specialRequests: data.note || undefined,
      };

      const res = await reservation_services.createPublicReservation(payload);
      if (res.success || res.data) {
        if (numericTableId && res.data?.id) {
          await reservation_services.assignTable(res.data.id, numericTableId);
        }
        toast.success(`Đặt bàn thành công cho khách ${data.name}!`);
        revalidateAll();
        return true;
      } else {
        toast.error(res.message || 'Không thể tạo đơn đặt bàn.');
        return false;
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi khi tạo đặt bàn.');
      return false;
    }
  }, [revalidateAll]);

  const handleCheckIn = useCallback(async (res: ReservationItem) => {
    const numericId = Number(res.id.replace(/\D/g, ''));
    try {
      const result = await reservation_services.checkinReservation(numericId);
      if (result.success || result.data) {
        toast.success(`✅ Khách ${res.customerName} đã nhận bàn!`);
        if (res.tableId && res.tableId !== 'Unassigned') {
          setSelectedTableId(res.tableId);
        }
        revalidateAll();
      } else {
        toast.error(result.message || 'Check-in không thành công.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi khi check-in.');
    }
  }, [revalidateAll]);

  const handleCancelReservation = useCallback(async (res: ReservationItem) => {
    const numericId = Number(res.id.replace(/\D/g, ''));
    try {
      const result = await reservation_services.cancelReservation(numericId);
      if (result.success || result.data) {
        toast.info(`Đã hủy đặt bàn của khách ${res.customerName}.`);
        revalidateAll();
      } else {
        toast.error(result.message || 'Hủy đặt bàn thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi khi hủy đặt bàn.');
    }
  }, [revalidateAll]);

  const handleAssignTable = useCallback(async (reservationId: number, tableId: number) => {
    try {
      const result = await reservation_services.assignTable(reservationId, tableId);
      if (result.success || result.data) {
        toast.success(`Đã xếp bàn B${tableId} cho đơn đặt bàn!`);
        revalidateAll();
      } else {
        toast.error(result.message || 'Xếp bàn thất bại.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi khi xếp bàn.');
    }
  }, [revalidateAll]);

  const handleOpenTable = useCallback(async (table: POSTable, guests: number) => {
    const numericId = Number(table.id.replace(/\D/g, ''));
    try {
      const result = await tables_services.openTable(numericId);
      if (result.success || result.data) {
        toast.success(`✅ Đã mở bàn ${table.name} cho ${guests} khách!`);
        setSelectedTableId(table.id);
        revalidateAll();
      } else {
        toast.error(result.message || 'Không thể mở bàn.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || 'Lỗi khi mở bàn.');
    }
  }, [revalidateAll]);

  return {
    activeArea,
    setActiveArea,
    activeFilter,
    setActiveFilter,
    selectedTable,
    setSelectedTableId,
    posTables,
    filteredTables,
    upcomingReservations,
    areaCounts,
    statusCounts,
    handleCreateReservation,
    handleCheckIn,
    handleCancelReservation,
    handleAssignTable,
    handleOpenTable,
  };
}
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTableMapData.ts
git commit -m "feat(pos): create useTableMapData state hook with SWR polling and action handlers"
```

---

### Task 6: Connect NewReservationDrawer with Table Recommendation & API Submission

**Files:**
- Modify: `src/components/staff/table-map/NewReservationDrawer.tsx`
- Modify: `src/components/staff/table-map/drawer/DrawerCustomerForm.tsx`

**Interfaces:**
- Consumes: `tables_services.recommendTables`, `useTableMapData.handleCreateReservation`
- Produces: Interactive table options list and validated submission

- [ ] **Step 1: Add email input to `DrawerCustomerForm.tsx`**

Ensure `email` is captured (or optional) in `DrawerCustomerForm.tsx`:
```tsx
'use client';

import React from 'react';

interface DrawerCustomerFormProps {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  email?: string;
  onEmailChange?: (val: string) => void;
  note: string;
  onNoteChange: (val: string) => void;
}

export const DrawerCustomerForm: React.FC<DrawerCustomerFormProps> = ({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  email = '',
  onEmailChange,
  note,
  onNoteChange,
}) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Customer Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Mr. Nam"
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
            Phone *
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="0901 234 567"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange?.(e.target.value)}
            placeholder="client@mail.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
          />
        </div>
      </div>

      <div>
        <label className="text-[11px] font-medium text-[#5F6575] uppercase tracking-wider block mb-1">
          Special Notes
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Allergies, high chair, window seat..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Update `NewReservationDrawer.tsx` to fetch dynamic table recommendations**

Update `src/components/staff/table-map/NewReservationDrawer.tsx`:
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DrawerGuestStepper } from './drawer/DrawerGuestStepper';
import { DrawerHoldWindowBanner } from './drawer/DrawerHoldWindowBanner';
import { DrawerCustomerForm } from './drawer/DrawerCustomerForm';
import { DrawerTableOptionsList, TableOption } from './drawer/DrawerTableOptionsList';
import { DrawerFooterActions } from './drawer/DrawerFooterActions';
import { tables_services } from '@/services/table.services';

interface NewReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    guests: number;
    name: string;
    phone: string;
    email?: string;
    note: string;
    date: string;
    time: string;
    selectedTableOption: string;
  }) => Promise<boolean | void>;
}

export const NewReservationDrawer: React.FC<NewReservationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [guests, setGuests] = useState(4);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('19:30');
  const [selectedTableOption, setSelectedTableOption] = useState<string>('');
  const [tableOptions, setTableOptions] = useState<TableOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recommended tables whenever party size changes
  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        const res = await tables_services.recommendTables(guests);
        if (active && res.data && res.data.length > 0) {
          const mapped: TableOption[] = res.data.map((t, idx) => ({
            id: `B${t.id}`,
            title: `B${t.number || t.id} · ${t.maxCapacity} seats`,
            detail: idx === 0 ? 'Fits well · Recommended' : `Available · Fits up to ${t.maxCapacity}`,
            recommended: idx === 0,
            tag: idx === 0 ? 'Recommended' : undefined,
          }));
          setTableOptions(mapped);
          setSelectedTableOption(mapped[0]?.id || '');
        } else if (active) {
          setTableOptions([]);
          setSelectedTableOption('');
        }
      } catch {
        if (active) {
          setTableOptions([]);
        }
      }
    };

    if (isOpen) {
      fetchRecommendations();
    }
    return () => {
      active = false;
    };
  }, [guests, isOpen]);

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('Vui lòng nhập tên và số điện thoại.');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        guests,
        name,
        phone,
        email,
        note,
        date,
        time,
        selectedTableOption,
      });
      if (success !== false) {
        onClose();
        setName('');
        setPhone('');
        setEmail('');
        setNote('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-[#1F2535]/45 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-[440px] h-full bg-[#FFFDF7] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 font-sans">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#CFC3A6]/30">
            <h2 className="font-serif text-2xl font-bold text-[#1F2535]">New Reservation</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center font-bold hover:bg-[#CFC3A6] cursor-pointer"
            >
              ✕
            </button>
          </div>

          <DrawerGuestStepper
            guests={guests}
            onGuestsChange={setGuests}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
          />

          <DrawerHoldWindowBanner />

          <DrawerCustomerForm
            name={name}
            onNameChange={setName}
            phone={phone}
            onPhoneChange={setPhone}
            email={email}
            onEmailChange={setEmail}
            note={note}
            onNoteChange={setNote}
          />

          <hr className="border-[#CFC3A6]/30 my-2" />

          <DrawerTableOptionsList
            options={tableOptions}
            selectedId={selectedTableOption}
            onSelect={setSelectedTableOption}
          />
        </div>

        <DrawerFooterActions
          onCancel={onClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/staff/table-map/NewReservationDrawer.tsx src/components/staff/table-map/drawer/DrawerCustomerForm.tsx
git commit -m "feat(pos): wire NewReservationDrawer with dynamic recommendations and submission"
```

---

### Task 7: Connect UpcomingReservations with Check-in & Table Assignment Modal

**Files:**
- Modify: `src/components/staff/table-map/UpcomingReservations.tsx`

**Interfaces:**
- Consumes: `ReservationItem`, `onCheckIn`, `onCancel`, `onAssignTable`, `availableTables`
- Produces: Enhanced upcoming reservations list with interactive assignment dialog

- [ ] **Step 1: Enhance `UpcomingReservations.tsx`**

Add table assignment option for unassigned reservations and confirmation for cancel in `src/components/staff/table-map/UpcomingReservations.tsx`:
```tsx
'use client';

import React, { useState } from 'react';
import { ReservationItem, POSTable } from '@/types/posTableMap';

interface UpcomingReservationsProps {
  reservations: ReservationItem[];
  availableTables?: POSTable[];
  onCheckIn: (res: ReservationItem) => void;
  onCallCustomer: (res: ReservationItem) => void;
  onCancel: (res: ReservationItem) => void;
  onAssignTable?: (reservationId: number, tableId: number) => void;
}

export const UpcomingReservations: React.FC<UpcomingReservationsProps> = ({
  reservations,
  availableTables = [],
  onCheckIn,
  onCallCustomer,
  onCancel,
  onAssignTable,
}) => {
  const [assigningRes, setAssigningRes] = useState<ReservationItem | null>(null);

  return (
    <div className="w-[416px] space-y-2 mt-4 font-sans">
      <h3 className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">
        Upcoming · Today's Reservations ({reservations.length})
      </h3>

      {reservations.length === 0 ? (
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#CFC3A6]/40 text-xs text-[#5F6575] text-center">
          No upcoming reservations for today
        </div>
      ) : (
        reservations.map((res) => {
          const isUnassigned = res.tableId === 'Unassigned' || !res.tableId;

          return (
            <div
              key={res.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                res.status === 'LATE'
                  ? 'bg-[#F8DCD5]/60 border-[#D4806F]'
                  : 'bg-[#F3EAD3] border-[#CFC3A6]/60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-[#1F2535]">
                  {res.time} · {res.customerName}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    res.status === 'LATE' ? 'text-[#962B1A]' : 'text-[#5F6575]'
                  }`}
                >
                  {res.status === 'LATE'
                    ? `${res.lateMinutes}m late`
                    : res.remainingMinutes !== undefined
                    ? `in ${res.remainingMinutes}m`
                    : ''}
                </span>
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-[#5F6575]">
                  {res.guestCount} guests · Table: {res.tableId}
                </p>
                {isUnassigned && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8E7BE] text-[#7A4E06] border border-[#D9A63E]/60">
                    Needs Table
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button
                  onClick={() => onCheckIn(res)}
                  className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
                >
                  Check-in
                </button>
                {isUnassigned ? (
                  <button
                    onClick={() => setAssigningRes(res)}
                    className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#2F6140] hover:bg-white cursor-pointer font-bold"
                  >
                    Xếp bàn
                  </button>
                ) : (
                  <button
                    onClick={() => onCallCustomer(res)}
                    className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
                  >
                    Call
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Hủy đặt bàn của khách ${res.customerName}?`)) {
                      onCancel(res);
                    }
                  }}
                  className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#962B1A] hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Quick Table Assignment Modal */}
      {assigningRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2535]/30 backdrop-blur-xs">
          <div className="bg-[#FFFDF7] rounded-2xl p-5 w-80 border border-[#CFC3A6]/40 shadow-xl space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#1F2535]">
              Xếp bàn cho {assigningRes.customerName}
            </h4>
            <p className="text-xs text-[#5F6575]">
              Yêu cầu: {assigningRes.guestCount} khách
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {availableTables.filter((t) => t.status === 'EMPTY').map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    const numericResId = Number(assigningRes.id.replace(/\D/g, ''));
                    const numericTableId = Number(t.id.replace(/\D/g, ''));
                    onAssignTable?.(numericResId, numericTableId);
                    setAssigningRes(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-[#CFC3A6]/60 hover:bg-[#F3EAD3] text-xs font-semibold text-[#1F2535] flex justify-between"
                >
                  <span>{t.name}</span>
                  <span className="text-[#5F6575]">{t.capacity} seats</span>
                </button>
              ))}
              {availableTables.filter((t) => t.status === 'EMPTY').length === 0 && (
                <p className="text-xs text-[#962B1A] py-2 text-center">Không có bàn trống khả dụng</p>
              )}
            </div>
            <button
              onClick={() => setAssigningRes(null)}
              className="w-full py-2 bg-[#F3EAD3] text-xs font-semibold rounded-xl text-[#1F2535]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/staff/table-map/UpcomingReservations.tsx
git commit -m "feat(pos): add table assignment modal and live check-in to UpcomingReservations"
```

---

### Task 8: Assemble Live POS Table Map Page (`/staff/table-map/page.tsx`)

**Files:**
- Modify: `src/app/staff/table-map/page.tsx`

**Interfaces:**
- Consumes: `useTableMapData` hook, all POS subcomponents
- Produces: Complete functional `/staff/table-map` page route

- [ ] **Step 1: Wire `page.tsx` with `useTableMapData`**

Update `src/app/staff/table-map/page.tsx`:
```tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { POSHeader } from '@/components/staff/table-map/POSHeader';
import { AreaTabSelector } from '@/components/staff/table-map/AreaTabSelector';
import { StatusFilterChips } from '@/components/staff/table-map/StatusFilterChips';
import { FloorPlanCanvas } from '@/components/staff/table-map/FloorPlanCanvas';
import { TableQuickPanel } from '@/components/staff/table-map/TableQuickPanel';
import { UpcomingReservations } from '@/components/staff/table-map/UpcomingReservations';
import { NewReservationDrawer } from '@/components/staff/table-map/NewReservationDrawer';
import { TableActionPopover } from '@/components/staff/table-map/TableActionPopover';
import { LegendBar } from '@/components/staff/table-map/LegendBar';
import { POSTable } from '@/types/posTableMap';
import { useTableMapData } from '@/hooks/useTableMapData';
import { ROUTES } from '@/config/constants/route';

export default function POSTableMapPage() {
  const router = useRouter();
  const {
    activeArea,
    setActiveArea,
    activeFilter,
    setActiveFilter,
    selectedTable,
    setSelectedTableId,
    posTables,
    filteredTables,
    upcomingReservations,
    areaCounts,
    statusCounts,
    handleCreateReservation,
    handleCheckIn,
    handleCancelReservation,
    handleAssignTable,
    handleOpenTable,
  } = useTableMapData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [popoverTable, setPopoverTable] = useState<POSTable | null>(null);

  const handleTableSelect = (table: POSTable) => {
    setSelectedTableId(table.id);
    if (table.status === 'EMPTY') {
      setPopoverTable(table);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF5E4] text-[#1F2535] flex flex-col font-sans">
      {/* Top Header */}
      <POSHeader
        activeTab="map"
        onTabChange={(tab) => {
          if (tab === 'order') router.push(ROUTES.STAFF.ORDER);
        }}
        onNewReservationClick={() => setIsDrawerOpen(true)}
        onQueueClick={() => {}}
        onReceiveCustomerClick={() => {
          const firstEmpty = posTables.find((t) => t.status === 'EMPTY');
          if (firstEmpty) setPopoverTable(firstEmpty);
        }}
        reservationCount={upcomingReservations.length}
      />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-6 space-y-4">
        {/* Area Tabs */}
        <AreaTabSelector
          activeArea={activeArea}
          onAreaChange={setActiveArea}
          areaCounts={areaCounts}
        />

        {/* Status Filter Chips */}
        <StatusFilterChips
          activeStatusFilter={activeFilter}
          onFilterChange={setActiveFilter}
          statusCounts={statusCounts}
        />

        {/* Core Layout Grid */}
        <div className="flex gap-6 items-start">
          <div className="flex flex-col gap-2">
            <FloorPlanCanvas
              tables={filteredTables}
              selectedTableId={selectedTable?.id || null}
              onTableSelect={handleTableSelect}
            />
            <LegendBar />
          </div>

          <div className="flex flex-col">
            <TableQuickPanel
              table={selectedTable}
              onOrderClick={() => router.push(ROUTES.STAFF.ORDER)}
              onPaymentClick={() => router.push(ROUTES.STAFF.INVOICE || '/staff/manage')}
              onTransferClick={() => {}}
              onSplitTableClick={() => {}}
              onSplitBillClick={() => {}}
            />
            <UpcomingReservations
              reservations={upcomingReservations}
              availableTables={posTables}
              onCheckIn={handleCheckIn}
              onCallCustomer={(res) => window.open(`tel:${res.phone}`)}
              onCancel={handleCancelReservation}
              onAssignTable={handleAssignTable}
            />
          </div>
        </div>
      </main>

      {/* Slide-over Drawer & Popover Modals */}
      <NewReservationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateReservation}
      />

      <TableActionPopover
        table={popoverTable}
        onClose={() => setPopoverTable(null)}
        onConfirmOpenTable={(table, guests) => {
          handleOpenTable(table, guests);
          setPopoverTable(null);
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Run TypeScript check and project build to verify 0 errors**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/staff/table-map/page.tsx
git commit -m "feat(pos): connect live data hook and full API operations to Table Map page"
```
