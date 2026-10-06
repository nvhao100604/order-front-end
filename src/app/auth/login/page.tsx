import { Suspense } from "react"
import { LoginPage } from "@/components"
import LoadingBox from "@/components/ui/loading"

export const metadata = {
    title: 'Login | Foodie Restaurant'
}

const Login = () => {
    return (
        <Suspense fallback={
            <div className="flex m-auto h-screen items-center justify-center">
                <LoadingBox />
            </div>
        }>
            <LoginPage />
        </Suspense>
    )
}

export default Login