import { DashboardContent, ProtectedRoute } from "@/components"
import { PERMISSIONS } from "@/config/constants/auth"

const Dashboard = () => {
    return (
        <ProtectedRoute requiredRoles={[...PERMISSIONS.STAFF_AND_ADMIN]}>
            <DashboardContent />
        </ProtectedRoute>
    )
}

export default Dashboard