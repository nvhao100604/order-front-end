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
