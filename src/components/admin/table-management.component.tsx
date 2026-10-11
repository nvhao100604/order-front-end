'use client'

import { useState, useEffect, useCallback } from 'react'
import { ITableResponse, TableStatus } from '@/interfaces'
import { tables_services } from '@/services/table.services'
import { FloorPlanEditor } from './floor-plan/FloorPlanEditor'
import { TableListToolbar } from './tables/TableListToolbar'
import { TableGridView } from './tables/TableGridView'
import { TableTableView } from './tables/TableTableView'
import { TableFormModal } from './tables/TableFormModal'
import { toast } from 'react-toastify'

import { Map, LayoutGrid } from 'lucide-react'

type SubTab = 'LAYOUT' | 'LIST'

export default function TableManagementComponent() {
    const [subTab, setSubTab] = useState<SubTab>('LAYOUT')
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
            {/* Top Sub-Tab Switcher */}
            <div className="flex items-center justify-between border-b border-amber-900/15 pb-2">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSubTab('LAYOUT')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            subTab === 'LAYOUT'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-100/60'
                        }`}
                    >
                        <Map className="w-4 h-4" />
                        <span>Floor Layout</span>
                    </button>
                    <button
                        onClick={() => setSubTab('LIST')}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            subTab === 'LIST'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-100/60'
                        }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span>Table List</span>
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                subTab === 'LIST'
                                    ? 'bg-amber-700/60 text-amber-100'
                                    : 'bg-amber-200/60 text-amber-900'
                            }`}
                        >
                            {tables.length}
                        </span>
                    </button>
                </div>
            </div>

            {/* TAB 1: Floor Plan Layout */}
            {subTab === 'LAYOUT' && (
                <FloorPlanEditor
                    onOpenTableCRUD={() => {
                        setSubTab('LIST')
                        handleOpenAddModal()
                    }}
                />
            )}

            {/* TAB 2: Table List */}
            {subTab === 'LIST' && (
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
            )}
        </div>
    )
}
