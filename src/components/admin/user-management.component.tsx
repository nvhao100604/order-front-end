'use client'

import { useState } from 'react'
import { UserResponse, Status } from '@/interfaces'

export default function UserManagementComponent() {
    const initialUsers: UserResponse[] = [
        {
            id: 1,
            username: 'admin',
            name: 'Quản Trị Viên (Admin)',
            email: 'admin@foodie.com',
            phoneNumber: '0901234567',
            address: '123 Nguyễn Huệ, Q.1, TP.HCM',
            status: Status.ACTIVE,
            roleID: 1,
            createdAt: '2026-01-01T08:00:00Z',
            updatedAt: '2026-01-01T08:00:00Z',
        },
        {
            id: 2,
            username: 'staff01',
            name: 'Nguyễn Văn Thu ngân',
            email: 'staff01@foodie.com',
            phoneNumber: '0912345678',
            address: '45 Lê Lợi, Q.1, TP.HCM',
            status: Status.ACTIVE,
            roleID: 2,
            createdAt: '2026-02-10T10:30:00Z',
            updatedAt: '2026-02-10T10:30:00Z',
        },
        {
            id: 3,
            username: 'staff02',
            name: 'Trần Thị Phục vụ',
            email: 'staff02@foodie.com',
            phoneNumber: '0923456789',
            address: '88 Võ Văn Tần, Q.3, TP.HCM',
            status: Status.ACTIVE,
            roleID: 2,
            createdAt: '2026-03-01T09:15:00Z',
            updatedAt: '2026-03-01T09:15:00Z',
        },
        {
            id: 4,
            username: 'khachhang01',
            name: 'Lê Hoàng Nam',
            email: 'nam.le@gmail.com',
            phoneNumber: '0934567890',
            address: '12 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
            status: Status.ACTIVE,
            roleID: 3,
            createdAt: '2026-04-12T14:20:00Z',
            updatedAt: '2026-04-12T14:20:00Z',
        },
        {
            id: 5,
            username: 'khachhang02',
            name: 'Phạm Minh Trí',
            email: 'tri.pham@yahoo.com',
            phoneNumber: '0945678901',
            address: '99 Cách Mạng Tháng 8, Q.10, TP.HCM',
            status: Status.INACTIVE,
            roleID: 3,
            createdAt: '2026-05-20T11:45:00Z',
            updatedAt: '2026-05-20T11:45:00Z',
        },
    ]

    const [users, setUsers] = useState<UserResponse[]>(initialUsers)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<number | 'ALL'>('ALL')

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        roleID: 2,
    })

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phoneNumber.includes(searchTerm)
        const matchesRole = roleFilter === 'ALL' || u.roleID === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleBadge = (roleID?: number) => {
        switch (roleID) {
            case 1:
                return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-900 border border-purple-200">👑 Admin</span>
            case 2:
                return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">👔 Staff</span>
            default:
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">👤 Customer</span>
        }
    }

    const handleChangeRole = (id: number, newRole: number) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, roleID: newRole } : u)))
    }

    const handleToggleStatus = (id: number) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? { ...u, status: u.status === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE }
                    : u
            )
        )
    }

    const handleDeleteUser = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa người dùng này khỏi hệ thống?')) {
            setUsers((prev) => prev.filter((u) => u.id !== id))
        }
    }

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.username || !formData.name || !formData.email) return alert('Vui lòng điền đủ thông tin!')

        const newUser: UserResponse = {
            id: Date.now(),
            username: formData.username,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            address: formData.address,
            status: Status.ACTIVE,
            roleID: Number(formData.roleID),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        setUsers((prev) => [newUser, ...prev])
        setIsModalOpen(false)
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm theo tên, username, email, SĐT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-900/20 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-3 text-amber-800/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <select
                        value={roleFilter}
                        onChange={(e) =>
                            setRoleFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                        }
                        className="px-4 py-2.5 rounded-xl border border-amber-900/20 bg-white text-sm focus:border-amber-600 outline-none font-medium text-amber-900"
                    >
                        <option value="ALL">Tất cả vai trò ({users.length})</option>
                        <option value={1}>👑 Admin</option>
                        <option value={2}>👔 Staff (Nhân viên)</option>
                        <option value={3}>👤 Customer (Khách hàng)</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setFormData({
                            username: '',
                            name: '',
                            email: '',
                            phoneNumber: '',
                            address: '',
                            password: '',
                            roleID: 2,
                        })
                        setIsModalOpen(true)
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                    <span>👤 Tạo Tài Khoản Mới</span>
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-900/5 text-amber-900 text-xs font-bold uppercase tracking-wider border-b border-amber-900/10">
                                <th className="py-4 px-6">Người Dùng</th>
                                <th className="py-4 px-6">Liên Hệ</th>
                                <th className="py-4 px-6">Vai Trò (Role)</th>
                                <th className="py-4 px-6">Trạng Thái</th>
                                <th className="py-4 px-6 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-900/10 text-sm">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-amber-800/60 font-medium">
                                        Không tìm thấy tài khoản người dùng nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-amber-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div>
                                                <h4 className="font-bold text-amber-950">{u.name}</h4>
                                                <span className="text-xs font-mono text-amber-800/70">@{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-xs space-y-0.5">
                                                <p className="font-semibold text-amber-950">{u.email}</p>
                                                <p className="text-amber-800/70">{u.phoneNumber}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {getRoleBadge(u.roleID)}
                                                <select
                                                    value={u.roleID || 3}
                                                    onChange={(e) => handleChangeRole(u.id, Number(e.target.value))}
                                                    className="text-xs py-1 px-2 rounded-lg border border-amber-900/20 bg-amber-50 text-amber-900 font-medium outline-none"
                                                >
                                                    <option value={1}>👑 Admin</option>
                                                    <option value={2}>👔 Staff</option>
                                                    <option value={3}>👤 Customer</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <button
                                                onClick={() => handleToggleStatus(u.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                                    u.status === Status.ACTIVE
                                                        ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 border border-red-300 hover:bg-red-200'
                                                }`}
                                            >
                                                {u.status === Status.ACTIVE ? '🟢 Đang hoạt động' : '🔴 Bị khóa'}
                                            </button>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Xóa tài khoản"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-900/10 w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 bg-amber-900/5 border-b border-amber-900/10 flex items-center justify-between">
                            <h3 className="font-bold text-amber-950 text-lg">Tạo Tài Khoản Người Dùng Mới</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-amber-800/60 hover:text-amber-950 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        placeholder="vd: staff_an"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="vd: Nguyễn Văn An"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="an.nguyen@example.com"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Số Điện Thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="0912345678"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Mật khẩu *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Vai trò (Role) *
                                    </label>
                                    <select
                                        value={formData.roleID}
                                        onChange={(e) => setFormData({ ...formData, roleID: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-white"
                                    >
                                        <option value={1}>👑 Admin (Quản trị)</option>
                                        <option value={2}>👔 Staff (Nhân viên)</option>
                                        <option value={3}>👤 Customer (Khách hàng)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="vd: 123 Lê Lợi, Q.1"
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
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
                                    Tạo Tài Khoản
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
