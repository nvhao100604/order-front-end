'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'
import { LOGO_URL, ROLES, ROUTES } from '@/config'
import Link from 'next/link'
import { useAppSelector } from '@/redux/hooks'
import { checkRole } from '@/utils'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error, isAuthenticated } = useAuth()
    const user = useAppSelector(state => state.auth.user)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated && user && user.roleID) {
            // console.log("Role id: " + user.roleID)
            checkRole(user.roleID, router)
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        const success = await login({ username: email, password })
        // if (success.access_token && user && user.roleID) {
        //     // console.log("Role id: " + user.roleID)
        //     checkRole(user.roleID, router)
        // }
    }

    if (isAuthenticated) return null

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(135deg, #faf6f0 0%, #f5ede0 40%, #ede0cc 100%)",
                fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
        >
            {/* Subtle noise overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
            />

            <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
                style={{
                    background: "white",
                    boxShadow: "0 20px 60px rgba(74,53,37,0.18)",
                }}
            >
                {/* Top gradient bar */}
                <div style={{ height: "4px", background: "linear-gradient(90deg, #8b6b4a, #e85d1a)" }} />

                {/* Header */}
                <div
                    className="px-10 pt-10 pb-6 text-center"
                    style={{ borderBottom: "1px solid #f5ede0" }}
                >
                    <img
                        src={LOGO_URL}
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                        style={{ background: "linear-gradient(135deg, #8b6b4a, #6b4e35)" }}
                    />

                    <h2 className="text-2xl font-bold mb-1" style={{ color: "#4a3525" }}>
                        Welcome Back
                    </h2>
                    <p className="text-sm" style={{ color: "#a08060" }}>
                        Sign in to your Foodie Restaurant account
                    </p>
                </div>

                <div className="px-10 py-8">
                    {/* Error */}
                    {error && (
                        <div
                            className="flex items-start gap-2 p-3 rounded-lg mb-5 text-sm"
                            style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#c0392b" }}
                        >
                            <span className="mt-0.5">⚠</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div>
                            <label
                                className="block text-xs font-semibold tracking-wider mb-1.5"
                                style={{ color: "rgba(107,78,53,0.6)" }}
                            >
                                USERNAME
                            </label>
                            <input
                                type="text"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your username"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    background: "#faf6f0",
                                    border: "1.5px solid #dcc9b0",
                                    color: "#4a3525",
                                    fontFamily: "Georgia, serif",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#d4af37")}
                                onBlur={e => (e.target.style.borderColor = "#dcc9b0")}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    className="block text-xs font-semibold tracking-wider"
                                    style={{ color: "rgba(107,78,53,0.6)" }}
                                >
                                    PASSWORD
                                </label>
                                <Link
                                    href={ROUTES.AUTH.FORGOT_PASSWORD}
                                    className="text-xs hover:underline" style={{ color: "#c0622a" }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="user-password"
                                name="user-password"
                                value={password}
                                autoComplete="current-password"
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                style={{
                                    background: "#faf6f0",
                                    border: "1.5px solid #dcc9b0",
                                    color: "#4a3525",
                                    fontFamily: "Georgia, serif",
                                }}
                                onFocus={e => (e.target.style.borderColor = "#d4af37")}
                                onBlur={e => (e.target.style.borderColor = "#dcc9b0")}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{
                                background: isLoading ? "#c0622a" : "#e85d1a",
                                boxShadow: "0 4px 16px rgba(232,93,26,0.3)",
                                marginTop: "8px",
                            }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                        <Link
                            href={ROUTES.GUEST.HOME}
                            className="flex items-center justify-center gap-2 w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                            style={{ background: '#faf6f0', color: '#6b4e35', border: '1.5px solid #dcc9b0' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Back to Home
                        </Link>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs mt-6" style={{ color: "#a08060" }}>
                        Don't have an account?{" "}
                        <Link href={ROUTES.AUTH.REGISTER}
                            className="font-semibold hover:underline" style={{ color: "#c0622a" }}>
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage