'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LOGO_URL, ROUTES } from '@/config'
import Link from 'next/link'

type Step = 'email' | 'otp' | 'reset' | 'done'

const ForgotPasswordPage = () => {
    const router = useRouter()
    const [step, setStep] = useState<Step>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const inputBase = (hasError = false) => ({
        background: '#faf6f0',
        border: `1.5px solid ${hasError ? '#f87171' : '#dcc9b0'}`,
        color: '#4a3525',
        fontFamily: 'Georgia, serif',
    })

    // Step 1 — submit email
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email address.')
            return
        }
        setIsLoading(true)
        try {
            // TODO: call send-otp API
            await new Promise(r => setTimeout(r, 1000))
            setStep('otp')
        } catch {
            setError('Failed to send OTP. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 2 — OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return
        const next = [...otp]
        next[index] = value
        setOtp(next)
        if (value && index < 5) {
            const el = document.getElementById(`otp-${index + 1}`)
            el?.focus()
        }
    }
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (pasted.length === 6) {
            setOtp(pasted.split(''))
            document.getElementById('otp-5')?.focus()
        }
    }
    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (otp.some(d => d === '')) {
            setError('Please enter the full 6-digit code.')
            return
        }
        setIsLoading(true)
        try {
            // TODO: call verify-otp API
            await new Promise(r => setTimeout(r, 800))
            setStep('reset')
        } catch {
            setError('Invalid or expired code. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3 — new password
    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!password || password.length < 6) { setError('Password must be at least 6 characters.'); return }
        if (password.length > 72) { setError('Password must be under 72 characters.'); return }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return }
        setIsLoading(true)
        try {
            // TODO: call reset-password API
            await new Promise(r => setTimeout(r, 800))
            setStep('done')
        } catch {
            setError('Failed to reset password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const steps = ['email', 'otp', 'reset', 'done']
    const stepIndex = steps.indexOf(step)

    const EyeIcon = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
        <button type="button" onClick={toggle} className="text-gray-400 hover:text-gray-600 transition-colors">
            {show ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )}
        </button>
    )

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-10"
            style={{
                background: 'linear-gradient(135deg, #faf6f0 0%, #f5ede0 40%, #ede0cc 100%)',
                fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
        >
            <div
                className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
            />

            <div
                className="relative w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
                style={{
                    background: 'white',
                    boxShadow: '0 20px 60px rgba(74,53,37,0.18)',
                }}
            >
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #8b6b4a, #e85d1a)' }} />

                {/* Header */}
                <div className="px-10 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid #f5ede0' }}>
                    <img
                        src={LOGO_URL}
                        className="w-14 h-14 rounded-full mx-auto mb-4 object-cover"
                        style={{ background: 'linear-gradient(135deg, #8b6b4a, #6b4e35)' }}
                    />
                    <h2 className="text-2xl font-bold mb-1" style={{ color: '#4a3525' }}>
                        {step === 'done' ? 'All Done!' : 'Forgot Password'}
                    </h2>
                    <p className="text-sm" style={{ color: '#a08060' }}>
                        {step === 'email' && 'Enter your email and we\'ll send a verification code.'}
                        {step === 'otp' && `We sent a 6-digit code to ${email}`}
                        {step === 'reset' && 'Create a new password for your account.'}
                        {step === 'done' && 'Your password has been reset successfully.'}
                    </p>
                </div>

                {/* Step indicator */}
                {step !== 'done' && (
                    <div className="flex items-center justify-center gap-2 pt-6 px-10">
                        {['Email', 'Verify', 'Reset'].map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className="flex flex-col items-center gap-1">
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                        style={{
                                            background: i < stepIndex ? '#2d7a2d' : i === stepIndex ? '#e85d1a' : '#edddc8',
                                            color: i <= stepIndex ? 'white' : '#a08060',
                                        }}
                                    >
                                        {i < stepIndex ? '✓' : i + 1}
                                    </div>
                                    <span className="text-xs" style={{ color: i === stepIndex ? '#e85d1a' : '#b09070' }}>{label}</span>
                                </div>
                                {i < 2 && (
                                    <div
                                        className="w-10 h-0.5 mb-4 rounded-full transition-all"
                                        style={{ background: i < stepIndex ? '#2d7a2d' : '#edddc8' }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="px-10 py-8">
                    {error && (
                        <div
                            className="flex items-start gap-2 p-3 rounded-lg mb-5 text-sm"
                            style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#c0392b' }}
                        >
                            <span>⚠</span><span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} noValidate className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    EMAIL ADDRESS <span style={{ color: '#e85d1a' }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError('') }}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                                    style={inputBase(!!error)}
                                    onFocus={e => { if (!error) e.target.style.borderColor = '#d4af37' }}
                                    onBlur={e => { if (!error) e.target.style.borderColor = '#dcc9b0' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: '#e85d1a', boxShadow: '0 4px 16px rgba(232,93,26,0.25)' }}
                            >
                                {isLoading ? (
                                    <><Spinner /> Sending code...</>
                                ) : 'Send Verification Code'}
                            </button>
                            <p className="text-center text-xs" style={{ color: '#a08060' }}>
                                Remember your password?{' '}
                                <Link
                                    href={ROUTES.AUTH.LOGIN}
                                    className="font-semibold hover:underline" style={{ color: '#c0622a' }}>Sign in</Link>
                            </p>
                        </form>
                    )}

                    {/* STEP 2: OTP */}
                    {step === 'otp' && (
                        <form onSubmit={handleOtpSubmit} noValidate className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-4 text-center" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    ENTER 6-DIGIT CODE
                                </label>
                                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`otp-${i}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            className="w-11 h-13 text-center text-lg font-bold rounded-xl outline-none transition-all"
                                            style={{
                                                width: '44px',
                                                height: '52px',
                                                background: digit ? '#fef3e2' : '#faf6f0',
                                                border: `1.5px solid ${digit ? '#d4af37' : '#dcc9b0'}`,
                                                color: '#4a3525',
                                                fontFamily: 'Georgia, serif',
                                            }}
                                            onFocus={e => (e.target.style.borderColor = '#d4af37')}
                                            onBlur={e => { if (!otp[i]) e.target.style.borderColor = '#dcc9b0' }}
                                        />
                                    ))}
                                </div>
                                <p className="text-center text-xs mt-3" style={{ color: '#b09070' }}>
                                    Didn't receive it?{' '}
                                    <button
                                        type="button"
                                        className="font-semibold hover:underline"
                                        style={{ color: '#c0622a' }}
                                        onClick={() => { setOtp(['', '', '', '', '', '']); setError('') }}
                                    >
                                        Resend code
                                    </button>
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || otp.some(d => d === '')}
                                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: '#e85d1a', boxShadow: '0 4px 16px rgba(232,93,26,0.25)' }}
                            >
                                {isLoading ? <><Spinner /> Verifying...</> : 'Verify Code'}
                            </button>
                            <button type="button" onClick={() => { setStep('email'); setError('') }} className="w-full text-xs hover:underline" style={{ color: '#b09070' }}>
                                ← Back
                            </button>
                        </form>
                    )}

                    {/* STEP 3: Reset */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetSubmit} noValidate className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    NEW PASSWORD <span style={{ color: '#e85d1a' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setError('') }}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all"
                                        style={inputBase(!!error && error.includes('Password'))}
                                        onFocus={e => (e.target.style.borderColor = '#d4af37')}
                                        onBlur={e => (e.target.style.borderColor = '#dcc9b0')}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <EyeIcon show={showPassword} toggle={() => setShowPassword(p => !p)} />
                                    </div>
                                </div>
                                <p className="mt-1 text-xs" style={{ color: '#b09070' }}>6–72 characters</p>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    CONFIRM NEW PASSWORD <span style={{ color: '#e85d1a' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-10 rounded-xl text-sm outline-none transition-all"
                                        style={inputBase(!!error && error.includes('match'))}
                                        onFocus={e => (e.target.style.borderColor = '#d4af37')}
                                        onBlur={e => (e.target.style.borderColor = '#dcc9b0')}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <EyeIcon show={showConfirm} toggle={() => setShowConfirm(p => !p)} />
                                    </div>
                                </div>
                                {confirmPassword && password === confirmPassword && (
                                    <p className="mt-1 text-xs" style={{ color: '#2d7a2d' }}>✓ Passwords match</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{ background: '#e85d1a', boxShadow: '0 4px 16px rgba(232,93,26,0.25)' }}
                            >
                                {isLoading ? <><Spinner /> Resetting...</> : 'Reset Password'}
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
                    )}

                    {/* STEP 4: Done */}
                    {step === 'done' && (
                        <div className="text-center space-y-5">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl"
                                style={{ background: '#f0faf0', border: '2px solid #86efac' }}
                            >
                                ✓
                            </div>
                            <p className="text-sm" style={{ color: '#6b4e35', lineHeight: '1.6' }}>
                                You can now sign in with your new password.
                            </p>
                            <button
                                onClick={() => router.push('/login')}
                                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                                style={{ background: '#e85d1a', boxShadow: '0 4px 16px rgba(232,93,26,0.25)' }}
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const Spinner = () => (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
)

export default ForgotPasswordPage