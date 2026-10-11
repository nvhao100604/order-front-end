import { ITableResponse } from "./ordering.interface";

export type FloorItemKind = "TABLE" | "OBSTACLE" | "WALL";

export interface IFloorItem {
    id: number;
    areaID: number;
    tableId?: number | null;
    kind: FloorItemKind;
    shape?: string | null;
    x: number;
    y: number;
    w: number;
    h: number;
    rotation?: number;
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
    tables: ITableResponse[];
}
