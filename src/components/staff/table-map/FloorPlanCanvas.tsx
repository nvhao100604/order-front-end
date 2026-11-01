'use client';

import React from 'react';
import { POSTable } from '@/types/posTableMap';
import { IFloorItem } from '@/interfaces';
import { TableTile } from './TableTile';

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
  // Only filter genuine non-table architectural obstacles that aren't entrance/stairs indicators
  const customObstacles = floorItems.filter(
    (item) => item.kind !== 'TABLE' && item.kind !== 'DOOR' && item.kind !== 'STAIRS'
  );

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-sm">
      <div className="relative min-w-[920px] min-h-[580px] bg-[#FCFBF9] bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] rounded-2xl border border-stone-200/80 p-8 select-none">
        {/* Dynamic Merged Table Link Overlay */}
        {tables
          .filter((t) => t.mergedWithId)
          .map((table) => {
            const target = tables.find((t) => t.id === table.mergedWithId);
            if (!target) return null;
            const tableCenterX =
              table.x + (table.capacity > 4 ? 96 : table.capacity <= 2 ? 56 : 64);
            const tableCenterY = table.y + (table.capacity <= 2 ? 56 : 64);
            const targetCenterX =
              target.x + (target.capacity > 4 ? 96 : target.capacity <= 2 ? 56 : 64);
            const targetCenterY = target.y + (target.capacity <= 2 ? 56 : 64);

            return (
              <svg
                key={`link-${table.id}-${target.id}`}
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
              >
                <line
                  x1={tableCenterX}
                  y1={tableCenterY}
                  x2={targetCenterX}
                  y2={targetCenterY}
                  stroke="#F97316"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              </svg>
            );
          })}

        {/* Custom architectural obstacles from floorItems (e.g. Bar, Pillar) */}
        {customObstacles.map((obs, idx) => (
          <div
            key={obs.id || idx}
            style={{
              left: `${Math.round(obs.x * 28)}px`,
              top: `${Math.round(obs.y * 28)}px`,
              width: `${Math.round(obs.w * 28)}px`,
              height: `${Math.round(obs.h * 28)}px`,
            }}
            className="absolute bg-stone-100 border border-stone-300 text-stone-600 rounded-xl text-xs font-semibold flex items-center justify-center uppercase tracking-wider select-none shadow-2xs"
          >
            {obs.kind}
          </div>
        ))}

        {/* Table Tiles positioned by coordinates with their real physical shapes */}
        {tables.length === 0 ? (
          <div className="flex items-center justify-center h-80 text-stone-400 text-sm">
            No tables found for this area or filter.
          </div>
        ) : (
          tables.map((table) => (
            <TableTile
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              onClick={onTableSelect}
            />
          ))
        )}

        {/* Architectural Floor Indicators (Entrance & Stairs) */}
        <div className="absolute bottom-6 left-8 px-5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-500 text-xs font-semibold uppercase tracking-widest select-none shadow-2xs">
          Entrance
        </div>

        <div className="absolute bottom-6 right-8 px-5 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-500 text-xs font-semibold uppercase tracking-widest select-none shadow-2xs">
          Stairs
        </div>
      </div>
    </div>
  );
};
