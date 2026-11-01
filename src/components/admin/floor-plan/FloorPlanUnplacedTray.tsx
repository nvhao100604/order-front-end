'use client'

import React, { memo } from 'react'
import { ITableResponse, TableShape } from '@/interfaces'
import { Inbox, Users, ArrowRight, Plus, GripVertical } from 'lucide-react'

interface FloorPlanUnplacedTrayProps {
    unplacedTables: ITableResponse[]
    onPlaceTable: (table: ITableResponse, shape?: TableShape) => void
    onPointerDownTable?: (e: React.PointerEvent, table: ITableResponse, shape?: TableShape) => void
    onCreateNewTable?: () => void
}

export const FloorPlanUnplacedTray: React.FC<FloorPlanUnplacedTrayProps> = memo(({
    unplacedTables,
    onPlaceTable,
    onPointerDownTable,
    onCreateNewTable,
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-amber-700" />
                    <span>Unplaced Tables ({unplacedTables.length})</span>
                </h3>
                {onCreateNewTable && (
                    <button
                        onClick={onCreateNewTable}
                        className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Table</span>
                    </button>
                )}
            </div>

            {unplacedTables.length === 0 ? (
                <div className="py-6 text-center text-stone-400 text-xs italic bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    No unplaced tables waiting.
                </div>
            ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {unplacedTables.map((t) => (
                        <div
                            key={t.id}
                            onPointerDown={(e) => onPointerDownTable?.(e, t)}
                            className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-grab active:cursor-grabbing touch-none select-none group"
                        >
                            <div className="flex items-center gap-2">
                                <GripVertical className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500 transition-colors shrink-0" />
                                <div>
                                    <p className="font-bold text-stone-900 group-hover:text-amber-950">Table #{t.number || t.id}</p>
                                    <p className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-0.5">
                                        <Users className="w-3 h-3 text-stone-400" />
                                        <span>{t.minCapacity}–{t.maxCapacity} guests</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPlaceTable(t)
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                                title="Place immediately on floor plan"
                            >
                                <span>Place</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-[11px] text-stone-600 italic">
                Drag a table card onto the grid or click <strong>Place</strong>.
            </p>
        </div>
    )
})

FloorPlanUnplacedTray.displayName = 'FloorPlanUnplacedTray'
