import { ITableResponse } from "./ordering.interface";

export type FloorItemKind = "TABLE" | "PILLAR" | "BAR" | "DOOR" | "STAIRS" | "OBSTACLE" | "WALL";
export type TableShape = "SQUARE" | "ROUND" | "LONG" | "Square" | "Round" | "Long";

export interface IFloorItemPayload {
    tableId?: number | null; // ID của bàn ăn (null nếu là vật cản/trang trí)
    kind: FloorItemKind;
    shape?: TableShape | null; // Bắt buộc nếu kind === "TABLE"
    x: number;                 // Tọa độ X trên lưới (>= 0)
    y: number;                 // Tọa độ Y trên lưới (>= 0)
    w: number;                 // Chiều rộng ô lưới (> 0)
    h: number;                 // Chiều cao ô lưới (> 0)
    rotation?: number;         // Góc xoay: 0, 90, 180, 270 (mặc định 0)
}

export interface IUpdateLayoutPayload {
    layoutVersion: number;     // layoutVersion hiện tại của area để check optimistic lock
    items: IFloorItemPayload[];
}

export interface IFloorItem extends IFloorItemPayload {
    id: number;
    areaID: number;
}

export interface IArea {
    id: number;
    name: string;
    gridW: number;
    gridH: number;
    layoutVersion: number;
}

export interface IAreaLayoutResponse extends IArea {
    items: IFloorItem[];
    tables: ITableResponse[]; // Danh sách bàn thuộc area sau khi đã sync
}

/**
 * Tính toán kích thước hiệu dụng sau góc xoay (Effective Bounding Box)
 * Khi rotation === 90 hoặc 270: effW = h, effH = w
 * Khi rotation === 0 hoặc 180: effW = w, effH = h
 */
export function getEffectiveDimensions(w: number, h: number, rotation: number = 0): { effW: number; effH: number } {
    const isRotated = rotation === 90 || rotation === 270;
    return {
        effW: isRotated ? h : w,
        effH: isRotated ? w : h,
    };
}
