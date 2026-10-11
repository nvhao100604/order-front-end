'use client'

import React, { memo } from 'react'
import { ITableResponse, TableStatus } from '@/interfaces'
import { Pencil, Trash2 } from 'lucide-react'

interface TableTableViewProps {
    tables: ITableResponse[]
    onOpenEditModal: (table: ITableResponse) => void
    onDeleteTable: (id: number) => void
}

export const TableTableView: React.FC<TableTableViewProps> = memo(({
    tables,
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
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-stone-50 text-stone-600 text-xs font-semibold uppercase tracking-wider border-b border-stone-200">
                        <th className="py-3.5 px-6">Table Number</th>
                        <th className="py-3.5 px-6">Capacity</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Area</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm">
                    {tables.map((t) => (
                        <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-4 px-6 font-bold text-stone-900">Table #{t.number}</td>
                            <td className="py-4 px-6 text-stone-700 font-medium">
                                {t.minCapacity} – {t.maxCapacity} guests
                            </td>
                            <td className="py-4 px-6">{statusBadge(t.status)}</td>
                            <td className="py-4 px-6 text-xs text-stone-500">
                                {t.areaId ? `Area #${t.areaId}` : 'Unassigned area'}
                            </td>
                            <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-1">
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
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
})

TableTableView.displayName = 'TableTableView'
