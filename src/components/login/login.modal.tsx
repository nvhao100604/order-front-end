import { ROUTES } from "@/config/constants/route";
import Link from "next/link";

export default function LoginModal(
    { handleClose }
        :
        { handleClose: () => void }
) {
    return (
        <div className="flex items-center justify-center"
            style={{
                background: "rgba(74,53,37,0.45)",
                backdropFilter: "blur(4px)", fontFamily: "Georgia,serif"
            }}>
            <div className="w-full max-w-sm rounded-2xl overflow-hidden animate-slide-up"
                style={{
                    background: "white", boxShadow: "0 16px 48px rgba(74,53,37,0.2)",
                }}>

                <div style={{ height: "4px", background: "linear-gradient(90deg,#8b6b4a,#e85d1a)" }} />

                <div className="p-8">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#fef3e2" }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c0622a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>

                    <h2 className="text-xl font-bold text-center mb-2" style={{ color: "#4a3525" }}>Sign In Required</h2>
                    <p className="text-sm text-center mb-7" style={{ color: "#a08060", lineHeight: "1.6" }}>
                        Please log in to your account to access this feature and enjoy our full dining experience.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link href={ROUTES.AUTH.LOGIN}>
                            <button
                                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90" style={{ background: "#e85d1a" }}>
                                Log In
                            </button>
                        </Link>
                        <button className="w-full py-3 rounded-xl text-sm font-semibold transition-all" style={{ color: "#c0622a", border: "1.5px solid #f0c070" }}>
                            Create an Account
                        </button>
                    </div>

                    <button onClick={handleClose} className="w-full mt-4 text-xs hover:underline" style={{ color: "#b09070" }}>
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}