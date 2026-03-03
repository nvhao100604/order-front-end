"use client";

import { useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { refresh, initialize } = useEnhancedAuth()
    const router = useRouter()
    useEffect(() => {
        // 1. Lấy user từ localStorage hiện lên UI trước cho đỡ trống
        initialize()

        // 2. Chạy ngầm để lấy Access Token mới vào bộ nhớ
        refresh().catch(() => {
            console.log("Session expired")
            router.push("/unauthorized")
        })
    }, []);

    return <>{children}</>;
}

export default AuthInitializer