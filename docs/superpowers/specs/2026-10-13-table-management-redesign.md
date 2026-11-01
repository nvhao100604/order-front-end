# Table Management Redesign — Design Spec

**Date:** 2026-10-13  
**Status:** Approved  
**Scope:** Admin Floor Plan + Staff Table Map

---

## 1. Goals

1. Tách Admin Floor Plan Editor ra route riêng `/admin/floor-plan`
2. Kết nối Floor Plan Editor với backend layout API (`/areas/{id}/layout`) thay vì hardcode
3. Quản lý UI drag-and-drop state qua Redux (`floorPlanSlice`) — chỉ lưu DB khi user ấn Save
4. Staff `TableQuickPanel` hiển thị order items thật từ `GET /orders?tableID=X`
5. Staff có thể merge bàn qua `POST /tables/merge`
6. Staff có thể tạo order nhanh trực tiếp từ table map (Quick Order)

**Không làm:** Transfer table (dời order sang bàn khác)

---

## 2. Architecture

### 2.1 Route Structure

```
/admin/floor-plan          ← MỚI: trang riêng cho floor plan editor
/admin                     ← Tab TABLES: chỉ còn danh sách CRUD (bỏ sub-tab LAYOUT)
/staff/table-map           ← Redesign: canvas từ backend, QuickPanel thật, Merge, Quick Order
```

### 2.2 Data Flow — Admin Floor Plan

```
page.tsx (/admin/floor-plan)
  └── FloorPlanEditor
        └── useFloorPlanEditor (refactor: đọc/ghi từ Redux)
              ├── GET /areas → danh sách khu vực (SWR)
              ├── GET /areas/{id}/layout → load vào floorPlanSlice
              │     dispatch(loadLayout(response))
              │     → serverItems = draftItems = response.items
              └── PUT /areas/{id}/layout → khi ấn Save
                    dispatch(commitSave)
                    → success: dispatch(commitSaveSuccess) → isDirty = false
                    → fail: toast error, giữ nguyên draftItems
```

### 2.3 Data Flow — Staff Table Map

```
page.tsx (/staff/table-map)
  ├── useTableMapData (refactor)
  │     ├── GET /areas (lấy danh sách khu vực thật, không dùng DEFAULT_AREAS hardcode)
  │     ├── GET /areas/{id}/layout → canvas render từ IFloorItem[] backend
  │     └── GET /tables (live poll) → trạng thái bàn thật
  │
  ├── TableQuickPanel (refactor)
  │     ├── Props: table + order: IOrderResponse | null
  │     ├── GET /orders?tableID={numericId}&status=PROCESSING → order thật
  │     ├── Nút "Merge" → mở MergeTableModal
  │     └── Nút "Quick Order" → mở QuickOrderDrawer
  │
  ├── MergeTableModal (MỚI)
  │     ├── Hiện danh sách bàn OCCUPIED/EMPTY để chọn bàn merge vào
  │     └── POST /tables/merge → { tableIDs: [id1, id2] } → revalidate
  │
  └── QuickOrderDrawer (MỚI)
        ├── Fetch danh sách món ăn (GET /dishes)
        ├── Staff chọn món, nhập số lượng
        └── POST /orders → { tableID, details[] } → revalidate + đóng drawer
```

---

## 3. Redux: `floorPlanSlice`

### 3.1 State Shape

```ts
interface FloorPlanState {
  // Loaded from backend
  areaId: number | null
  layoutVersion: number
  serverItems: IFloorItemPayload[]

  // Local draft (edits chưa save)
  draftItems: IFloorItemPayload[]
  isDirty: boolean
  isSaving: boolean
  saveError: string | null

  // UI selection
  selectedIndex: number | null
}
```

### 3.2 Actions

| Action | Mô tả |
|--------|-------|
| `loadLayout(IAreaLayoutResponse)` | Load từ backend → set `serverItems` & `draftItems`, reset `isDirty` |
| `moveDraftItem({ index, x, y })` | Cập nhật tọa độ item trong draft → `isDirty = true` |
| `addDraftItem(IFloorItemPayload)` | Thêm bàn/obstacle vào draft → `isDirty = true` |
| `removeDraftItem(index)` | Xóa item khỏi draft → `isDirty = true` |
| `rotateDraftItem(index)` | Xoay item 90° → `isDirty = true` |
| `updateDraftItem({ index, updates })` | Cập nhật thuộc tính khác (shape, label...) |
| `selectItem(index \| null)` | Chọn item để inspect |
| `resetDraft()` | Hủy thay đổi → `draftItems = serverItems`, `isDirty = false` |
| `setSaving(boolean)` | Toggle saving state |
| `commitSaveSuccess()` | Sau khi PUT thành công → `serverItems = draftItems`, `isDirty = false` |
| `setSaveError(string \| null)` | Lưu error message |

### 3.3 Save Flow

