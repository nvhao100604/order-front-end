import { DashboardContent, ProtectedRoute } from "@/components"


const Dashboard = () => {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}

export default Dashboard