import { ProtectedRoute } from "@/components"

const Profile = () => {
    return (
        <>
            <ProtectedRoute>
                <div>My Profile</div>
            </ProtectedRoute>
        </>
    )
}

export default Profile