```
User ấn "Save Layout"
  → dispatch(setSaving(true))
  → PUT /areas/{areaId}/layout { layoutVersion, items: draftItems }
  → success: dispatch(commitSaveSuccess()) + toast.success
  → fail:    dispatch(setSaveError(msg)) + toast.error
  → finally: dispatch(setSaving(false))
```

---

## 4. Components

### 4.1 New Files

```
src/app/admin/floor-plan/page.tsx
  - Server component wrapper
  - Render FloorPlanEditor (đã có)
  - Link "← Back to Admin" về /admin

src/redux/slices/floorPlanSlice.ts
  - Theo spec Section 3

src/components/staff/table-map/MergeTableModal.tsx
  - Props: isOpen, currentTable: POSTable, allTables: POSTable[], onClose, onMerge
  - Hiện danh sách bàn khác (EMPTY | OCCUPIED), multi-select
  - Confirm → POST /tables/merge → toast → revalidate → onClose

src/components/staff/table-map/QuickOrderDrawer.tsx  
  - Props: isOpen, tableId: number, onClose, onOrderCreated
  - Fetch GET /dishes (categories + items)
  - Staff chọn món, điều chỉnh qty
  - Ấn "Confirm Order" → POST /orders → revalidate → onClose
```

### 4.2 Modified Files

**`hooks/useFloorPlanEditor.ts`**
- Bỏ internal `useState` cho `layoutItems`
- Đọc `draftItems`, `selectedIndex`, `isDirty` từ Redux
- Dispatch actions thay vì `setState`
- `handleSaveLayout` → PUT + dispatch save actions
- `loadAreaLayout` → GET + dispatch `loadLayout`

**`config/tableMapLayout.ts`**
- Xóa `TABLE_LAYOUT_SLOTS` hardcode
- Giữ `DEFAULT_AREAS` làm fallback nếu `/areas` API fail
- Thêm `mapFloorItemsToPOSTables(items: IFloorItem[], backendTables: ITableResponse[])` — merge layout coords với table status

**`hooks/useTableMapData.ts`**
- Thêm: `GET /areas` để lấy danh sách area thật
- Thêm: `GET /areas/{activeAreaId}/layout` để lấy floor items
- Sửa `mapBackendTablesToPOSTables` → dùng `mapFloorItemsToPOSTables` mới
- Thêm: `selectedTableOrder: IOrderResponse | null` — fetch order theo table đang chọn

**`components/staff/table-map/TableQuickPanel.tsx`**
- Thêm prop `order: IOrderResponse | null`
- Hiển thị `order.details` thật (dish name, qty, price từ `IOrderDetailResponse`)
- Hiển thị `order.totalPrice` thật
- Thêm nút "Merge Table" → `onMergeClick()`
- Thêm nút "Quick Order" → `onQuickOrderClick()`
- Bỏ mock data fallback

**`app/staff/table-map/page.tsx`**
- Thêm state: `isMergeModalOpen`, `isQuickOrderOpen`
- Fetch order khi `selectedTable` thay đổi
- Mount `<MergeTableModal>` và `<QuickOrderDrawer>`

**`components/admin/admin.page.tsx`**
- Tab TABLES: thêm link/button "Open Floor Plan Editor →" navigate tới `/admin/floor-plan`
- Bỏ `<FloorPlanEditor>` khỏi inline render

**`components/admin/table-management.component.tsx`**
- Xóa sub-tab `LAYOUT` và `FloorPlanEditor` import
- Chỉ còn view LIST (GridView + TableView)
- Xóa `subTab` state

**`redux/store.ts`**
- Import và register `floorPlanReducer`

---

## 5. API Summary

| Endpoint | Method | Dùng ở đâu | Đã có? |
|----------|--------|------------|--------|
| `/areas` | GET | Staff + Admin | ✅ |
| `/areas/{id}/layout` | GET | Staff canvas + Admin editor | ✅ |
| `/areas/{id}/layout` | PUT | Admin save layout | ✅ |
| `/tables` | GET | Staff poll | ✅ |
| `/tables/merge` | POST | Staff merge | ✅ |
| `/orders?tableID=X&status=PROCESSING` | GET | Staff QuickPanel | ✅ (via getOrders filter) |
| `/orders` | POST | Staff QuickOrder | ✅ |
| `/dishes` | GET | QuickOrderDrawer | ✅ |

---

## 6. Out of Scope

- Transfer table (dời order sang bàn khác) — backend chưa có endpoint
- Split bill
- Real-time WebSocket push (dùng polling interval hiện tại)
- Mobile responsive cho Floor Plan Editor

---

## 7. Testing Approach

- Manual: Admin kéo thả bàn → Discard → confirm rollback về server state
- Manual: Admin kéo thả → Save → reload page → canvas đúng vị trí
- Manual: Staff chọn bàn OCCUPIED → QuickPanel hiện order thật
- Manual: Staff merge 2 bàn → POST /tables/merge → cả 2 bàn update status
- Manual: Staff Quick Order → chọn món → confirm → bàn chuyển sang OCCUPIED
