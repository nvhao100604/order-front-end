import { ProtectedRoute } from "@/components"
import AdminContent from "@/components/admin/admin.page"
import { PERMISSIONS } from "@/config/constants/auth"

export const metadata = {
    title: 'Admin | Foodie Restaurant'
}

const AdminPage = () => {
    return (
        <ProtectedRoute requiredRoles={[...PERMISSIONS.ADMIN_ONLY]}>
            <AdminContent />
        </ProtectedRoute>
    )
}

export default AdminPage