'use client';

import React, { useState } from 'react';
import { POSHeader } from '@/components/staff/table-map/POSHeader';
import { AreaTabSelector } from '@/components/staff/table-map/AreaTabSelector';
import { StatusFilterChips } from '@/components/staff/table-map/StatusFilterChips';
import { FloorPlanCanvas } from '@/components/staff/table-map/FloorPlanCanvas';
import { TableQuickPanel } from '@/components/staff/table-map/TableQuickPanel';
import { UpcomingReservations } from '@/components/staff/table-map/UpcomingReservations';
import { NewReservationDrawer } from '@/components/staff/table-map/NewReservationDrawer';
import { TableActionPopover } from '@/components/staff/table-map/TableActionPopover';
import { LegendBar } from '@/components/staff/table-map/LegendBar';
import { POSTable, TableArea, TableStatus, ReservationItem } from '@/types/posTableMap';

const INITIAL_TABLES: POSTable[] = [
  { id: 'B1', name: 'B1', shape: 'Round', status: 'EMPTY', area: 'Floor 1', capacity: 2, x: 36, y: 32, width: 96, height: 96 },
  { id: 'B2', name: 'B2', shape: 'Square', status: 'OCCUPIED', area: 'Floor 1', capacity: 4, durationMinutes: 35, note: '35m · Group', linkedGroupTableIds: ['B6'], x: 168, y: 32, width: 112, height: 112 },
  { id: 'B3', name: 'B3', shape: 'Square', status: 'RESERVED', area: 'Floor 1', capacity: 4, reservedTime: '19:45', x: 308, y: 32, width: 112, height: 112 },
  { id: 'B8', name: 'B8', shape: 'Round', status: 'CLEAN', area: 'Floor 1', capacity: 2, x: 628, y: 104, width: 96, height: 96 },
  { id: 'B4', name: 'B4', shape: 'Square', status: 'OCCUPIED', area: 'Floor 1', capacity: 4, isMainMerged: true, mergedWithId: 'B5', note: 'Main', x: 36, y: 212, width: 112, height: 112 },
  { id: 'B5', name: 'B5', shape: 'Square', status: 'OCCUPIED', area: 'Floor 1', capacity: 4, isSubMerged: true, mergedWithId: 'B4', note: 'Sub', x: 160, y: 212, width: 112, height: 112 },
  { id: 'B6', name: 'B6', shape: 'Square', status: 'OCCUPIED', area: 'Floor 1', capacity: 4, durationMinutes: 25, note: '25m · Group', linkedGroupTableIds: ['B2'], x: 348, y: 212, width: 112, height: 112 },
  { id: 'B7', name: 'B7', shape: 'Long', status: 'PAY', area: 'Floor 1', capacity: 6, currentGuests: 5, durationMinutes: 85, x: 488, y: 212, width: 192, height: 112 },
  { id: 'B9', name: 'B9', shape: 'Round', status: 'EMPTY', area: 'Floor 1', capacity: 2, x: 36, y: 400, width: 96, height: 96 },
  { id: 'B10', name: 'B10', shape: 'Square', status: 'OCCUPIED', area: 'Floor 1', capacity: 4, currentGuests: 5, note: '+1 chair', x: 168, y: 396, width: 112, height: 112 },
  { id: 'B11', name: 'B11', shape: 'Long', status: 'LATE', area: 'Floor 1', capacity: 6, reservedTime: '19:30', note: '25m late', x: 308, y: 396, width: 192, height: 112 },
  { id: 'B12', name: 'B12', shape: 'Long', status: 'EMPTY', area: 'Floor 1', capacity: 8, note: 'Reserved 19:30 (40m left)', x: 524, y: 396, width: 224, height: 112 },
];

const INITIAL_RESERVATIONS: ReservationItem[] = [
  { id: 'R1', customerName: 'Mr. Nam', phone: '0901234567', time: '19:30', guestCount: 6, tableId: 'B11', status: 'LATE', lateMinutes: 25 },
  { id: 'R2', customerName: 'Ms. Lan', phone: '0987654321', time: '19:45', guestCount: 2, tableId: 'B3', status: 'NORMAL', remainingMinutes: 18 },
];

export default function POSTableMapPage() {
  const [activeArea, setActiveArea] = useState<TableArea>('Floor 1');
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'ALL'>('ALL');
  const [selectedTable, setSelectedTable] = useState<POSTable | null>(INITIAL_TABLES[6]); // B6 default
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [popoverTable, setPopoverTable] = useState<POSTable | null>(null);

  const handleTableSelect = (table: POSTable) => {
    setSelectedTable(table);
    if (table.status === 'EMPTY' && table.note?.includes('Reserved')) {
      setPopoverTable(table);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF5E4] text-[#1F2535] flex flex-col font-sans">
      {/* Top Header */}
      <POSHeader
        activeTab="map"
        onTabChange={() => {}}
        onNewReservationClick={() => setIsDrawerOpen(true)}
        onQueueClick={() => {}}
        onReceiveCustomerClick={() => {}}
      />

      <main className="flex-1 max-w-[1280px] w-full mx-auto p-6 space-y-4">
        {/* Area Tabs */}
        <AreaTabSelector
          activeArea={activeArea}
          onAreaChange={setActiveArea}
          areaCounts={{
            'Floor 1': { available: 3, total: 12 },
            'Garden': { available: 6, total: 6 },
            'VIP Room': { available: 0, total: 4 },
            'Bar Area': { available: 3, total: 5 },
          }}
        />

        {/* Status Filter Chips */}
        <StatusFilterChips
          activeStatusFilter={activeFilter}
          onFilterChange={setActiveFilter}
          statusCounts={{
            ALL: 12,
            EMPTY: 3,
            OCCUPIED: 5,
            PAY: 1,
            RESERVED: 1,
            CLEAN: 1,
            LATE: 1,
          }}
        />

        {/* Core Layout Grid */}
        <div className="flex gap-6 items-start">
          <div className="flex flex-col gap-2">
            <FloorPlanCanvas
              tables={INITIAL_TABLES}
              selectedTableId={selectedTable?.id || null}
              onTableSelect={handleTableSelect}
            />
            <LegendBar />
          </div>

          <div className="flex flex-col">
            <TableQuickPanel
              table={selectedTable}
              onOrderClick={() => {}}
              onPaymentClick={() => {}}
              onTransferClick={() => {}}
              onSplitTableClick={() => {}}
              onSplitBillClick={() => {}}
            />
            <UpcomingReservations
              reservations={INITIAL_RESERVATIONS}
              onCheckIn={() => {}}
              onCallCustomer={() => {}}
              onCancel={() => {}}
            />
          </div>
        </div>
      </main>

      {/* Slide-over Drawer & Popover Modals */}
      <NewReservationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={() => setIsDrawerOpen(false)}
      />

      <TableActionPopover
        table={popoverTable}
        onClose={() => setPopoverTable(null)}
        onConfirmOpenTable={() => setPopoverTable(null)}
      />
    </div>
  );
}
