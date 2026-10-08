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
      {/* Fixed Architectural Obstacles */}
      <FloorObstacle label="Bar Counter" x={544} y={32} width={196} height={44} />
      <FloorObstacle label="Pillar" x={452} y={60} width={40} height={32} />
      <FloorObstacle label="Entrance" x={24} y={516} width={120} height={28} />
      <FloorObstacle label="Stairs" x={632} y={516} width={120} height={28} />

      {/* Merged Group Hull (B4 + B5) */}
      <div className="absolute left-[24px] top-[200px] w-[272px] h-[164px] border-2 border-[#D9A63E] rounded-2xl pointer-events-none">
        <div className="absolute -bottom-6 left-6 text-xs font-medium text-[#7A4E06] bg-[#F8E7BE] px-2 py-0.5 rounded-md border border-[#D9A63E]/60 shadow-xs">
          🔗 B4 + B5 · 6/8 guests · 52m
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

      {/* Table Tiles */}
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
