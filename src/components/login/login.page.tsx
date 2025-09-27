'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { login, logout, isLoading, error, isAuthenticated, clearError } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/guest')
        } else {
            logout()
        }
    }, [isAuthenticated, router])

    useEffect(() => {
        // Clear error when component unmounts or email/password changes
        return () => clearError()
    }, [email, password, clearError])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await login({ username: email, password })
        if (success) {
            router.push('/guest')
        }
    }

    if (isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div>
                    <h2 className="text-3xl font-bold text-center text-gray-900">
                        Log In
                    </h2>
                    <p className="mt-2 text-center text-gray-600">
                        Access your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={email}
                            autoComplete='username'
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            autoComplete='re-password'
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage