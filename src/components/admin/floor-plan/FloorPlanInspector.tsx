'use client'

import React, { memo } from 'react'
import { IFloorItemPayload, TableShape, getEffectiveDimensions } from '@/interfaces'
import { SlidersHorizontal, Trash2, UtensilsCrossed, Box, RotateCw, Maximize2 } from 'lucide-react'

interface FloorPlanInspectorProps {
    selectedItem: IFloorItemPayload | null
    selectedIndex: number | null
    onUpdateItem: (index: number, updates: Partial<IFloorItemPayload>) => void
    onRotateItem: (index: number) => void
    onRemoveItem: (index: number) => void
}

export const FloorPlanInspector: React.FC<FloorPlanInspectorProps> = memo(({
    selectedItem,
    selectedIndex,
    onUpdateItem,
    onRotateItem,
    onRemoveItem,
}) => {
    const selectedEffective = selectedItem
        ? getEffectiveDimensions(selectedItem.w, selectedItem.h, selectedItem.rotation ?? 0)
        : null

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-700" />
                    <span>Item Properties</span>
                </h3>
                {selectedItem && selectedIndex !== null && (
                    <button
                        onClick={() => onRemoveItem(selectedIndex)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100/80 transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                        title="Remove from layout"
                    >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                    </button>
                )}
            </div>

            {selectedItem && selectedIndex !== null ? (
                <div className="space-y-3.5 text-xs">
                    <div>
                        <span className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                            Type:
                        </span>
                        <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 font-medium text-stone-900 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                {selectedItem.kind === 'TABLE' ? (
                                    <>
                                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                                        <strong>Dining Table #{selectedItem.tableId}</strong>
                                    </>
                                ) : (
                                    <>
                                        <Box className="w-3.5 h-3.5 text-stone-600" />
                                        <strong>Obstacle ({selectedItem.kind})</strong>
                                    </>
                                )}
                            </span>
                            <span className="text-[11px] font-mono text-stone-400">#{selectedIndex}</span>
                        </div>
                    </div>

                    {selectedItem.kind === 'TABLE' && (
                        <div>
                            <label className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                                Shape:
                            </label>
                            <select
                                value={selectedItem.shape || 'SQUARE'}
                                onChange={(e) =>
                                    onUpdateItem(selectedIndex, { shape: e.target.value as TableShape })
                                }
                                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-medium outline-none focus:border-amber-600 text-stone-900 cursor-pointer"
                            >
                                <option value="SQUARE">Square</option>
                                <option value="ROUND">Round</option>
                                <option value="LONG">Long / Rectangle</option>
                            </select>
                        </div>
                    )}

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                                Position X:
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={selectedItem.x}
                                onChange={(e) =>
                                    onUpdateItem(selectedIndex, { x: Math.max(0, Number(e.target.value)) })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                                Position Y:
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={selectedItem.y}
                                onChange={(e) =>
                                    onUpdateItem(selectedIndex, { y: Math.max(0, Number(e.target.value)) })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                                Width (W):
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={selectedItem.w}
                                onChange={(e) =>
                                    onUpdateItem(selectedIndex, { w: Math.max(1, Number(e.target.value)) })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                        <div>
                            <label className="font-semibold text-stone-600 uppercase tracking-wider block mb-1">
                                Height (H):
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={selectedItem.h}
                                onChange={(e) =>
                                    onUpdateItem(selectedIndex, { h: Math.max(1, Number(e.target.value)) })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-stone-300 outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                    </div>

                    {/* Rotation */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-700">Rotation:</span>
                            <button
                                onClick={() => onRotateItem(selectedIndex)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-mono font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                                title="Rotate +90°"
                            >
                                <RotateCw className="w-3 h-3" />
                                <span>{selectedItem.rotation || 0}°</span>
                            </button>
                        </div>
                        {selectedEffective && (
                            <p className="text-[11px] text-stone-600 flex items-center gap-1">
                                <Maximize2 className="w-3 h-3 text-stone-400" />
                                Effective Size: <strong className="font-mono text-stone-900">{selectedEffective.effW} × {selectedEffective.effH}</strong>
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center text-stone-400 text-xs italic">
                    Select an item or dining table on the layout to inspect and customize.
                </div>
            )}
        </div>
    )
})

FloorPlanInspector.displayName = 'FloorPlanInspector'
