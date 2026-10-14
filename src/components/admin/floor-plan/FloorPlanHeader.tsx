'use client'

import React, { memo } from 'react'
import { IArea } from '@/interfaces'
import { MapPin, Maximize2, ShieldCheck, RotateCcw, Save, Loader2, Undo2 } from 'lucide-react'

interface FloorPlanHeaderProps {
    areas: IArea[]
    selectedAreaId: number | null
    currentArea: IArea | null
    isLoading: boolean
    isSaving: boolean
    isDirty?: boolean
    hasErrors: boolean
    onSelectArea: (id: number) => void
    onRefresh: () => void
    onResetDraft?: () => void
    onSave: () => void
}

export const FloorPlanHeader: React.FC<FloorPlanHeaderProps> = memo(({
    areas,
    selectedAreaId,
    currentArea,
    isLoading,
    isSaving,
    isDirty,
    hasErrors,
    onSelectArea,
    onRefresh,
    onResetDraft,
    onSave,
}) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
                        Area:
                    </label>
                    <div className="relative">
                        <select
                            value={selectedAreaId || ''}
                            onChange={(e) => onSelectArea(Number(e.target.value))}
                            disabled={isLoading || isSaving}
                            className="pl-3 pr-8 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-sm font-semibold text-stone-900 focus:border-amber-600 focus:bg-white outline-none appearance-none cursor-pointer"
                        >
                            {areas.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name} ({a.gridW}×{a.gridH})
                                </option>
                            ))}
                        </select>
                        <MapPin className="w-3.5 h-3.5 absolute right-2.5 top-3 text-stone-400 pointer-events-none" />
                    </div>
                </div>

                {currentArea && (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200">
                            <Maximize2 className="w-3.5 h-3.5 text-stone-500" />
                            Grid: <strong className="font-mono text-stone-900">{currentArea.gridW} × {currentArea.gridH}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Version: <strong className="font-mono text-emerald-950">v{currentArea.layoutVersion}</strong>
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onRefresh}
                    disabled={isLoading || isSaving}
                    className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 font-semibold text-sm transition-all flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                    title="Reload layout from server"
                >
                    <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
                    <span>Refresh</span>
                </button>

                {isDirty && onResetDraft && (
                    <button
                        onClick={onResetDraft}
                        disabled={isLoading || isSaving}
                        className="px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-sm transition-all flex items-center gap-1.5 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        title="Discard draft changes and revert to server version"
                    >
                        <Undo2 className="w-4 h-4 text-amber-700" />
                        <span>Discard Changes</span>
                    </button>
                )}

                <button
                    onClick={onSave}
                    disabled={isSaving || isLoading}
                    className={`px-5 py-2 rounded-xl text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                        hasErrors
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    }`}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Saving...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            <span>Save Layout</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    )
})

FloorPlanHeader.displayName = 'FloorPlanHeader'
