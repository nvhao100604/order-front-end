# POS Table Map & Reservation System (Figma v2) Design Specification

## 1. Overview
Build a high-performance, modular, interactive POS Table Map & Reservation System for restaurant staff, following the exact **Figma v2 Warm Light/Editorial Theme** specification (File Key: `MWCqVFtxkQdWZ6tZvFAazs`).

## 2. File Structure & Component Modularization

```
src/
├── app/
│   └── staff/
│       └── table-map/
│           └── page.tsx                    # Main Page Route for /staff/table-map
├── components/
│   └── staff/
│       └── table-map/
│           ├── POSHeader.tsx               # Top Header Bar (Brand, Tabs, Actions, Avatar)
│           ├── AreaTabSelector.tsx         # Area Floor Selector (Tầng 1, Sân vườn, VIP, Bar)
│           ├── StatusFilterChips.tsx       # Pill Filter Chips (Tất cả, Trống, Đang ăn, Chờ TT...)
│           ├── FloorPlanCanvas.tsx         # Main Floor Plan Canvas container
│           ├── FloorObstacle.tsx           # Fixed Obstacle elements (Quầy bar, Cột, Cửa, Cầu thang)
│           ├── TableTile.tsx               # Interactive Table Tile (Shapes, Status colors, Meta)
│           ├── TableMergeHull.tsx          # Hull container for merged tables (e.g. B4+B5)
│           ├── TableLinkDashedLine.tsx     # Dashed connector between linked order tables (B2-B6)
│           ├── TableQuickPanel.tsx         # Right sidebar detail panel for active selected table
│           ├── UpcomingReservations.tsx    # Upcoming reservations widget (60 mins)
│           ├── NewReservationDrawer.tsx    # Slide-over Drawer for creating new reservation
│           ├── TableActionPopover.tsx      # Popover modal when opening empty table with reservations
│           └── LegendBar.tsx               # Bottom legend status dot indicators
└── types/
    └── posTableMap.ts                      # TypeScript interfaces and state models
```

## 3. Visual & Aesthetic Tokens (Figma v2 Specs)
- **Page Background**: `#FBF5E4` (Warm Light Cream)
- **Canvas & Card Background**: `#FFFDF7` with `box-shadow: 0 4px 24px rgba(31, 37, 53, 0.08)`, border-radius 20px
- **Header Background**: `#1F2535` (Navy Dark Header)
- **Primary Brand Color**: `#F25C14` (Warm Terracotta Orange), text `#FFF9F0`
- **Status Palettes**:
  - `EMPTY`: Bg `#E1EDDD`, Border `#8DBB98`, Text `#2F6140`
  - `OCCUPIED`: Bg `#F8E7BE`, Border `#D9A63E`, Text `#7A4E06`
  - `PAY`: Bg `#DAEBF1`, Border `#7FB1C4`, Text `#245A72`
  - `RESERVED`: Bg `#E4E5F6`, Border `#9B9FDB`, Text `#3F4498`
  - `CLEAN`: Bg `#EDE6D6`, Border `#A89F89` (Dashed), Text `#5C574A`
  - `LATE`: Bg `#F8DCD5`, Border `#D4806F`, Text `#962B1A`

## 4. State Management Contract
- `activeArea`: `"Tầng 1" | "Sân vườn" | "Phòng VIP" | "Quầy bar"`
- `statusFilter`: `"ALL" | "EMPTY" | "OCCUPIED" | "PAY" | "RESERVED" | "CLEAN" | "LATE"`
- `selectedTableId`: string | null
- `isReservationDrawerOpen`: boolean
- `popoverTableId`: string | null
