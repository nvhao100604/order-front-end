'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks';
import { ROUTES } from '@/config/constants/route';
import { Plus, Map } from 'lucide-react';

export default function POSTableMapPage() {
  const router = useRouter();
  const { user } = useEnhancedAuth();
  const isAdmin = user?.roleID === 1 || user?.role === 'admin';

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
    handleSplitTable,
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
    <div className="max-w-7xl mx-auto space-y-4 font-sans">
      {/* ── Top Bar: Floor Tabs & Quick Action Buttons ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1 border-b border-stone-200/80">
        <AreaTabSelector
          areas={areaListNames}
          activeArea={activeArea}
          onAreaChange={setActiveArea}
          areaCounts={areaCounts}
        />

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {isAdmin && (
            <Link
              href={ROUTES.ADMIN_FLOOR_PLAN}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-amber-600/40 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Open Floor Plan Editor to drag-and-drop table positions"
            >
              <Map className="w-3.5 h-3.5 text-amber-600" />
              <span>Edit Floor Plan (Admin)</span>
            </Link>
          )}

          <button
            onClick={() => {
              const firstEmpty = posTables.find((t) => t.status === 'EMPTY');
              if (firstEmpty) setPopoverTable(firstEmpty);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-2xs"
          >
            Walk-in
          </button>
          <button
            onClick={() => {}}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <span>Waitlist</span>
            <span className="w-4 h-4 rounded-full bg-stone-100 text-stone-600 text-[10px] flex items-center justify-center font-bold">
              2
            </span>
          </button>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white transition-all shadow-sm cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reservation</span>
          </button>
        </div>
      </div>

      {/* ── Status Filter Chips ── */}
      <StatusFilterChips
        activeStatusFilter={activeFilter}
        onFilterChange={setActiveFilter}
        statusCounts={statusCounts}
      />

      {/* ── Core Layout Grid ── */}
      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* Left: Floor Plan Grid & Legend */}
        <div className="flex-1 w-full flex flex-col gap-3">
          <FloorPlanCanvas
            tables={filteredTables}
            floorItems={floorItems}
            selectedTableId={selectedTable?.id || null}
            onTableSelect={handleTableSelect}
          />
          <LegendBar />
        </div>

        {/* Right: Table Detail Panel & Upcoming Reservations */}
        <div className="w-full xl:w-[380px] shrink-0 flex flex-col">
          <TableQuickPanel
            table={selectedTable}
            order={selectedTableOrder}
            onOrderClick={() => router.push(ROUTES.STAFF.ORDER)}
            onQuickOrderClick={() => setIsQuickOrderOpen(true)}
            onPaymentClick={() => router.push(ROUTES.STAFF.INVOICE || '/staff/manage')}
            onMergeClick={() => setIsMergeModalOpen(true)}
            onTransferClick={() => {}}
            onSplitTableClick={() => selectedTable && handleSplitTable(selectedTable)}
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
        onMergeSuccess={() => {
          revalidateAll();
          setIsMergeModalOpen(false);
        }}
      />

      {/* Quick Order Drawer */}
      <QuickOrderDrawer
        isOpen={isQuickOrderOpen}
        tableId={selectedNumericId}
        onClose={() => setIsQuickOrderOpen(false)}
        onOrderCreated={() => {
          revalidateAll();
          setIsQuickOrderOpen(false);
        }}
      />
    </div>
  );
}
