
export interface DashboardData {
    totalUsers: number
    totalOrders: number
    revenue: number
    recentActivity: Array<{
        id: string
        type: string
        description: string
        timestamp: string
    }>
}