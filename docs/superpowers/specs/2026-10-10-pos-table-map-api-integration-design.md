# POS Table Map & Reservation API Integration Design Specification

## 1. Overview
This specification details the end-to-end integration of backend REST APIs with the frontend POS Table Map system (`/staff/table-map`), replacing static mock data with real-time restaurant operations:
- Creating reservations with smart table recommendation.
- Table assignment & table switching.
- Reservation check-in (opening tables & initializing orders).
- Reservation cancellation & table releasing.
- Manual table opening for walk-in guests.
- Real-time polling & multi-area floor plan synchronization.

## 2. API Contract & Endpoints (FastAPI Backend v1)

All endpoints connect to `http://localhost:8080/api/v1` (configured via `NEXT_PUBLIC_API_BASE_URL`):

### 2.1 Areas & Layout
- `GET /areas`: List all dining areas (`AreaResponse[]` -> `id`, `name`, `gridW`, `gridH`, `layoutVersion`).
- `GET /areas/{area_id}/layout`: Fetch layout configuration (`AreaLayoutResponse` -> `items: FloorItemResponse[]`, `tables: TableResponse[]`).

### 2.2 Table Operations & Recommendation
- `GET /tables`: List all tables with capacity & status filter (`TableResponse[]`).
- `GET /tables/recommend?guests={guests}&areaID={areaID}`: Suggest best fitting tables for party size (`TableResponse[]`).
- `POST /tables/{table_id}/open`: Open an empty table for service (sets status `OCCUPIED`).
- `POST /tables/merge`: Merge multiple tables (`body: { tableIDs: number[] }`).
- `POST /tables/{table_id}/split`: Split merged table back to individual tables.
- `POST /tables/{table_id}/close`: Close table and reset status to `EMPTY`.

### 2.3 Reservations
- `GET /reservations`: Paginated list of reservations with filters (`status`, `startDate`, `endDate`, `email`, `phoneNumber`).
- `POST /reservations`: Create new reservation (`ReservationCreate` -> `fullName`, `email`, `phoneNumber`, `numberOfGuests`, `reservationTime`, `specialRequests`, `tableID`, `durationMinutes`).
- `PATCH /reservations/{id}`: Update reservation or assign table (`ReservationUpdate` -> `tableID`, `status`, `numberOfGuests`, `reservationTime`).
- `POST /reservations/{id}/checkin`: Check in confirmed reservation, switch table to `OCCUPIED`, return `orderID` and `tableIDs`.
- `POST /reservations/{id}/cancel`: Cancel reservation, release assigned table back to `EMPTY`.

---

## 3. Architecture & Data Flow

```
                           +------------------------------+
                           |    FastAPI Backend Server    |
                           +---------------+--------------+
                                           ^
                     HTTP REST / SWR Fetch | Polling (10s)
                                           v
                         +-----------------------------------+
                         |      useTableMapData Hook         |
                         |  (Data Merging, SWR Polling,      |
                         |   Optimistic Updates, Mutate)     |
                         +-----------------+-----------------+
                                           |
             +-----------------------------+-----------------------------+
             |                             |                             |
             v                             v                             v
+------------------------+    +------------------------+    +------------------------+
|    FloorPlanCanvas     |    |  UpcomingReservations  |    |  NewReservationDrawer  |
| - Layout & Tables      |    | - Real-time queue      |    | - recommendTables API  |
| - AreaTabSelector      |    | - Check-in -> OCCUPIED |    | - createReservation    |
| - StatusFilterChips    |    | - Assign table modal   |    | - Fallback email phone |
| - TableActionPopover   |    | - Cancel reservation   |    |                        |
+------------------------+    +------------------------+    +------------------------+
```

---

## 4. Component Implementations & Interactions

### 4.1 Services Layer
1. `src/services/area.services.ts`:
   - `getAreas()`
   - `getAreaLayout(areaId: number)`
2. `src/services/table.services.ts`:
   - `openTable(id: number)`
   - `recommendTables(guests: number, areaId?: number)`
   - `mergeTables(tableIds: number[])`
   - `splitTable(id: number)`
   - `closeTable(id: number)`
3. `src/services/reservation.services.ts`:
   - `checkinReservation(id: number)`
   - `assignTable(id: number, tableId: number)`
   - `cancelReservation(id: number)`
   - `createReservation(payload: IReservationPayload)`
   - `getReservations(query: Query<IReservationFilter>)`

### 4.2 State Management: `src/hooks/useTableMapData.ts`
- Uses SWR to fetch:
  - Areas: `getAreas`
  - Tables: `getDashboardTablesSWR` / `getTables`
  - Reservations: `useGetReservations` with date filter set to today
- Computes:
  - `areaCounts`: `{ [areaName]: { available, total } }`
  - `statusCounts`: `{ ALL, EMPTY, OCCUPIED, PAY, RESERVED, CLEAN, LATE }`
  - `filteredTables`: Tables filtered by `activeArea` and `activeStatusFilter`
  - `upcomingReservations`: Today's reservations formatted for `UpcomingReservations`
- Exposes action handlers:
  - `handleCreateReservation`
  - `handleAssignTable`
  - `handleCheckIn`
  - `handleCancelReservation`
  - `handleOpenTable`

### 4.3 NewReservationDrawer
- Real-time guest stepper triggers debounce call to `recommendTables(guests, areaId)`.
- Renders real table options: Table ID, capacity, tag.
- Customer Form:
  - Validates 10-digit phone number.
  - Automatically provisions fallback email `guest.<phone>@restaurant.local` if email is omitted.
  - Formats `reservationTime` to UTC ISO 8601.
- Confirmation sends `POST /reservations`, notifies via toast, revalidates SWR, and closes drawer.

### 4.4 UpcomingReservations & Table Assignment
- Displays reservations for current operational day.
- Computes real-time `remainingMinutes` or `lateMinutes` (`LATE` tag if past reservation time).
- Actions:
  - **Check-in**: Calls `checkinReservation(id)`. Table flips to `OCCUPIED`. Toast alert.
  - **Xếp bàn (Assign Table)**: Opens inline table selector for unassigned reservations (`tableID === null`). Calls `assignTable(id, tableId)`.
  - **Cancel**: Confirms with user, calls `cancelReservation(id)`. Table releases to `EMPTY`.

### 4.5 TableActionPopover (Manual Open Table)
- Triggered when staff clicks an `EMPTY` table.
- If table has reservation in next 45 minutes, shows warning banner.
- Staff selects party size (1-8).
- Clicks "Mở bàn & Vào gọi món" -> calls `openTable(tableId)`, updates status to `OCCUPIED`.

---

## 5. Error Handling & Edge Cases
- Network failures & 4xx/5xx responses show error toast with backend error message (`detail`).
- Background SWR polling every 10 seconds ensures state resilience against concurrent staff actions.
- Form inputs disable during in-flight requests to prevent duplicate submissions.
