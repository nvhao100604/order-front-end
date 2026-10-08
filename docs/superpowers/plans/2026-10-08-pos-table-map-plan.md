# POS Table Map & Reservation System (Figma v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modular, interactive POS Table Map & Reservation System for restaurant staff based on the Figma v2 Warm Light/Editorial theme design.

**Architecture:** Split the UI into 12+ focused, reusable React components under `src/components/staff/table-map/`. Manage interactive state via clean TypeScript state models and React hooks.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React / React Icons, Redux / SWR.

**Spec:** `docs/superpowers/specs/2026-10-08-pos-table-map-design.md`

## Global Constraints
- Every component must match the Figma v2 Warm Light color palette (#FBF5E4, #FFFDF7, #1F2535, #F25C14).
- Component files must be modularized under `src/components/staff/table-map/`.
- No inline hardcoded magic numbers without CSS variables or Tailwind utility mappings.

---

### Task 1: TypeScript Interfaces and Data Models

**Files:**
- Create: `src/types/posTableMap.ts`

**Interfaces:**
- Consumes: None
- Produces: `TableStatus`, `TableShape`, `POSTable`, `ReservationItem`, `OrderItem`, `TableMapArea`

- [ ] **Step 1: Write TypeScript interfaces file**

```typescript
export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'PAY' | 'RESERVED' | 'CLEAN' | 'LATE';
export type TableShape = 'Round' | 'Square' | 'Long';
export type TableArea = 'Tầng 1' | 'Sân vườn' | 'Phòng VIP' | 'Quầy bar';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface POSTable {
  id: string; // e.g. "B1"
  name: string;
  shape: TableShape;
  status: TableStatus;
  area: TableArea;
  capacity: number; // e.g. 2, 4, 6, 8
  currentGuests?: number;
  durationMinutes?: number;
  reservedTime?: string;
  note?: string;
  isMainMerged?: boolean;
  isSubMerged?: boolean;
  mergedWithId?: string; // e.g. "B5"
  linkedGroupTableIds?: string[]; // e.g. ["B2", "B6"]
  orderItems?: OrderItem[];
  totalPrice?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ReservationItem {
  id: string;
  customerName: string;
  phone: string;
  time: string;
  guestCount: number;
  tableId: string;
  status: 'NORMAL' | 'LATE';
  lateMinutes?: number;
  remainingMinutes?: number;
  note?: string;
}
```

- [ ] **Step 2: Verify type compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/types/posTableMap.ts
git commit -m "feat(pos): add TypeScript models for POS table map v2"
```

---

### Task 2: POS Top Header Component

**Files:**
- Create: `src/components/staff/table-map/POSHeader.tsx`

**Interfaces:**
- Consumes: `POSHeaderProps`
- Produces: `POSHeader` component

- [ ] **Step 1: Write POSHeader component**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface POSHeaderProps {
  activeTab: 'map' | 'reservation' | 'order';
  onTabChange: (tab: 'map' | 'reservation' | 'order') => void;
  onNewReservationClick: () => void;
  onQueueClick: () => void;
  onReceiveCustomerClick: () => void;
  reservationCount?: number;
  userName?: string;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  activeTab,
  onTabChange,
  onNewReservationClick,
  onQueueClick,
  onReceiveCustomerClick,
  reservationCount = 2,
  userName = 'N',
}) => {
  return (
    <header className="w-full h-16 bg-[#1F2535] text-[#FBF5E4] px-6 flex items-center justify-between shadow-md">
      {/* Brand & Main Navigation Tabs */}
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#FBF5E4]">Foodie</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#AEB3C2]">Staff POS</span>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('map')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'map' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            Sơ đồ bàn
          </button>
          <button
            onClick={() => onTabChange('reservation')}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              activeTab === 'reservation' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            <span>Đặt bàn</span>
            {reservationCount > 0 && (
              <span className="bg-[#F8DCD5] text-[#962B1A] text-xs font-bold px-2 py-0.5 rounded-full">
                {reservationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('order')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'order' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            Gọi món
          </button>
        </nav>
      </div>

      {/* Quick Action Buttons & User Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReceiveCustomerClick}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#3A4258] hover:bg-[#3A4258] transition-all text-[#FBF5E4]"
        >
          Nhận khách
        </button>
        <button
          onClick={onQueueClick}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#3A4258] hover:bg-[#3A4258] transition-all text-[#FBF5E4]"
        >
          Hàng chờ · 2
        </button>
        <button
          onClick={onNewReservationClick}
          className="px-4.5 py-2 text-sm font-semibold rounded-xl bg-[#F25C14] hover:bg-[#d84e0e] transition-all text-[#FFF9F0] shadow-sm"
        >
          + Đặt bàn mới
        </button>
        <div className="w-9 h-9 rounded-full bg-[#F3EAD3] text-[#1F2535] font-bold flex items-center justify-center text-sm shadow-inner ml-1">
          {userName[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/staff/table-map/POSHeader.tsx
git commit -m "feat(pos): create POSHeader navigation component"
```

---

### Task 3: Area Tab Selector & Status Filter Chips

**Files:**
- Create: `src/components/staff/table-map/AreaTabSelector.tsx`
- Create: `src/components/staff/table-map/StatusFilterChips.tsx`

**Interfaces:**
- Consumes: `TableArea`, `TableStatus`
- Produces: `AreaTabSelector`, `StatusFilterChips`

- [ ] **Step 1: Write AreaTabSelector component**

```tsx
'use client';

import React from 'react';
import { TableArea } from '@/types/posTableMap';

interface AreaTabSelectorProps {
  activeArea: TableArea;
  onAreaChange: (area: TableArea) => void;
  areaCounts: Record<TableArea, { available: number; total: number }>;
}

export const AreaTabSelector: React.FC<AreaTabSelectorProps> = ({
  activeArea,
  onAreaChange,
  areaCounts,
}) => {
  const areas: TableArea[] = ['Tầng 1', 'Sân vườn', 'Phòng VIP', 'Quầy bar'];

  return (
    <div className="flex items-center gap-7 border-b border-[#CFC3A6]/40 pb-2">
      {areas.map((area) => {
        const isSelected = activeArea === area;
        const count = areaCounts[area];
        const isFull = count.available === 0;

        return (
          <button
            key={area}
            onClick={() => onAreaChange(area)}
            className={`flex items-center gap-2 pb-2 text-base font-semibold transition-all relative ${
              isSelected ? 'text-[#1F2535]' : 'text-[#5F6575] hover:text-[#1F2535]'
            }`}
          >
            <span>{area}</span>
            <span
              className={`text-xs font-normal ${
                isFull ? 'text-[#962B1A] font-medium' : 'text-[#2F6140]'
              }`}
            >
              {isFull ? 'Đầy' : `${count.available}/${count.total} trống`}
            </span>
            {isSelected && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1F2535] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 2: Write StatusFilterChips component**

```tsx
'use client';

import React from 'react';
import { TableStatus } from '@/types/posTableMap';

interface StatusFilterChipsProps {
  activeStatusFilter: TableStatus | 'ALL';
  onFilterChange: (status: TableStatus | 'ALL') => void;
  statusCounts: Record<TableStatus | 'ALL', number>;
}

export const StatusFilterChips: React.FC<StatusFilterChipsProps> = ({
  activeStatusFilter,
  onFilterChange,
  statusCounts,
}) => {
  const filters: { id: TableStatus | 'ALL'; label: string }[] = [
    { id: 'ALL', label: `Tất cả ${statusCounts.ALL}` },
    { id: 'EMPTY', label: `Trống ${statusCounts.EMPTY}` },
    { id: 'OCCUPIED', label: `Đang ăn ${statusCounts.OCCUPIED}` },
    { id: 'PAY', label: `Chờ TT ${statusCounts.PAY}` },
    { id: 'RESERVED', label: `Đã đặt ${statusCounts.RESERVED}` },
    { id: 'CLEAN', label: `Cần dọn ${statusCounts.CLEAN}` },
    { id: 'LATE', label: `Quá giờ ${statusCounts.LATE}` },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      {filters.map((f) => {
        const isSelected = activeStatusFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              isSelected
                ? 'bg-[#1F2535] text-[#FBF5E4] border-[#1F2535] shadow-sm font-semibold'
                : 'bg-[#FFFDF7] text-[#5F6575] border-[#CFC3A6]/60 hover:bg-[#F3EAD3]/50'
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/staff/table-map/AreaTabSelector.tsx src/components/staff/table-map/StatusFilterChips.tsx
git commit -m "feat(pos): create AreaTabSelector and StatusFilterChips components"
```

---

### Task 4: Interactive Table Tile Component

**Files:**
- Create: `src/components/staff/table-map/TableTile.tsx`

**Interfaces:**
- Consumes: `POSTable`
- Produces: `TableTile` component

- [ ] **Step 1: Write TableTile component**

```tsx
'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableTileProps {
  table: POSTable;
  isSelected: boolean;
  onClick: (table: POSTable) => void;
}

export const TableTile: React.FC<TableTileProps> = ({ table, isSelected, onClick }) => {
  // Figma v2 Status Style Tokens
  const getStatusStyle = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'bg-[#E1EDDD] border-[#8DBB98] text-[#2F6140]';
      case 'OCCUPIED':
        return 'bg-[#F8E7BE] border-[#D9A63E] text-[#7A4E06]';
      case 'PAY':
        return 'bg-[#DAEBF1] border-[#7FB1C4] text-[#245A72]';
      case 'RESERVED':
        return 'bg-[#E4E5F6] border-[#9B9FDB] text-[#3F4498]';
      case 'CLEAN':
        return 'bg-[#EDE6D6] border-[#A89F89] border-dashed text-[#5C574A]';
      case 'LATE':
        return 'bg-[#F8DCD5] border-[#D4806F] text-[#962B1A]';
      default:
        return 'bg-[#FFFDF7] border-[#CFC3A6] text-[#1F2535]';
    }
  };

  const getShapeStyle = () => {
    switch (table.shape) {
      case 'Round':
        return 'rounded-full';
      case 'Square':
        return 'rounded-2xl';
      case 'Long':
        return 'rounded-2xl';
    }
  };

  const statusLabel = () => {
    switch (table.status) {
      case 'EMPTY':
        return 'Trống';
      case 'OCCUPIED':
        return 'Đang ăn';
      case 'PAY':
        return 'Chờ thanh toán';
      case 'RESERVED':
        return 'Đã đặt';
      case 'CLEAN':
        return 'Cần dọn';
      case 'LATE':
        return 'Quá giờ';
    }
  };

  return (
    <div
      onClick={() => onClick(table)}
      style={{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }}
      className={`absolute cursor-pointer flex flex-col items-center justify-center p-2 border-[1.5px] transition-all hover:scale-[1.02] shadow-sm select-none ${getStatusStyle()} ${getShapeStyle()} ${
        isSelected ? 'ring-2 ring-offset-2 ring-[#F25C14]' : ''
      }`}
    >
      <span className="font-serif text-xl font-bold leading-none">{table.name}</span>

      {/* Meta text */}
      <span className="text-[11px] font-normal opacity-90 mt-0.5">
        {table.status === 'OCCUPIED' && table.durationMinutes
          ? `${table.durationMinutes}′ · Nhóm`
          : table.status === 'RESERVED' && table.reservedTime
          ? `${table.reservedTime} · ${table.capacity} khách`
          : table.status === 'PAY'
          ? `${table.currentGuests || 5}/${table.capacity} khách`
          : table.status === 'LATE'
          ? `${table.capacity} khách · hẹn 19:30`
          : `${table.capacity} ghế`}
      </span>

      {/* Status Subtitle */}
      <span className="text-[11px] font-semibold mt-0.5">
        {table.note ? table.note : statusLabel()}
      </span>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/staff/table-map/TableTile.tsx
git commit -m "feat(pos): create TableTile component with shape and status tokens"
```

---

### Task 5: Floor Plan Canvas and Obstacles

**Files:**
- Create: `src/components/staff/table-map/FloorObstacle.tsx`
- Create: `src/components/staff/table-map/FloorPlanCanvas.tsx`

**Interfaces:**
- Consumes: `POSTable`
- Produces: `FloorPlanCanvas` component

- [ ] **Step 1: Write FloorObstacle component**

```tsx
'use client';

import React from 'react';

interface FloorObstacleProps {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export const FloorObstacle: React.FC<FloorObstacleProps> = ({ label, x, y, width, height }) => {
  return (
    <div
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
      }}
      className="absolute bg-[#F3EAD3] text-[#5F6575] rounded-xl text-xs font-medium flex items-center justify-center border border-[#CFC3A6]/40 select-none shadow-xs"
    >
      {label}
    </div>
  );
};
```

- [ ] **Step 2: Write FloorPlanCanvas component**

```tsx
'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { TableTile } from './TableTile';
import { FloorObstacle } from './FloorObstacle';

interface FloorPlanCanvasProps {
  tables: POSTable[];
  selectedTableId: string | null;
  onTableSelect: (table: POSTable) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  tables,
  selectedTableId,
  onTableSelect,
}) => {
  return (
    <div className="relative w-[776px] h-[576px] bg-[#FFFDF7] rounded-2xl shadow-sm border border-[#CFC3A6]/30 overflow-hidden">
      {/* Obstacles */}
      <FloorObstacle label="Quầy bar" x={544} y={32} width={196} height={44} />
      <FloorObstacle label="Cột" x={452} y={60} width={40} height={32} />
      <FloorObstacle label="Cửa ra vào" x={24} y={516} width={120} height={28} />
      <FloorObstacle label="Cầu thang" x={632} y={516} width={120} height={28} />

      {/* Merged Group Hull (B4 + B5) */}
      <div className="absolute left-[24px] top-[200px] w-[272px] h-[164px] border-2 border-[#D9A63E] rounded-2xl pointer-events-none">
        <div className="absolute -bottom-6 left-6 text-xs font-medium text-[#7A4E06] bg-[#F8E7BE] px-2 py-0.5 rounded-md border border-[#D9A63E]/60 shadow-xs">
          🔗 B4 + B5 · 6/8 khách · 52′
        </div>
      </div>

      {/* SVG Dashed Link (B2 - B6) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line
          x1={224}
          y1={88}
          x2={404}
          y2={268}
          stroke="#9B9FDB"
          strokeWidth="2"
          strokeDasharray="6 4"
        />
      </svg>

      {/* Tables */}
      {tables.map((table) => (
        <TableTile
          key={table.id}
          table={table}
          isSelected={selectedTableId === table.id}
          onClick={onTableSelect}
        />
      ))}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/staff/table-map/FloorObstacle.tsx src/components/staff/table-map/FloorPlanCanvas.tsx
git commit -m "feat(pos): create FloorPlanCanvas and FloorObstacle components"
```

---

### Task 6: Table Quick Panel & Legend Bar

**Files:**
- Create: `src/components/staff/table-map/TableQuickPanel.tsx`
- Create: `src/components/staff/table-map/LegendBar.tsx`

**Interfaces:**
- Consumes: `POSTable`
- Produces: `TableQuickPanel`, `LegendBar`

- [ ] **Step 1: Write TableQuickPanel component**

```tsx
'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableQuickPanelProps {
  table: POSTable | null;
  onOrderClick: () => void;
  onPaymentClick: () => void;
  onTransferClick: () => void;
  onSplitTableClick: () => void;
  onSplitBillClick: () => void;
}

export const TableQuickPanel: React.FC<TableQuickPanelProps> = ({
  table,
  onOrderClick,
  onPaymentClick,
  onTransferClick,
  onSplitTableClick,
  onSplitBillClick,
}) => {
  if (!table) {
    return (
      <div className="w-[416px] h-[576px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex items-center justify-center text-[#5F6575]">
        Chọn một bàn trên sơ đồ để xem thông tin chi tiết
      </div>
    );
  }

  const items = table.orderItems || [
    { id: '1', name: 'Phở bò', quantity: 3, price: 75000 },
    { id: '2', name: 'Gỏi cuốn', quantity: 1, price: 40000 },
    { id: '3', name: 'Nước cam', quantity: 4, price: 30000 },
  ];
  const totalPrice = table.totalPrice || 355000;

  return (
    <div className="w-[416px] bg-[#FFFDF7] rounded-2xl p-6 shadow-sm border border-[#CFC3A6]/30 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CFC3A6]/30">
          <h2 className="font-serif text-2xl font-bold text-[#1F2535]">Bàn {table.name}</h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F8E7BE] text-[#7A4E06] border border-[#D9A63E]/60">
            ● Đang ăn
          </span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 py-3 text-xs text-[#5F6575]">
          <span>👥 6/8 khách</span>
          <span>⏱️ 35 phút</span>
          <span className="text-[#3F4498] font-medium">🔗 Nhóm B2, B6</span>
        </div>

        {/* Order Item List */}
        <div className="space-y-2.5 py-3 border-t border-b border-[#CFC3A6]/30">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-[#1F2535]">
              <span>{item.name}</span>
              <span className="text-[#5F6575] font-medium">x{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-baseline pt-4">
          <span className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">Tổng cộng</span>
          <div className="font-serif text-2xl font-bold text-[#1F2535]">
            {totalPrice.toLocaleString('vi-VN')} <span className="text-sm font-sans font-normal text-[#5F6575]">đ</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOrderClick}
            className="py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl transition-all shadow-xs"
          >
            Gọi món
          </button>
          <button
            onClick={onPaymentClick}
            className="py-3 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-sm font-semibold rounded-xl transition-all"
          >
            Thanh toán
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onTransferClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all"
          >
            Chuyển
          </button>
          <button
            onClick={onSplitTableClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all"
          >
            Tách bàn
          </button>
          <button
            onClick={onSplitBillClick}
            className="py-2.5 bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-xs font-semibold rounded-xl transition-all"
          >
            Tách bill
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Write LegendBar component**

```tsx
'use client';

import React from 'react';

export const LegendBar: React.FC = () => {
  const items = [
    { label: 'Trống', color: 'bg-[#8DBB98]' },
    { label: 'Đang ăn', color: 'bg-[#D9A63E]' },
    { label: 'Chờ thanh toán', color: 'bg-[#7FB1C4]' },
    { label: 'Đã đặt', color: 'bg-[#9B9FDB]' },
    { label: 'Cần dọn', color: 'bg-[#A89F89]' },
    { label: 'Quá giờ', color: 'bg-[#D4806F]' },
    { label: 'Nhóm liên kết (chung order)', isLink: true },
  ];

  return (
    <div className="flex items-center gap-4 text-xs text-[#5F6575] py-2">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          {item.isLink ? (
            <span className="text-[#9B9FDB] font-bold">🔗</span>
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/staff/table-map/TableQuickPanel.tsx src/components/staff/table-map/LegendBar.tsx
git commit -m "feat(pos): create TableQuickPanel and LegendBar components"
```

---

### Task 7: Upcoming Reservations & Action Drawer

**Files:**
- Create: `src/components/staff/table-map/UpcomingReservations.tsx`
- Create: `src/components/staff/table-map/NewReservationDrawer.tsx`

**Interfaces:**
- Consumes: `ReservationItem`
- Produces: `UpcomingReservations`, `NewReservationDrawer`

- [ ] **Step 1: Write UpcomingReservations component**

```tsx
'use client';

import React from 'react';
import { ReservationItem } from '@/types/posTableMap';

interface UpcomingReservationsProps {
  reservations: ReservationItem[];
  onCheckIn: (res: ReservationItem) => void;
  onCallCustomer: (res: ReservationItem) => void;
  onCancel: (res: ReservationItem) => void;
}

export const UpcomingReservations: React.FC<UpcomingReservationsProps> = ({
  reservations,
  onCheckIn,
  onCallCustomer,
  onCancel,
}) => {
  return (
    <div className="w-[416px] space-y-2 mt-4">
      <h3 className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">
        Sắp đến · 60 phút tới
      </h3>

      {reservations.map((res) => (
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
              {res.status === 'LATE' ? `Trễ ${res.lateMinutes}′` : `còn ${res.remainingMinutes}′`}
            </span>
          </div>

          <p className="text-xs text-[#5F6575] mt-0.5">
            {res.guestCount} khách · {res.tableId}
          </p>

          {res.status === 'LATE' && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => onCheckIn(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white"
              >
                Check-in
              </button>
              <button
                onClick={() => onCallCustomer(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white"
              >
                Gọi khách
              </button>
              <button
                onClick={() => onCancel(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#962B1A] hover:bg-white"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Write NewReservationDrawer component**

```tsx
'use client';

import React, { useState } from 'react';

interface NewReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const NewReservationDrawer: React.FC<NewReservationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [guests, setGuests] = useState(6);
  const [name, setName] = useState('Anh Nam');
  const [phone, setPhone] = useState('0901 234 567');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Scrim */}
      <div className="fixed inset-0 bg-[#1F2535]/45 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-[440px] h-full bg-[#FFFDF7] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex justify-between items-center pb-4 border-b border-[#CFC3A6]/30">
            <h2 className="font-serif text-2xl font-bold text-[#1F2535]">Đặt bàn mới</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center font-bold hover:bg-[#CFC3A6]"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 py-4">
            {/* Stepper */}
            <div>
              <label className="text-xs font-semibold text-[#5F6575] uppercase tracking-wider block mb-1">
                Số khách
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-10 h-10 rounded-full border border-[#CFC3A6] bg-[#FFFDF7] text-xl font-bold text-[#1F2535]"
                >
                  −
                </button>
                <span className="font-serif text-2xl font-bold text-[#1F2535]">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="w-10 h-10 rounded-full border border-[#CFC3A6] bg-[#FFFDF7] text-xl font-bold text-[#1F2535]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="text-xs font-semibold text-[#5F6575] uppercase tracking-wider block mb-1">
                Tên khách
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5F6575] uppercase tracking-wider block mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#CFC3A6] bg-[#FFFDF7] text-sm text-[#1F2535] focus:outline-none focus:ring-2 focus:ring-[#F25C14]"
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => onSubmit({ guests, name, phone, note })}
          className="w-full py-3.5 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl shadow-md transition-all"
        >
          Xác nhận đặt bàn
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 3: Commit**

```bash
git add src/components/staff/table-map/UpcomingReservations.tsx src/components/staff/table-map/NewReservationDrawer.tsx
git commit -m "feat(pos): create UpcomingReservations and NewReservationDrawer components"
```

---

### Task 8: Table Action Popover Component

**Files:**
- Create: `src/components/staff/table-map/TableActionPopover.tsx`

**Interfaces:**
- Consumes: `POSTable`
- Produces: `TableActionPopover` component

- [ ] **Step 1: Write TableActionPopover component**

```tsx
'use client';

import React, { useState } from 'react';
import { POSTable } from '@/types/posTableMap';

interface TableActionPopoverProps {
  table: POSTable | null;
  onClose: () => void;
  onConfirmOpenTable: (table: POSTable, guests: number) => void;
}

export const TableActionPopover: React.FC<TableActionPopoverProps> = ({
  table,
  onClose,
  onConfirmOpenTable,
}) => {
  const [selectedGuests, setSelectedGuests] = useState(6);

  if (!table) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-[#1F2535]/30 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-[360px] bg-[#FFFDF7] rounded-2xl p-6 shadow-2xl border border-[#CFC3A6]/40 z-10 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1F2535]">Mở bàn {table.name}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E1EDDD] text-[#2F6140] border border-[#8DBB98]">
              ● Trống
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-[#5F6575]">{table.capacity} ghế · kê thêm tối đa +1 ghế</p>

        {/* Warning banner */}
        <div className="p-3 bg-[#F8E7BE] border border-[#D9A63E] rounded-xl text-xs text-[#7A4E06] font-medium">
          ⚠️ Bàn có lượt đặt lúc 19:30 (còn 40′). Tiếp tục phục vụ?
        </div>

        {/* Keypad 1-8 */}
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedGuests(num)}
              className={`h-11 rounded-xl font-bold text-sm transition-all ${
                selectedGuests === num
                  ? 'bg-[#1F2535] text-[#FBF5E4] shadow-sm'
                  : 'bg-[#F3EAD3] text-[#1F2535] hover:bg-[#CFC3A6]'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirmOpenTable(table, selectedGuests)}
          className="w-full py-3 bg-[#F25C14] hover:bg-[#d84e0e] text-[#FFF9F0] text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          Vẫn mở bàn, vào gọi món
        </button>
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/staff/table-map/TableActionPopover.tsx
git commit -m "feat(pos): create TableActionPopover component"
```

---

### Task 9: Assemble Full POS Table Map Page

**Files:**
- Create: `src/app/staff/table-map/page.tsx`

**Interfaces:**
- Consumes: All components from Tasks 2-8
- Produces: Complete `/staff/table-map` page route

- [ ] **Step 1: Write Full Table Map Page**

```tsx
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
  { id: 'B1', name: 'B1', shape: 'Round', status: 'EMPTY', area: 'Tầng 1', capacity: 2, x: 36, y: 32, width: 96, height: 96 },
  { id: 'B2', name: 'B2', shape: 'Square', status: 'OCCUPIED', area: 'Tầng 1', capacity: 4, durationMinutes: 35, note: '35′ · Nhóm', linkedGroupTableIds: ['B6'], x: 168, y: 32, width: 112, height: 112 },
  { id: 'B3', name: 'B3', shape: 'Square', status: 'RESERVED', area: 'Tầng 1', capacity: 4, reservedTime: '19:45', x: 308, y: 32, width: 112, height: 112 },
  { id: 'B8', name: 'B8', shape: 'Round', status: 'CLEAN', area: 'Tầng 1', capacity: 2, x: 628, y: 104, width: 96, height: 96 },
  { id: 'B4', name: 'B4', shape: 'Square', status: 'OCCUPIED', area: 'Tầng 1', capacity: 4, isMainMerged: true, mergedWithId: 'B5', note: 'Chính', x: 36, y: 212, width: 112, height: 112 },
  { id: 'B5', name: 'B5', shape: 'Square', status: 'OCCUPIED', area: 'Tầng 1', capacity: 4, isSubMerged: true, mergedWithId: 'B4', note: 'Phụ', x: 160, y: 212, width: 112, height: 112 },
  { id: 'B6', name: 'B6', shape: 'Square', status: 'OCCUPIED', area: 'Tầng 1', capacity: 4, durationMinutes: 25, note: '25′ · Nhóm', linkedGroupTableIds: ['B2'], x: 348, y: 212, width: 112, height: 112 },
  { id: 'B7', name: 'B7', shape: 'Long', status: 'PAY', area: 'Tầng 1', capacity: 6, currentGuests: 5, durationMinutes: 85, x: 488, y: 212, width: 192, height: 112 },
  { id: 'B9', name: 'B9', shape: 'Round', status: 'EMPTY', area: 'Tầng 1', capacity: 2, x: 36, y: 400, width: 96, height: 96 },
  { id: 'B10', name: 'B10', shape: 'Square', status: 'OCCUPIED', area: 'Tầng 1', capacity: 4, currentGuests: 5, note: '+1 ghế', x: 168, y: 396, width: 112, height: 112 },
  { id: 'B11', name: 'B11', shape: 'Long', status: 'LATE', area: 'Tầng 1', capacity: 6, reservedTime: '19:30', note: 'Trễ 25′', x: 308, y: 396, width: 192, height: 112 },
  { id: 'B12', name: 'B12', shape: 'Long', status: 'EMPTY', area: 'Tầng 1', capacity: 8, note: 'Có đặt 19:30 (còn 40′)', x: 524, y: 396, width: 224, height: 112 },
];

const INITIAL_RESERVATIONS: ReservationItem[] = [
  { id: 'R1', customerName: 'Anh Nam', phone: '0901234567', time: '19:30', guestCount: 6, tableId: 'B11', status: 'LATE', lateMinutes: 25 },
  { id: 'R2', customerName: 'Chị Lan', phone: '0987654321', time: '19:45', guestCount: 2, tableId: 'B3', status: 'NORMAL', remainingMinutes: 18 },
];

export default function POSTableMapPage() {
  const [activeArea, setActiveArea] = useState<TableArea>('Tầng 1');
  const [activeFilter, setActiveFilter] = useState<TableStatus | 'ALL'>('ALL');
  const [selectedTable, setSelectedTable] = useState<POSTable | null>(INITIAL_TABLES[6]); // B6 default selected
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [popoverTable, setPopoverTable] = useState<POSTable | null>(null);

  const handleTableSelect = (table: POSTable) => {
    setSelectedTable(table);
    if (table.status === 'EMPTY' && table.note?.includes('Có đặt')) {
      setPopoverTable(table);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF5E4] text-[#1F2535] flex flex-col">
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
            'Tầng 1': { available: 3, total: 12 },
            'Sân vườn': { available: 6, total: 6 },
            'Phòng VIP': { available: 0, total: 4 },
            'Quầy bar': { available: 3, total: 5 },
          }}
        />

        {/* Status Chips */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/staff/table-map/page.tsx
git commit -m "feat(pos): assemble complete POS Table Map v2 page route"
```
