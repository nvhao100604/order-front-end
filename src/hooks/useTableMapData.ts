'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import {
  POLL_INTERVAL,
  TABLE_KEY,
  RESERVATION_KEY,
  DASHBOARD_TABLES_KEY,
  AREA_KEY,
  ORDER_KEY,
} from '@/config/constants/api';
import { getDashboardTablesSWR } from '@/hooks/useDashboard';
import { useGetReservations } from '@/hooks/useReservation';
import { tables_services } from '@/services/table.services';
import { area_services } from '@/services/area.services';
import { reservation_services } from '@/services/reservation.services';
import { getOrders } from '@/services/order.services';
import { POSTable, TableArea, TableStatus, ReservationItem } from '@/types/posTableMap';
import { mapFloorItemsToPOSTables, DEFAULT_AREAS } from '@/config/tableMapLayout';
import {
  IArea,
  IFloorItem,
  IOrderResponse,
  IReservationPayload,
  IReservationResponse,
} from '@/interfaces';

export function useTableMapData() {
  const [activeArea, setActiveArea] = useState<TableArea>('Floor 1');
  const [activeAreaId, setActiveAreaId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'ALL'>('ALL');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // 1. Fetch live areas from backend
  const { data: areasData } = useSWR<IArea[]>(
    AREA_KEY,
    async () => {
      const res = await area_services.getAreas();
      return res.data || [];
    },
    { revalidateOnFocus: true }
  );

  const areas = useMemo<IArea[]>(() => areasData || [], [areasData]);

  // Sync activeArea with available areas from backend
  useEffect(() => {
    if (areas.length > 0) {
      if (!activeAreaId) {
        setActiveAreaId(areas[0].id);
        setActiveArea(areas[0].name as TableArea);
      } else {
        const matching = areas.find((a) => a.id === activeAreaId);
        if (matching) {
          setActiveArea(matching.name as TableArea);
        }
      }
    }
  }, [areas, activeAreaId]);

  const handleAreaChange = useCallback(
    (areaName: TableArea) => {
      setActiveArea(areaName);
      const found = areas.find((a) => a.name === areaName);
      if (found) {
        setActiveAreaId(found.id);
      }
    },
    [areas]
  );

  // 2. Fetch layout items for the currently active area
  const layoutSWRKey = activeAreaId ? `${AREA_KEY}/${activeAreaId}/layout` : null;
  const { data: areaLayoutData } = useSWR(
    layoutSWRKey,
    async () => {
      if (!activeAreaId) return null;
      const res = await area_services.getAreaLayout(activeAreaId);
      return res.data;
    },
    { revalidateOnFocus: true }
  );

  const floorItems = useMemo<IFloorItem[]>(() => {
    return areaLayoutData?.items || [];
  }, [areaLayoutData]);

  // 3. Fetch live tables with background polling
  const { data: tablesRes } = getDashboardTablesSWR(undefined, {
    refreshInterval: POLL_INTERVAL,
    revalidateOnFocus: true,
  });

  // 4. Fetch live reservations
  const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);
  const { data: reservationsRes } = useGetReservations(
    { startDate: todayISO },
    { refreshInterval: POLL_INTERVAL, revalidateOnFocus: true }
  );

  // 5. Map backend tables and floor items to POSTables
  const posTables = useMemo<POSTable[]>(() => {
    const raw = tablesRes?.data;
    if (!Array.isArray(raw) || raw.length === 0) return [];

    // Filter tables for the current area if areaId is present, or pass all
    const areaTables = activeAreaId
      ? raw.filter((t) => !t.areaId || t.areaId === activeAreaId)
      : raw;

    const tablesToMap = areaTables.length > 0 ? areaTables : raw;
    return mapFloorItemsToPOSTables(floorItems, tablesToMap, 28, activeArea);
  }, [tablesRes, floorItems, activeAreaId, activeArea]);

  // 6. Map backend reservations to POS ReservationItem
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

  // 7. Dynamic area counts
  const areaListNames = useMemo<TableArea[]>(() => {
    if (areas.length > 0) {
      return areas.map((a) => a.name as TableArea);
    }
    return DEFAULT_AREAS;
  }, [areas]);

  const areaCounts = useMemo<Record<TableArea, { available: number; total: number }>>(() => {
    const counts = areaListNames.reduce((acc, area) => {
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
  }, [areaListNames, posTables]);

  // 8. Dynamic status counts
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

  // 9. Filtered tables for active view
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

  // 10. Fetch real active order for selected table (GET /orders?tableID=X)
  const numericSelectedTableId = useMemo(() => {
    if (!selectedTable?.id) return null;
    const num = Number(selectedTable.id.replace(/\D/g, ''));
    return Number.isFinite(num) && num > 0 ? num : null;
  }, [selectedTable]);

  const orderSWRKey = numericSelectedTableId
    ? `${ORDER_KEY}?tableID=${numericSelectedTableId}`
    : null;

  const { data: ordersRes } = useSWR(
    orderSWRKey,
    async () => {
      if (!numericSelectedTableId) return null;
      try {
        const res = await getOrders({ tableID: numericSelectedTableId });
        return res?.data || [];
      } catch (err) {
        console.error('Fetch table orders error:', err);
        return [];
      }
    },
    { refreshInterval: POLL_INTERVAL, revalidateOnFocus: true }
  );

  const selectedTableOrder = useMemo<IOrderResponse | null>(() => {
    if (!Array.isArray(ordersRes) || ordersRes.length === 0) return null;
    // Pick the most recent active order (not cancelled or completed)
    const active = ordersRes.find(
      (o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'
    );
    return active || ordersRes[0] || null;
  }, [ordersRes]);

  // Revalidate helper
  const revalidateAll = useCallback(() => {
    mutate(
      (key) =>
        typeof key === 'string' &&
        (key.includes(TABLE_KEY) ||
          key.includes(RESERVATION_KEY) ||
          key.includes(DASHBOARD_TABLES_KEY) ||
          key.includes(AREA_KEY) ||
          key.includes(ORDER_KEY))
    );
  }, []);

  // Handlers
  const handleCreateReservation = useCallback(
    async (data: {
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
        const numericTableId = data.selectedTableOption?.replace(/\D/g, '')
          ? Number(data.selectedTableOption.replace(/\D/g, ''))
          : undefined;
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
          toast.success(`Reservation created successfully for ${data.name}!`);
          revalidateAll();
          return true;
        } else {
          toast.error(res.message || 'Unable to create reservation.');
          return false;
        }
      } catch (err: any) {
        const status = err.response?.status;
        const data = err.response?.data;
        if (status === 409) {
          toast.error(data?.message || data?.detail || 'This table or time slot is already reserved. Please select another table.');
        } else if (status === 422) {
          toast.error(data?.detail || data?.message || 'Invalid reservation information or payload conflict.');
        } else {
          toast.error(data?.detail || data?.message || err.message || 'Error creating reservation.');
        }
        return false;
      }
    },
    [revalidateAll]
  );

  const handleCheckIn = useCallback(
    async (res: ReservationItem) => {
      const numericId = Number(res.id.replace(/\D/g, ''));
      try {
        const result = await reservation_services.checkinReservation(numericId);
        if (result.success || result.data) {
          toast.success(`Customer ${res.customerName} checked in successfully!`);
          if (res.tableId && res.tableId !== 'Unassigned') {
            setSelectedTableId(res.tableId);
          }
          revalidateAll();
        } else {
          toast.error(result.message || 'Check-in failed.');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.detail || err.message || 'Error during check-in.');
      }
    },
    [revalidateAll]
  );

  const handleCancelReservation = useCallback(
    async (res: ReservationItem) => {
      const numericId = Number(res.id.replace(/\D/g, ''));
      try {
        const result = await reservation_services.cancelReservation(numericId);
        if (result.success || result.data) {
          toast.info(`Cancelled reservation for ${res.customerName}.`);
          revalidateAll();
        } else {
          toast.error(result.message || 'Failed to cancel reservation.');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.detail || err.message || 'Error cancelling reservation.');
      }
    },
    [revalidateAll]
  );

  const handleAssignTable = useCallback(
    async (reservationId: number, tableId: number) => {
      try {
        const result = await reservation_services.assignTable(reservationId, tableId);
        if (result.success || result.data) {
          toast.success(`Assigned table B${tableId} to reservation!`);
          revalidateAll();
        } else {
          toast.error(result.message || 'Failed to assign table.');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.detail || err.message || 'Error assigning table.');
      }
    },
    [revalidateAll]
  );

  const handleOpenTable = useCallback(
    async (table: POSTable, guests: number) => {
      const numericId = Number(table.id.replace(/\D/g, ''));
      try {
        const result = await tables_services.openTable(numericId);
        if (result.success || result.data) {
          toast.success(`Opened table ${table.name} for ${guests} guests!`);
          setSelectedTableId(table.id);
          revalidateAll();
        } else {
          toast.error(result.message || 'Unable to open table.');
        }
      } catch (err: any) {
        toast.error(err.response?.data?.detail || err.message || 'Error opening table.');
      }
    },
    [revalidateAll]
  );

  return {
    areas,
    areaListNames,
    activeArea,
    activeAreaId,
    setActiveArea: handleAreaChange,
    setActiveAreaId,
    activeFilter,
    setActiveFilter,
    selectedTable,
    setSelectedTableId,
    posTables,
    filteredTables,
    floorItems,
    selectedTableOrder,
    upcomingReservations,
    areaCounts,
    statusCounts,
    revalidateAll,
    handleCreateReservation,
    handleCheckIn,
    handleCancelReservation,
    handleAssignTable,
    handleOpenTable,
  };
}
