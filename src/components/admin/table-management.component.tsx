'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ITableResponse, TableStatus } from '@/interfaces'
import { tables_services } from '@/services/table.services'
import { TableListToolbar } from './tables/TableListToolbar'
import { TableGridView } from './tables/TableGridView'
import { TableTableView } from './tables/TableTableView'
import { TableFormModal } from './tables/TableFormModal'
import { ROUTES } from '@/config/constants/route'
import { toast } from 'react-toastify'
import { Map, ArrowRight } from 'lucide-react'

export default function TableManagementComponent() {
    const [tables, setTables] = useState<ITableResponse[]>([])
    const [selectedStatus, setSelectedStatus] = useState<TableStatus | 'ALL'>('ALL')
    const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID')
    const [isLoading, setIsLoading] = useState(false)

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTable, setEditingTable] = useState<ITableResponse | null>(null)

    // 1. Fetch tables directly from API
    const fetchTables = useCallback(async () => {
        setIsLoading(true)
        try {
            const res = await tables_services.getTables()
            if (res?.data && Array.isArray(res.data)) {
                setTables(res.data)
            }
        } catch (err: any) {
            console.error('Fetch tables error:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to load tables list from server.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchTables()
    }, [fetchTables])

    const filteredTables = tables.filter((t) => selectedStatus === 'ALL' || t.status === selectedStatus)

    const handleOpenAddModal = () => {
        setEditingTable(null)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (table: ITableResponse) => {
        setEditingTable(table)
        setIsModalOpen(true)
    }

    // 2. Update table status directly via API
    const handleToggleStatus = async (id: number, nextStatus: TableStatus) => {
        try {
            await tables_services.updateTableStatus(id, nextStatus)
            setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)))
            toast.success(`Updated status for table #${id} successfully!`)
        } catch (err: any) {
            console.error('Update table status error:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to update table status.')
        }
    }

    // 3. Delete table directly via API
    const handleDeleteTable = async (id: number) => {
        if (!confirm('Are you sure you want to delete this table?')) return
        try {
            await tables_services.deleteTable(id)
            setTables((prev) => prev.filter((t) => t.id !== id))
            toast.success(`Deleted table #${id} successfully!`)
        } catch (err: any) {
            console.error('Delete table error:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to delete table.')
        }
    }

    // 4. Save Table (Create or Update) directly via API
    const handleSaveTable = async (formData: {
        number: number
        minCapacity: number
        maxCapacity: number
        status: TableStatus
    }) => {
        try {
            if (editingTable) {
                const res = await tables_services.updateTable(editingTable.id, {
                    number: Number(formData.number),
                    minCapacity: Number(formData.minCapacity),
                    maxCapacity: Number(formData.maxCapacity),
                    status: formData.status,
                })
                if (res?.data) {
                    const updated = res.data
                    setTables((prev) => prev.map((t) => (t.id === editingTable.id ? { ...t, ...updated } : t)))
                    toast.success(`Updated table #${formData.number} successfully!`)
                }
            } else {
                const res = await tables_services.createTable({
                    number: Number(formData.number),
                    minCapacity: Number(formData.minCapacity),
                    seats: Number(formData.minCapacity) % 2 === 0 ? Number(formData.minCapacity) : Number(formData.minCapacity) + 1,
                    maxCapacity: Number(formData.maxCapacity),
                    status: formData.status,
                })
                if (res?.data) {
                    const created = res.data
                    setTables((prev) => [created, ...prev])
                    toast.success(`Created table #${created.number} successfully!`)
                }
            }
            setIsModalOpen(false)
        } catch (err: any) {
            console.error('Save table error:', err)
            toast.error(err.response?.data?.detail || err.message || 'Failed to save table.')
        }
    }

    return (
        <div className="space-y-6">
            {/* Floor Plan Banner CTA */}
            <div className="bg-linear-to-r from-amber-900 to-amber-800 text-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-700/50">
                <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-amber-700/60 rounded-xl text-amber-200 border border-amber-600/40">
                        <Map className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base text-amber-100">
                            Floor Plan Layout Editor
                        </h3>
                        <p className="text-xs text-amber-200/80 mt-0.5">
                            Interactively position dining tables, areas, and architectural obstacles on the grid.
                        </p>
                    </div>
                </div>
                <Link
                    href={ROUTES.ADMIN_FLOOR_PLAN}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm shadow-sm transition-all active:scale-[0.98] shrink-0"
                >
                    <span>Open Floor Plan Editor</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Table CRUD & List View */}
            <div className="space-y-6">
                <TableListToolbar
                    selectedStatus={selectedStatus}
                    totalCount={tables.length}
                    viewMode={viewMode}
                    onStatusChange={setSelectedStatus}
                    onViewModeChange={setViewMode}
                    onOpenAddModal={handleOpenAddModal}
                />

                {isLoading ? (
                    <div className="bg-white p-12 rounded-2xl border border-amber-900/10 text-center text-amber-900/60 font-medium animate-pulse">
                        Loading tables from server...
                    </div>
                ) : viewMode === 'GRID' ? (
                    <TableGridView
                        tables={filteredTables}
                        onToggleStatus={handleToggleStatus}
                        onOpenEditModal={handleOpenEditModal}
                        onDeleteTable={handleDeleteTable}
                    />
                ) : (
                    <TableTableView
                        tables={filteredTables}
                        onOpenEditModal={handleOpenEditModal}
                        onDeleteTable={handleDeleteTable}
                    />
                )}

                <TableFormModal
                    isOpen={isModalOpen}
                    editingTable={editingTable}
                    nextNumber={tables.length + 1}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSaveTable}
                />
            </div>
        </div>
    )
}
