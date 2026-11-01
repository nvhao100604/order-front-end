'use client'

import React, { memo } from 'react'
import { IArea, IFloorItemPayload } from '@/interfaces'
import { FloorPlanItem } from './FloorPlanItem'
import { FloorPlanGhost } from './FloorPlanGhost'
import { ActiveDragState } from '@/hooks/useFloorPlanEditor'
import { Loader2, ZoomIn } from 'lucide-react'

interface FloorPlanCanvasProps {
    currentArea: IArea | null
    layoutItems: IFloorItemPayload[]
    selectedIndex: number | null
    validationErrors: { boundaryErrors: Set<number>; collisions: Set<number> }
    cellSize: number
    isLoading: boolean
    gridRef: React.RefObject<HTMLDivElement | null>
    activeDrag: ActiveDragState | null
    onCellSizeChange: (size: number) => void
    onPointerDownItem: (e: React.PointerEvent, index: number) => void
    onRotateItem: (index: number) => void
    onDeselect: () => void
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = memo(({
    currentArea,
    layoutItems,
    selectedIndex,
    validationErrors,
    cellSize,
    isLoading,
    gridRef,
    activeDrag,
    onCellSizeChange,
    onPointerDownItem,
    onRotateItem,
    onDeselect,
}) => {
    return (
        <div className="space-y-4">
            {/* Zoom / Grid Scale Controls */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-stone-200/80 text-xs text-stone-700 shadow-sm">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-stone-600 flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-stone-400" />
                        Grid Scale:
                    </span>
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                        {[22, 26, 30, 34].map((sz) => (
                            <button
                                key={sz}
                                onClick={() => onCellSizeChange(sz)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    cellSize === sz
                                        ? 'bg-white text-stone-900 shadow-xs'
                                        : 'text-stone-600 hover:text-stone-900'
                                }`}
                            >
                                {sz}px
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200 inline-block" />
                        Dining Table
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-stone-500 ring-2 ring-stone-200 inline-block" />
                        Obstacle
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-200 inline-block" />
                        Collision / Bounds
                    </span>
                </div>
            </div>

            {/* Canvas Scroll Area */}
            <div
                className="bg-stone-50/80 p-6 rounded-2xl border border-stone-200/80 overflow-auto relative select-none max-h-[640px]"
                style={{ minHeight: '480px' }}
            >
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-30 flex items-center justify-center gap-2 font-medium text-stone-800">
                        <Loader2 className="w-5 h-5 animate-spin text-amber-700" />
                        <span>Loading floor layout...</span>
                    </div>
                )}

                {currentArea && (
                    <div
                        ref={gridRef}
                        className="relative bg-white border border-stone-300 rounded-xl shadow-inner transition-all mx-auto touch-none"
                        style={{
                            width: `${currentArea.gridW * cellSize}px`,
                            height: `${currentArea.gridH * cellSize}px`,
                            backgroundImage: `
                                linear-gradient(to right, rgba(120, 113, 108, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(120, 113, 108, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: `${cellSize}px ${cellSize}px`,
                        }}
                        onClick={onDeselect}
                    >
                        {/* Snap Target & Floating Ghost Preview during Active Drag */}
                        {activeDrag && (
                            <FloorPlanGhost
                                dragItem={activeDrag.dragItem}
                                snapTarget={activeDrag.snapTarget}
                                cellSize={cellSize}
                                floatingPos={activeDrag.floatingPos}
                                grabOffset={activeDrag.grabOffset}
                            />
                        )}

                        {/* Placed Layout Items */}
                        {layoutItems.map((item, idx) => (
                            <FloorPlanItem
                                key={idx}
                                item={item}
                                index={idx}
                                isSelected={selectedIndex === idx}
                                isBoundaryErr={validationErrors.boundaryErrors.has(idx)}
                                isCollisionErr={validationErrors.collisions.has(idx)}
                                cellSize={cellSize}
                                isBeingDragged={activeDrag?.source === 'EXISTING' && activeDrag.itemIndex === idx}
                                onPointerDown={onPointerDownItem}
                                onRotate={onRotateItem}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
})

FloorPlanCanvas.displayName = 'FloorPlanCanvas'
