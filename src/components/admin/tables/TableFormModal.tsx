'use client'

import React, { useState, useEffect } from 'react'
import { ITableResponse, TableStatus } from '@/interfaces'
import { X, Save, Loader2 } from 'lucide-react'

interface TableFormModalProps {
    isOpen: boolean
    editingTable: ITableResponse | null
    nextNumber: number
    onClose: () => void
    onSubmit: (formData: {
        number: number
        minCapacity: number
        maxCapacity: number
        status: TableStatus
    }) => Promise<void>
}

export const TableFormModal: React.FC<TableFormModalProps> = ({
    isOpen,
    editingTable,
    nextNumber,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        number: nextNumber,
        minCapacity: 2,
        maxCapacity: 4,
        status: 'EMPTY' as TableStatus,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (editingTable) {
            setFormData({
                number: editingTable.number,
                minCapacity: editingTable.minCapacity,
                maxCapacity: editingTable.maxCapacity,
                status: editingTable.status,
            })
        } else {
            setFormData({
                number: nextNumber,
                minCapacity: 2,
                maxCapacity: 4,
                status: 'EMPTY',
            })
        }
    }, [editingTable, nextNumber])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await onSubmit(formData)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl border border-stone-200/80 w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 text-base">
                        {editingTable ? 'Edit Dining Table' : 'Add New Dining Table'}
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-lg cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                            Table Number *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={formData.number}
                            onChange={(e) =>
                                setFormData({ ...formData, number: Number(e.target.value) })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                                Min Guests *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.minCapacity}
                                onChange={(e) =>
                                    setFormData({ ...formData, minCapacity: Number(e.target.value) })
                                }
                                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                                Max Guests *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.maxCapacity}
                                onChange={(e) =>
                                    setFormData({ ...formData, maxCapacity: Number(e.target.value) })
                                }
                                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-amber-600 font-mono font-medium text-stone-900"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                            Initial Status *
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                setFormData({ ...formData, status: e.target.value as TableStatus })
                            }
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm outline-none focus:border-amber-600 bg-white font-medium text-stone-900 cursor-pointer"
                        >
                            <option value="EMPTY">Available</option>
                            <option value="OCCUPIED">Occupied</option>
                            <option value="RESERVED">Reserved</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-sm transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-sm disabled:opacity-50 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Save Table</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
