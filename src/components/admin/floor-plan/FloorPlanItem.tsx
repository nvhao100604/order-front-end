'use client'

import React, { memo } from 'react'
import { IFloorItemPayload, FloorItemKind, getEffectiveDimensions } from '@/interfaces'
import { Columns3, Wine, DoorOpen, Footprints, Box, RotateCw, AlertCircle } from 'lucide-react'

interface FloorPlanItemProps {
    item: IFloorItemPayload
    index: number
    isSelected: boolean
    isBoundaryErr: boolean
    isCollisionErr: boolean
    cellSize: number
    isBeingDragged?: boolean
    onPointerDown: (e: React.PointerEvent, index: number) => void
    onRotate: (index: number) => void
}

const getObstacleDetails = (kind: FloorItemKind) => {
    switch (kind) {
        case 'PILLAR':
            return {
                label: 'Pillar',
                icon: <Columns3 className="w-3.5 h-3.5" />,
                bg: 'bg-stone-200/90 border-stone-400 text-stone-800',
            }
        case 'BAR':
            return {
                label: 'Bar Counter',
                icon: <Wine className="w-3.5 h-3.5" />,
                bg: 'bg-purple-50 border-purple-300 text-purple-900',
            }
        case 'DOOR':
            return {
                label: 'Door',
                icon: <DoorOpen className="w-3.5 h-3.5" />,
                bg: 'bg-sky-50 border-sky-300 text-sky-900',
            }
        case 'STAIRS':
            return {
                label: 'Stairs',
                icon: <Footprints className="w-3.5 h-3.5" />,
                bg: 'bg-orange-50 border-orange-300 text-orange-900',
            }
        default:
            return {
                label: 'Obstacle',
                icon: <Box className="w-3.5 h-3.5" />,
                bg: 'bg-stone-100 border-stone-300 text-stone-800',
            }
    }
}

export const FloorPlanItem: React.FC<FloorPlanItemProps> = memo(({
    item,
    index,
    isSelected,
    isBoundaryErr,
    isCollisionErr,
    cellSize,
    isBeingDragged = false,
    onPointerDown,
    onRotate,
}) => {
    const eff = getEffectiveDimensions(item.w, item.h, item.rotation ?? 0)
    const isErr = isBoundaryErr || isCollisionErr
    const isTable = item.kind === 'TABLE'
    const obstacle = !isTable ? getObstacleDetails(item.kind) : null

    return (
        <div
            onPointerDown={(e) => onPointerDown(e, index)}
            className={`absolute cursor-grab active:cursor-grabbing touch-none flex flex-col items-center justify-center select-none group transition-shadow ${
                isBeingDragged
                    ? 'opacity-30 border-2 border-dashed border-stone-400 pointer-events-none'
                    : isSelected
                    ? 'ring-2 ring-amber-600 ring-offset-2 shadow-lg z-20'
                    : 'hover:shadow-md z-10'
            } ${
                isErr && !isBeingDragged
                    ? 'border-2 border-red-500 bg-red-50 text-red-950 animate-pulse'
                    : isTable
                    ? item.shape === 'ROUND'
                        ? 'rounded-full border-2 border-amber-600 bg-amber-100/90 text-amber-950'
                        : item.shape === 'LONG'
                        ? 'rounded-xl border-2 border-amber-700 bg-amber-200/90 text-amber-950'
                        : 'rounded-xl border-2 border-amber-600 bg-amber-100/90 text-amber-950'
                    : `rounded-lg border-2 ${obstacle?.bg}`
            }`}
            style={{
                left: `${item.x * cellSize}px`,
                top: `${item.y * cellSize}px`,
                width: `${eff.effW * cellSize}px`,
                height: `${eff.effH * cellSize}px`,
            }}
        >
            {/* Content */}
            {isTable ? (
                <div className="flex flex-col items-center justify-center pointer-events-none p-1 text-center">
                    <span className="font-extrabold text-xs tracking-tight text-amber-950">
                        Table #{item.tableId || '?'}
                    </span>
                    <span className="text-[10px] text-amber-800/80 font-mono font-medium mt-0.5">
                        {item.shape || 'SQUARE'} · {item.rotation || 0}°
                    </span>
                </div>
            ) : (
                <div className="flex items-center gap-1.5 pointer-events-none p-1 text-center font-semibold text-xs">
                    {obstacle?.icon}
                    <span className="hidden sm:inline text-[11px]">{obstacle?.label}</span>
                </div>
            )}

            {/* Error Indicator Badge */}
            {isErr && !isBeingDragged && (
                <span
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white w-4 h-4 rounded-full flex items-center justify-center shadow-xs"
                    title={isBoundaryErr ? 'Out of grid boundary' : 'Coordinate collision with another item'}
                >
                    <AlertCircle className="w-3 h-3" />
                </span>
            )}

            {/* Rotation Quick Handle Button */}
            {isSelected && !isBeingDragged && (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRotate(index)
                    }}
                    className="absolute -bottom-2 -right-2 bg-amber-700 hover:bg-amber-800 text-white rounded-full p-1.5 shadow-md z-30 transition-transform active:scale-90 cursor-pointer"
                    title="Rotate +90° (Key R)"
                >
                    <RotateCw className="w-3 h-3" />
                </button>
            )}
        </div>
    )
})

FloorPlanItem.displayName = 'FloorPlanItem'
