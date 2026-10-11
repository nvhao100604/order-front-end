'use client'

import React, { memo } from 'react'
import { TableStatus } from '@/interfaces'
import { LayoutGrid, List, Plus } from 'lucide-react'

interface TableListToolbarProps {
    selectedStatus: TableStatus | 'ALL'
    totalCount: number
    viewMode: 'GRID' | 'TABLE'
    onStatusChange: (status: TableStatus | 'ALL') => void
    onViewModeChange: (mode: 'GRID' | 'TABLE') => void
    onOpenAddModal: () => void
}

export const TableListToolbar: React.FC<TableListToolbarProps> = memo(({
    selectedStatus,
    totalCount,
    viewMode,
    onStatusChange,
    onViewModeChange,
    onOpenAddModal,
}) => {
    return (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-stone-200/80">
            <div className="flex items-center gap-3">
                <select
                    value={selectedStatus}
                    onChange={(e) => onStatusChange(e.target.value as TableStatus | 'ALL')}
                    className="px-4 py-2 rounded-xl border border-stone-300 bg-stone-50/50 text-sm font-semibold text-stone-900 focus:border-amber-600 focus:bg-white outline-none cursor-pointer"
                >
                    <option value="ALL">All Statuses ({totalCount})</option>
                    <option value="EMPTY">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="RESERVED">Reserved</option>
                </select>

                <div className="flex items-center rounded-xl border border-stone-200 overflow-hidden bg-stone-100 p-1">
                    <button
                        onClick={() => onViewModeChange('GRID')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            viewMode === 'GRID'
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                        }`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Grid</span>
                    </button>
                    <button
                        onClick={() => onViewModeChange('TABLE')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            viewMode === 'TABLE'
                                ? 'bg-white text-stone-900 shadow-xs'
                                : 'text-stone-600 hover:text-stone-900'
                        }`}
                    >
                        <List className="w-3.5 h-3.5" />
                        <span>Table</span>
                    </button>
                </div>
            </div>

            <button
                onClick={onOpenAddModal}
                className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-sm transition-all flex items-center gap-2 active:scale-[0.98] cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                <span>Add New Table</span>
            </button>
        </div>
    )
})

TableListToolbar.displayName = 'TableListToolbar'
