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
 * Maps coordinates, effective sizes, cluster keys, and live table statuses.
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
    const cluster = rawTable?.clusterKey ?? (rawTable as any)?.cluster_key ?? null;

    return {
      id: tableId,
      name: tableName,
      shape: normalizeShape(item.shape),
      status: (rawTable?.status || 'EMPTY') as POSTable['status'],
      area: areaName as TableArea,
      capacity: rawTable?.maxCapacity || 4,
      clusterKey: cluster,
      mergedWithId: cluster,
      x: Math.round(item.x * cellSize),
      y: Math.round(item.y * cellSize),
      width: Math.max(Math.round(eff.effW * cellSize), 60),
      height: Math.max(Math.round(eff.effH * cellSize), 60),
    };
  });
}

/**
 * Fallback arrangement for raw tables when area layout items are not yet created in editor.
 */
export function mapBackendTablesToPOSTables(
  rawTables: ITableResponse[],
  areaName: string = 'Floor 1'
): POSTable[] {
  return rawTables.map((t, idx) => {
    const inferredCapacity = t.maxCapacity || (t.id <= 2 ? 2 : t.id <= 4 ? 4 : 8);
    const shape: TableShape = inferredCapacity > 4 ? 'Long' : inferredCapacity === 2 ? 'Round' : 'Square';
    const width = shape === 'Long' ? 192 : shape === 'Round' ? 112 : 128;
    const height = 128;

    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const cluster = t.clusterKey ?? (t as any).cluster_key ?? null;

    return {
      id: `B${t.id}`,
      name: `B${t.number || t.id}`,
      shape,
      status: t.status as POSTable['status'],
      area: areaName as TableArea,
      capacity: inferredCapacity,
      clusterKey: cluster,
      mergedWithId: cluster,
      x: 36 + col * 220,
      y: 36 + row * 160,
      width,
      height,
    };
  });
}
