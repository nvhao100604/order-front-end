'use client';

import React, { useMemo } from 'react';
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

  // Group tables by clusterKey or cluster identifier
  const clusterGroups = useMemo(() => {
    const groups: Record<string, POSTable[]> = {};
    tables.forEach((t) => {
      const key = t.clusterKey || (t.mergedWithId && String(t.mergedWithId).startsWith('CLUSTER') ? t.mergedWithId : null);
      if (key) {
        if (!groups[key]) groups[key] = [];
        groups[key].push(t);
      }
    });
    return groups;
  }, [tables]);

  // Selected table reference for cross-cluster highlighting
  const selectedTable = useMemo(() => {
    return tables.find((t) => t.id === selectedTableId) || null;
  }, [tables, selectedTableId]);

  return (
    <div className="w-full overflow-x-auto rounded-2xl shadow-sm">
      <div className="relative min-w-[920px] min-h-[580px] bg-[#FCFBF9] bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] rounded-2xl border border-stone-200/80 p-8 select-none">
        {/* Dynamic Merged Table Cluster Linking Overlay */}
        {Object.entries(clusterGroups).map(([clusterKey, groupTables]) => {
          if (groupTables.length < 2) return null;
          const lines = [];
          for (let i = 0; i < groupTables.length - 1; i++) {
            const source = groupTables[i];
            const target = groupTables[i + 1];
            const sX = source.x + (source.capacity > 4 ? 96 : source.capacity <= 2 ? 56 : 64);
            const sY = source.y + (source.capacity <= 2 ? 56 : 64);
            const tX = target.x + (target.capacity > 4 ? 96 : target.capacity <= 2 ? 56 : 64);
            const tY = target.y + (target.capacity <= 2 ? 56 : 64);

            lines.push(
              <line
                key={`link-${source.id}-${target.id}`}
                x1={sX}
                y1={sY}
                x2={tX}
                y2={tY}
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
                className="opacity-80"
              />
            );
          }
          return (
            <svg
              key={`cluster-svg-${clusterKey}`}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            >
              {lines}
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
          tables.map((table) => {
            const isSelected = selectedTableId === table.id;
            const isSameCluster = Boolean(
              selectedTable?.clusterKey &&
              table.clusterKey &&
              selectedTable.clusterKey === table.clusterKey &&
              !isSelected
            );

            return (
              <TableTile
                key={table.id}
                table={table}
                isSelected={isSelected}
                isSameCluster={isSameCluster}
                onClick={onTableSelect}
              />
            );
          })
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
