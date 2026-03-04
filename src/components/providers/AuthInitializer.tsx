"use client";

import { IS_AUTHENTICATED_KEY } from "@/config";
import { useAuth, useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { refresh, initialize } = useAuth()
    const router = useRouter()
    useEffect(() => {
        initialize()
        const wasLoggedIn = localStorage.getItem(IS_AUTHENTICATED_KEY) === "true";

        if (wasLoggedIn) {
            refresh().catch(() => {
                // localStorage.removeItem(IS_AUTHENTICATED_KEY);
                console.log("Session expired");
            });
        }
    }, []);

    return <>{children}</>;
}

export default AuthInitializer