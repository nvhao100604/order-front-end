'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { IFloorItem, getEffectiveDimensions } from '@/interfaces';
import { TableTile } from './TableTile';
import { FloorObstacle } from './FloorObstacle';

interface FloorPlanCanvasProps {
  tables: POSTable[];
  floorItems?: IFloorItem[];
  selectedTableId: string | null;
  onTableSelect: (table: POSTable) => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  tables,
  floorItems = [],
  selectedTableId,
  onTableSelect,
}) => {
  const obstacles = floorItems.filter((item) => item.kind !== 'TABLE');

  return (
    <div className="relative w-[776px] h-[576px] bg-[#FFFDF7] rounded-2xl shadow-sm border border-[#CFC3A6]/30 overflow-hidden">
      {/* Architectural Obstacles: from backend floorItems if present, else default fallback */}
      {obstacles.length > 0 ? (
        obstacles.map((obs, idx) => {
          const eff = getEffectiveDimensions(obs.w, obs.h, obs.rotation ?? 0);
          return (
            <FloorObstacle
              key={obs.id || idx}
              label={obs.kind}
              x={Math.round(obs.x * 28)}
              y={Math.round(obs.y * 28)}
              width={Math.round(eff.effW * 28)}
              height={Math.round(eff.effH * 28)}
            />
          );
        })
      ) : (
        <>
          <FloorObstacle label="Bar Counter" x={544} y={32} width={196} height={44} />
          <FloorObstacle label="Pillar" x={452} y={60} width={40} height={32} />
          <FloorObstacle label="Entrance" x={24} y={516} width={120} height={28} />
          <FloorObstacle label="Stairs" x={632} y={516} width={120} height={28} />
        </>
      )}

      {/* Dynamic Merged Table Link Overlay */}
      {tables
        .filter((t) => t.mergedWithId)
        .map((table) => {
          const target = tables.find((t) => t.id === table.mergedWithId);
          if (!target) return null;
          return (
            <svg
              key={`link-${table.id}-${target.id}`}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <line
                x1={table.x + table.width / 2}
                y1={table.y + table.height / 2}
                x2={target.x + target.width / 2}
                y2={target.y + target.height / 2}
                stroke="#D9A63E"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
            </svg>
          );
        })}

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
