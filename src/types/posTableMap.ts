export type TableStatus = 'EMPTY' | 'OCCUPIED' | 'PAY' | 'RESERVED' | 'CLEAN' | 'LATE';
export type TableShape = 'Round' | 'Square' | 'Long';
export type TableArea = 'Floor 1' | 'Garden' | 'VIP Room' | 'Bar Area';

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
