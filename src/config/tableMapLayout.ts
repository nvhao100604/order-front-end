import { POSTable, TableArea, TableShape } from "@/types/posTableMap";
import { ITableResponse, IFloorItem, getEffectiveDimensions } from "@/interfaces";

export const DEFAULT_AREAS: TableArea[] = ['Floor 1', 'Garden', 'VIP Room', 'Bar Area'];

const normalizeShape = (shape?: string | null): TableShape => {
  const s = (shape || '').toUpperCase();
  if (s === 'ROUND') return 'Round';
  if (s === 'LONG') return 'Long';
  return 'Square';
};

/**
 * Merge raw floor items from backend layout (/areas/{id}/layout) with live backend tables.
 * Maps coordinates, effective sizes, and live table statuses.
 */
export function mapFloorItemsToPOSTables(
  items: IFloorItem[],
  backendTables: ITableResponse[],
  cellSize: number = 28,
  areaName: string = 'Floor 1'
): POSTable[] {
  const tableMap = new Map<number, ITableResponse>();
  backendTables.forEach((t) => {
    tableMap.set(t.id, t);
    if (t.number) {
      tableMap.set(t.number, t);
    }
  });

  const tableFloorItems = items.filter(
    (item) => item.kind === 'TABLE' && item.tableId !== undefined && item.tableId !== null
  );

  // If no floor items configured for this area, fallback to auto-arranging backend tables
  if (tableFloorItems.length === 0 && backendTables.length > 0) {
    return mapBackendTablesToPOSTables(backendTables, areaName);
  }

  return tableFloorItems.map((item, idx) => {
    const rawTable = item.tableId ? tableMap.get(item.tableId) : undefined;
    const eff = getEffectiveDimensions(item.w, item.h, item.rotation ?? 0);

    const tableId = item.tableId ? `B${item.tableId}` : `T${idx + 1}`;
    const tableName = rawTable?.number ? `B${rawTable.number}` : (item.tableId ? `B${item.tableId}` : `B${idx + 1}`);

    return {
      id: tableId,
      name: tableName,
      shape: normalizeShape(item.shape),
      status: (rawTable?.status || 'EMPTY') as POSTable['status'],
      area: areaName as TableArea,
      capacity: rawTable?.maxCapacity || 4,
      x: Math.round(item.x * cellSize),
      y: Math.round(item.y * cellSize),
      width: Math.max(Math.round(eff.effW * cellSize), 60),
      height: Math.max(Math.round(eff.effH * cellSize), 60),
    };
  });
}

/**
 * Fallback grid arrangement for raw tables when area layout items are not yet created in editor.
 */
export function mapBackendTablesToPOSTables(
  rawTables: ITableResponse[],
  areaName: string = 'Floor 1'
): POSTable[] {
  return rawTables.map((t, idx) => {
    const shape: TableShape = t.maxCapacity > 4 ? 'Long' : t.maxCapacity === 2 ? 'Round' : 'Square';
    const width = shape === 'Long' ? 180 : 100;
    const height = 100;

    const col = idx % 4;
    const row = Math.floor(idx / 4);

    return {
      id: `B${t.id}`,
      name: `B${t.number || t.id}`,
      shape,
      status: t.status as POSTable['status'],
      area: areaName as TableArea,
      capacity: t.maxCapacity || 4,
      x: 32 + col * 180,
      y: 32 + row * 130,
      width,
      height,
    };
  });
}
