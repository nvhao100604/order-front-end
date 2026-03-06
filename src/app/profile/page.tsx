import { ProtectedRoute } from "@/components"
import { PERMISSIONS } from "@/config"

const Profile = () => {
    return (
        <>
            <ProtectedRoute requiredRoles={[...PERMISSIONS.AUTHENTICATED]}>
                <div>My Profile</div>
            </ProtectedRoute>
        </>
    )
}

export default Profile