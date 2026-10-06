"use client";

import { IS_AUTHENTICATED_KEY } from "@/config/constants/storage";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { useEffect } from "react";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { refresh, initialize } = useAuth()

    useEffect(() => {
        initialize()
        const wasLoggedIn = localStorage.getItem(IS_AUTHENTICATED_KEY) === "true";

        if (wasLoggedIn) {
            refresh().catch(() => {
                console.log("Session expired");
            });
        }
    }, []);

    return <>{children}</>;
}

export default AuthInitializer