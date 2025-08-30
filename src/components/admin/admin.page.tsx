'use client'

import { AdminData } from "@/interfaces"
import ProtectedRoute from "../ProtectedRoute"
import { useSWRWithAuth } from "@/hooks"

const AdminPage = () => {
    return (
        <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
            <AdminContent />
        </ProtectedRoute>
    )
}

const AdminContent = () => {
    const { data: adminData, error, isLoading } = useSWRWithAuth<AdminData>('/admin/stats')

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Panel</h1>

                    {isLoading && <div>Loading admin data...</div>}
                    {error && <div className="text-red-600">Failed to load admin data</div>}

                    {adminData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium">System Health</h3>
                                <p className="text-2xl font-bold text-green-600">{adminData.systemHealth}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium">Active Users</h3>
                                <p className="text-2xl font-bold text-blue-600">{adminData.activeUsers}</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium">Server Load</h3>
                                <p className="text-2xl font-bold text-orange-600">{adminData.serverLoad}%</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminPage