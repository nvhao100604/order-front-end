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
  selectedTableId,
  onTableSelect,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-stone-200 p-8 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:20px_20px] shadow-sm min-h-[520px]">
      {tables.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
          No tables found for this area or filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {tables.map((table) => (
            <TableTile
              key={table.id}
              table={table}
              isSelected={selectedTableId === table.id}
              onClick={onTableSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
