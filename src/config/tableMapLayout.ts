import { POSTable, TableArea, TableShape } from "@/types/posTableMap";
import { ITableResponse } from "@/interfaces";

export const DEFAULT_AREAS: TableArea[] = ['Floor 1', 'Garden', 'VIP Room', 'Bar Area'];

// Preconfigured coordinate layout for standard restaurant layout
interface TableLayoutSlot {
  shape: TableShape;
  area: TableArea;
  x: number;
  y: number;
  width: number;
  height: number;
}

const TABLE_LAYOUT_SLOTS: Record<number, TableLayoutSlot> = {
  1: { shape: 'Round', area: 'Floor 1', x: 36, y: 32, width: 96, height: 96 },
  2: { shape: 'Square', area: 'Floor 1', x: 168, y: 32, width: 112, height: 112 },
  3: { shape: 'Square', area: 'Floor 1', x: 308, y: 32, width: 112, height: 112 },
  8: { shape: 'Round', area: 'Floor 1', x: 628, y: 104, width: 96, height: 96 },
  4: { shape: 'Square', area: 'Floor 1', x: 36, y: 212, width: 112, height: 112 },
  5: { shape: 'Square', area: 'Floor 1', x: 160, y: 212, width: 112, height: 112 },
  6: { shape: 'Square', area: 'Floor 1', x: 348, y: 212, width: 112, height: 112 },
  7: { shape: 'Long', area: 'Floor 1', x: 488, y: 212, width: 192, height: 112 },
  9: { shape: 'Round', area: 'Floor 1', x: 36, y: 400, width: 96, height: 96 },
  10: { shape: 'Square', area: 'Floor 1', x: 168, y: 396, width: 112, height: 112 },
  11: { shape: 'Long', area: 'Floor 1', x: 308, y: 396, width: 192, height: 112 },
  12: { shape: 'Long', area: 'Floor 1', x: 524, y: 396, width: 224, height: 112 },
};

/**
 * Merge raw backend tables with visual layout coordinates.
 * Falls back to auto-grid arrangement if a table is not in preset slots.
 */
export function mapBackendTablesToPOSTables(rawTables: ITableResponse[]): POSTable[] {
  return rawTables.map((t, idx) => {
    const slot = TABLE_LAYOUT_SLOTS[t.id] || TABLE_LAYOUT_SLOTS[t.number] || {
      shape: (t.maxCapacity > 4 ? 'Long' : t.maxCapacity === 2 ? 'Round' : 'Square') as TableShape,
      area: 'Floor 1' as TableArea,
      x: 36 + (idx % 4) * 180,
      y: 32 + Math.floor(idx / 4) * 160,
      width: t.maxCapacity > 4 ? 192 : 112,
      height: 112,
    };

    return {
      id: `B${t.id}`,
      name: `B${t.number || t.id}`,
      shape: slot.shape,
      status: t.status as POSTable['status'],
      area: slot.area,
      capacity: t.maxCapacity || 4,
      x: slot.x,
      y: slot.y,
      width: slot.width,
      height: slot.height,
    };
  });
}
