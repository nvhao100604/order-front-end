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
import { MergeTableModal } from '@/components/staff/table-map/MergeTableModal';
import { QuickOrderDrawer } from '@/components/staff/table-map/QuickOrderDrawer';
import { LegendBar } from '@/components/staff/table-map/LegendBar';
import { POSTable } from '@/types/posTableMap';
import { useTableMapData } from '@/hooks/useTableMapData';
import { ROUTES } from '@/config/constants/route';

export default function POSTableMapPage() {
  const router = useRouter();
  const {
    areas,
    areaListNames,
    activeArea,
    setActiveArea,
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
  } = useTableMapData();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
  const [popoverTable, setPopoverTable] = useState<POSTable | null>(null);

  const handleTableSelect = (table: POSTable) => {
    setSelectedTableId(table.id);
    if (table.status === 'EMPTY') {
      setPopoverTable(table);
    }
  };

  const selectedNumericId = selectedTable
    ? Number(selectedTable.id.replace(/\D/g, '')) || 1
    : 1;

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
          areas={areaListNames}
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
              floorItems={floorItems}
              selectedTableId={selectedTable?.id || null}
              onTableSelect={handleTableSelect}
            />
            <LegendBar />
          </div>

          <div className="flex flex-col">
            <TableQuickPanel
              table={selectedTable}
              order={selectedTableOrder}
              onOrderClick={() => router.push(ROUTES.STAFF.ORDER)}
              onQuickOrderClick={() => setIsQuickOrderOpen(true)}
              onPaymentClick={() => router.push(ROUTES.STAFF.INVOICE || '/staff/manage')}
              onMergeClick={() => setIsMergeModalOpen(true)}
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

      {/* Merge Table Modal */}
      <MergeTableModal
        isOpen={isMergeModalOpen}
        currentTable={selectedTable}
        allTables={posTables}
        onClose={() => setIsMergeModalOpen(false)}
        onMergeSuccess={revalidateAll}
      />

      {/* Quick Order Drawer */}
      <QuickOrderDrawer
        isOpen={isQuickOrderOpen}
        tableId={selectedNumericId}
        tableName={selectedTable?.name}
        onClose={() => setIsQuickOrderOpen(false)}
        onOrderCreated={revalidateAll}
      />
    </div>
  );
}
