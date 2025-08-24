'use client'
import { useAuth, useSWRWithAuth } from '@/hooks'
import { DashboardData } from '@/interfaces'

const DashboardContent = () => {
    const { user, logout } = useAuth()
    const { data: dashboardData, error, isLoading } = useSWRWithAuth<DashboardData>('/dashboard/stats')

    const handleLogout = () => {
        logout()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        Failed to load dashboard data
                    </div>
                )}

                {dashboardData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                {dashboardData.totalUsers.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                            <p className="text-3xl font-bold text-green-600 mt-2">
                                {dashboardData.totalOrders.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
                            <p className="text-3xl font-bold text-purple-600 mt-2">
                                ${dashboardData.revenue.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">User Profile</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {user?.name}</p>
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                        <p><span className="font-medium">Role:</span> {user?.role}</p>
                        <p><span className="font-medium">ID:</span> {user?.id}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardContent