'use client'

import React, { memo } from 'react'
import { FloorItemKind } from '@/interfaces'
import { Layers, Columns3, Wine, DoorOpen, Footprints, GripVertical } from 'lucide-react'

interface FloorPlanObstaclePaletteProps {
    onAddObstacle: (kind: FloorItemKind) => void
    onPointerDownObstacle?: (e: React.PointerEvent, kind: FloorItemKind) => void
}

export const FloorPlanObstaclePalette: React.FC<FloorPlanObstaclePaletteProps> = memo(({
    onAddObstacle,
    onPointerDownObstacle,
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>Obstacles & Architecture</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                    onPointerDown={(e) => onPointerDownObstacle?.(e, 'PILLAR')}
                    onClick={() => onAddObstacle('PILLAR')}
                    className="p-2.5 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-grab active:cursor-grabbing touch-none select-none group"
                    title="Click to add or drag onto the floor plan"
                >
                    <GripVertical className="w-3 h-3 text-stone-300 group-hover:text-stone-500 shrink-0" />
                    <Columns3 className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                    <span>Pillar</span>
                </button>
                <button
                    onPointerDown={(e) => onPointerDownObstacle?.(e, 'BAR')}
                    onClick={() => onAddObstacle('BAR')}
                    className="p-2.5 rounded-xl border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-900 font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-grab active:cursor-grabbing touch-none select-none group"
                    title="Click to add or drag onto the floor plan"
                >
                    <GripVertical className="w-3 h-3 text-purple-300 group-hover:text-purple-500 shrink-0" />
                    <Wine className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Bar Counter</span>
                </button>
                <button
                    onPointerDown={(e) => onPointerDownObstacle?.(e, 'DOOR')}
                    onClick={() => onAddObstacle('DOOR')}
                    className="p-2.5 rounded-xl border border-sky-200 hover:border-sky-400 hover:bg-sky-50 text-sky-900 font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-grab active:cursor-grabbing touch-none select-none group"
                    title="Click to add or drag onto the floor plan"
                >
                    <GripVertical className="w-3 h-3 text-sky-300 group-hover:text-sky-500 shrink-0" />
                    <DoorOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Door</span>
                </button>
                <button
                    onPointerDown={(e) => onPointerDownObstacle?.(e, 'STAIRS')}
                    onClick={() => onAddObstacle('STAIRS')}
                    className="p-2.5 rounded-xl border border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-orange-900 font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-grab active:cursor-grabbing touch-none select-none group"
                    title="Click to add or drag onto the floor plan"
                >
                    <GripVertical className="w-3 h-3 text-orange-300 group-hover:text-orange-500 shrink-0" />
                    <Footprints className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                    <span>Stairs</span>
                </button>
            </div>
            <p className="text-[11px] text-stone-600 italic">
                Click to add or drag directly onto the grid.
            </p>
        </div>
    )
})

FloorPlanObstaclePalette.displayName = 'FloorPlanObstaclePalette'
