export interface TopDish {
    name: string
    count: number
}

export interface DashboardData {
    // Guests
    todayGuests: number
    todayReservations: number

    // Orders
    todayOrders: number
    pendingOrders: number
    monthlyOrders: number

    // Revenue
    todayRevenue: number
    revenueGrowth: number
    monthlyRevenue: number

    // Tables
    availableTables: number
    occupiedTables: number
    reservedTables: number

    // Top dishes
    topDishes: TopDish[]
}