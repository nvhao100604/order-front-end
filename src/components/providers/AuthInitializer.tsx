"use client";

import { IS_AUTHENTICATED_KEY } from "@/config/constants/storage";
import { useAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks";
import { useEffect } from "react";
import Modal from "../app/app.modal";
import LoadingBox from "../ui/loading";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
    const { refresh, initialize, isLoading, isAuthenticated, user } = useAuth()

    useEffect(() => {
        initialize()
        const wasLoggedIn = localStorage.getItem(IS_AUTHENTICATED_KEY) === "true";

        if (wasLoggedIn) {
            refresh().catch(() => {
                console.log("Session expired");
            });
        }
    }, []);

    const wasLoggedIn = typeof window !== 'undefined' && localStorage.getItem(IS_AUTHENTICATED_KEY) === "true";

    return (
        <>
            {children}
            {isLoading && (isAuthenticated || user || wasLoggedIn) && (
                <Modal handleClick={() => {}}>
                    <div className="flex flex-col items-center justify-center p-8 bg-[#1F1A17]/95 border border-[#D4AF37]/40 rounded-2xl shadow-2xl backdrop-blur-md space-y-4">
                        <LoadingBox />
                        <p className="text-xs font-semibold text-stone-200 tracking-wide text-center">
                            Loading data, please wait a moment...
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default AuthInitializer