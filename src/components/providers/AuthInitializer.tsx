"use client";

import { useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { refresh, initialize } = useEnhancedAuth()
    const router = useRouter()
    useEffect(() => {
        const wasLoggedIn = localStorage.getItem("isAuthenticated") === "true";

        if (wasLoggedIn) {
            refresh().catch(() => {
                localStorage.removeItem("isAuthenticated");
                console.log("Phiên làm việc hết hạn");
            });
        }
    }, []);

    return <>{children}</>;
}

export default AuthInitializer