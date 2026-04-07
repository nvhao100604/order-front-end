import { ProtectedRoute } from "@/components"
import ProfilePage from "@/components/profile.page"
import { PERMISSIONS } from "@/config/constants/auth"

const Profile = () => {
    return (
        <>
            <ProtectedRoute requiredRoles={[...PERMISSIONS.AUTHENTICATED]}>
                <div><ProfilePage /></div>
            </ProtectedRoute>
        </>
    )
}

export default Profile