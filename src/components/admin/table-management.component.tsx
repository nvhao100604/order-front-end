'use client'

import { useState } from 'react'
import { ITableResponse, TableStatus } from '@/interfaces'

export default function TableManagementComponent() {
    const initialTables: ITableResponse[] = [
        { id: 1, number: 1, minCapacity: 2, maxCapacity: 4, status: 'EMPTY' },
        { id: 2, number: 2, minCapacity: 2, maxCapacity: 4, status: 'OCCUPIED' },
        { id: 3, number: 3, minCapacity: 4, maxCapacity: 6, status: 'RESERVED' },
        { id: 4, number: 4, minCapacity: 4, maxCapacity: 6, status: 'EMPTY' },
        { id: 5, number: 5, minCapacity: 6, maxCapacity: 10, status: 'EMPTY' },
        { id: 6, number: 6, minCapacity: 8, maxCapacity: 12, status: 'OCCUPIED' },
    ]

    const [tables, setTables] = useState<ITableResponse[]>(initialTables)
    const [selectedStatus, setSelectedStatus] = useState<TableStatus | 'ALL'>('ALL')
    const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('GRID')

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTable, setEditingTable] = useState<ITableResponse | null>(null)
    const [formData, setFormData] = useState({
        number: 1,
        minCapacity: 2,
        maxCapacity: 4,
        status: 'EMPTY' as TableStatus,
    })

    const filteredTables = tables.filter((t) => selectedStatus === 'ALL' || t.status === selectedStatus)

    const handleOpenAddModal = () => {
        setEditingTable(null)
        setFormData({
            number: tables.length + 1,
            minCapacity: 2,
            maxCapacity: 4,
            status: 'EMPTY',
        })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (table: ITableResponse) => {
        setEditingTable(table)
        setFormData({
            number: table.number,
            minCapacity: table.minCapacity,
            maxCapacity: table.maxCapacity,
            status: table.status,
        })
        setIsModalOpen(true)
    }

    const handleToggleStatus = (id: number, nextStatus: TableStatus) => {
        setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)))
    }

    const handleDeleteTable = (id: number) => {
        if (confirm('Bạn có chắc muốn xóa bàn ăn này?')) {
            setTables((prev) => prev.filter((t) => t.id !== id))
        }
    }

    const handleSaveTable = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingTable) {
            setTables((prev) =>
                prev.map((t) =>
                    t.id === editingTable.id
                        ? {
                              ...t,
                              number: Number(formData.number),
                              minCapacity: Number(formData.minCapacity),
                              maxCapacity: Number(formData.maxCapacity),
                              status: formData.status,
                          }
                        : t
                )
            )
        } else {
            const newTable: ITableResponse = {
                id: Date.now(),
                number: Number(formData.number),
                minCapacity: Number(formData.minCapacity),
                maxCapacity: Number(formData.maxCapacity),
                status: formData.status,
            }
            setTables((prev) => [...prev, newTable])
        }
        setIsModalOpen(false)
    }

    const statusBadge = (status: TableStatus) => {
        switch (status) {
            case 'EMPTY':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">🟢 Bàn Trống</span>
            case 'OCCUPIED':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">🔴 Đang Ăn</span>
            case 'RESERVED':
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">🔵 Đã Giữ Chỗ</span>
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <div className="flex items-center gap-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) =>
                            setSelectedStatus(
                                e.target.value === 'ALL' ? 'ALL' : (e.target.value as TableStatus)
                            )
                        }
                        className="px-4 py-2.5 rounded-xl border border-amber-900/20 bg-white text-sm focus:border-amber-600 outline-none font-medium text-amber-900"
                    >
                        <option value="ALL">Tất cả bàn ({tables.length})</option>
                        <option value="EMPTY">🟢 Bàn Trống</option>
                        <option value="OCCUPIED">🔴 Đang Ăn</option>
                        <option value="RESERVED">🔵 Đã Giữ Chỗ</option>
                    </select>

                    <div className="flex items-center rounded-xl border border-amber-900/20 overflow-hidden bg-amber-50/50 p-1">
                        <button
                            onClick={() => setViewMode('GRID')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'GRID' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-900 hover:bg-amber-100'
                            }`}
                        >
                            ▦ Grid
                        </button>
                        <button
                            onClick={() => setViewMode('TABLE')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                viewMode === 'TABLE' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-900 hover:bg-amber-100'
                            }`}
                        >
                            ☰ Bảng
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleOpenAddModal}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                    <span>🪑 Thêm Bàn Ăn Mới</span>
                </button>
            </div>

            {/* Grid View */}
            {viewMode === 'GRID' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTables.map((t) => (
                        <div
                            key={t.id}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-extrabold text-amber-950">Bàn số {t.number}</h3>
                                    {statusBadge(t.status)}
                                </div>
                                <div className="space-y-1 text-sm text-amber-900/70 mb-6">
                                    <p>👥 Sức chứa: <strong className="text-amber-950">{t.minCapacity} – {t.maxCapacity} khách</strong></p>
                                    <p>🆔 Mã bàn: #{t.id}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between">
                                <select
                                    value={t.status}
                                    onChange={(e) => handleToggleStatus(t.id, e.target.value as TableStatus)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-900/20 text-amber-900 outline-none"
                                >
                                    <option value="EMPTY">🟢 Trống</option>
                                    <option value="OCCUPIED">🔴 Đang ăn</option>
                                    <option value="RESERVED">🔵 Đã đặt</option>
                                </select>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleOpenEditModal(t)}
                                        className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors text-xs"
                                        title="Chỉnh sửa"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTable(t.id)}
                                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-xs"
                                        title="Xóa"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'TABLE' && (
                <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-900/5 text-amber-900 text-xs font-bold uppercase tracking-wider border-b border-amber-900/10">
                                <th className="py-4 px-6">Số Bàn</th>
                                <th className="py-4 px-6">Sức Chứa</th>
                                <th className="py-4 px-6">Trạng Thái</th>
                                <th className="py-4 px-6 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-900/10 text-sm">
                            {filteredTables.map((t) => (
                                <tr key={t.id} className="hover:bg-amber-50/50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-amber-950">Bàn #{t.number}</td>
                                    <td className="py-4 px-6 text-amber-900 font-medium">{t.minCapacity} – {t.maxCapacity} người</td>
                                    <td className="py-4 px-6">{statusBadge(t.status)}</td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenEditModal(t)}
                                                className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTable(t.id)}
                                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add / Edit Table Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-900/10 w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 bg-amber-900/5 border-b border-amber-900/10 flex items-center justify-between">
                            <h3 className="font-bold text-amber-950 text-lg">
                                {editingTable ? 'Chỉnh Sửa Thông Tin Bàn' : 'Thêm Bàn Ăn Mới'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-amber-800/60 hover:text-amber-950 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSaveTable} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Số Bàn *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: Number(e.target.value) })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Min Khách *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.minCapacity}
                                        onChange={(e) => setFormData({ ...formData, minCapacity: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Max Khách *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.maxCapacity}
                                        onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Trạng thái ban đầu *
                                </label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-white"
                                >
                                    <option value="EMPTY">🟢 Bàn Trống (EMPTY)</option>
                                    <option value="OCCUPIED">🔴 Đang Ăn (OCCUPIED)</option>
                                    <option value="RESERVED">🔵 Đã Giữ Chỗ (RESERVED)</option>
                                </select>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-amber-900/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-amber-900/20 text-amber-900 hover:bg-amber-50 font-semibold text-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-md"
                                >
                                    Lưu Bàn Ăn
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

