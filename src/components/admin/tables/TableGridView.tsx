'use client'

import React, { memo } from 'react'
import { ITableResponse, TableStatus } from '@/interfaces'
import { Users, Hash, MapPin, Pencil, Trash2 } from 'lucide-react'

interface TableGridViewProps {
    tables: ITableResponse[]
    onToggleStatus: (id: number, status: TableStatus) => void
    onOpenEditModal: (table: ITableResponse) => void
    onDeleteTable: (id: number) => void
}

export const TableGridView: React.FC<TableGridViewProps> = memo(({
    tables,
    onToggleStatus,
    onOpenEditModal,
    onDeleteTable,
}) => {
    const statusBadge = (status: TableStatus) => {
        switch (status) {
            case 'EMPTY':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Available
                    </span>
                )
            case 'OCCUPIED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Occupied
                    </span>
                )
            case 'RESERVED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        Reserved
                    </span>
                )
            default:
                return null
        }
    }

    if (tables.length === 0) {
        return (
            <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-200 text-center text-stone-500 font-medium">
                No dining tables found matching the filter.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map((t) => (
                <div
                    key={t.id}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-stone-900 tracking-tight">Table #{t.number}</h3>
                            {statusBadge(t.status)}
                        </div>
                        <div className="space-y-1.5 text-xs text-stone-600 mb-6">
                            <p className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-stone-400" />
                                <span>Capacity: <strong className="text-stone-900">{t.minCapacity} – {t.maxCapacity} guests</strong></span>
                            </p>
                            <p className="flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5 text-stone-400" />
                                <span>Table ID: #{t.id}</span>
                            </p>
                            {t.areaId && (
                                <p className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                                    <span>Area: Area #{t.areaId}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                        <select
                            value={t.status}
                            onChange={(e) => onToggleStatus(t.id, e.target.value as TableStatus)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-50 border border-stone-200 text-stone-800 outline-none cursor-pointer"
                        >
                            <option value="EMPTY">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="RESERVED">Reserved</option>
                        </select>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => onOpenEditModal(t)}
                                className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDeleteTable(t.id)}
                                className="p-2 rounded-lg text-stone-600 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete table"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
})

TableGridView.displayName = 'TableGridView'
