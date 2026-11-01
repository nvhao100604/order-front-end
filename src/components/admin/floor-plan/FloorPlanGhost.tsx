'use client'

import React, { memo } from 'react'
import { createPortal } from 'react-dom'
import { IFloorItemPayload, getEffectiveDimensions } from '@/interfaces'
import { SnapTarget } from '@/utils/gridSnap'
import { Check, X, RotateCw } from 'lucide-react'

interface FloorPlanGhostProps {
    dragItem: IFloorItemPayload
    snapTarget: SnapTarget | null
    cellSize: number
    floatingPos: { x: number; y: number } | null
    grabOffset?: { x: number; y: number }
}

export const FloorPlanGhost: React.FC<FloorPlanGhostProps> = memo(({
    dragItem,
    snapTarget,
    cellSize,
    floatingPos,
    grabOffset,
}) => {
    const eff = getEffectiveDimensions(dragItem.w, dragItem.h, dragItem.rotation ?? 0)

    const posX = floatingPos ? floatingPos.x - (grabOffset?.x ?? 0) : 0
    const posY = floatingPos ? floatingPos.y - (grabOffset?.y ?? 0) : 0

    return (
        <>
            {/* 1. Snap Target Frame on Grid */}
            {snapTarget && (
                <div
                    className={`absolute pointer-events-none z-30 transition-all duration-75 flex flex-col items-center justify-center border-2 border-dashed ${
                        snapTarget.isValid
                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-950 shadow-md ring-2 ring-emerald-400/30'
                            : 'border-red-500 bg-red-500/25 text-red-950 ring-2 ring-red-400/30 animate-pulse'
                    } ${
                        dragItem.shape === 'ROUND'
                            ? 'rounded-full'
                            : 'rounded-xl'
                    }`}
                    style={{
                        left: `${snapTarget.x * cellSize}px`,
                        top: `${snapTarget.y * cellSize}px`,
                        width: `${snapTarget.effW * cellSize}px`,
                        height: `${snapTarget.effH * cellSize}px`,
                    }}
                >
                    <div className="flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-white/80 backdrop-blur-xs shadow-xs">
                        {snapTarget.isValid ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                                <span className="hidden sm:inline">Snapped ({snapTarget.x}, {snapTarget.y})</span>
                            </>
                        ) : (
                            <>
                                <X className="w-3.5 h-3.5 text-red-600 stroke-[3]" />
                                <span className="hidden sm:inline">Cannot place</span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* 2. Floating Drag Avatar with GPU hardware-accelerated translate3d via React Portal */}
            {floatingPos && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed pointer-events-none z-50 will-change-transform top-0 left-0"
                    style={{
                        transform: `translate3d(${posX}px, ${posY}px, 0)`,
                        width: `${eff.effW * cellSize}px`,
                        height: `${eff.effH * cellSize}px`,
                    }}
                >
                    <div
                        className={`w-full h-full flex flex-col items-center justify-center p-2 shadow-2xl opacity-95 border-2 border-amber-600 bg-amber-500/35 backdrop-blur-xs select-none relative ${
                            dragItem.shape === 'ROUND' ? 'rounded-full' : 'rounded-xl'
                        }`}
                    >
                        <span className="font-extrabold text-xs text-amber-950 truncate max-w-full drop-shadow-xs">
                            {dragItem.kind === 'TABLE'
                                ? `Table #${dragItem.tableId || 'New'}`
                                : dragItem.kind}
                        </span>
                        <span className="text-[10px] font-mono text-amber-950/80 font-bold mt-0.5">
                            {eff.effW}×{eff.effH} · {dragItem.rotation || 0}°
                        </span>

                        {/* Keyboard shortcut hint */}
                        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg ring-1 ring-white/20">
                            <RotateCw className="w-2.5 h-2.5 text-amber-400" />
                            <span>Press <strong>R</strong> to rotate</span>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
})

FloorPlanGhost.displayName = 'FloorPlanGhost'
