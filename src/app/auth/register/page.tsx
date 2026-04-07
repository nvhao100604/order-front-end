'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LOGO_URL, ROUTES } from '@/config'
import { Status, UserCreate } from '@/interfaces'
import Link from 'next/link'
import { useAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'

type FormData = Omit<UserCreate, 'status'> & {
    confirmPassword: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

const RegisterPage = () => {
    const router = useRouter()
    const { isAuthenticated } = useAuth()

    const [form, setForm] = useState<FormData>({
        username: '',
        name: '',
        email: '',
        phoneNumber: '',
        address: '',
        password: '',
        confirmPassword: '',
        roleID: undefined,
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)
    const [serverError, setServerError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (isAuthenticated) router.push(ROUTES.GUEST.HOME)
    }, [isAuthenticated, router])

    const validate = (): boolean => {
        const e: FormErrors = {}
        if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters.'
        if (form.username.length > 255) e.username = 'Username must be under 255 characters.'
        if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters.'
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.'
        if (!form.phoneNumber || !/^\d{10}$/.test(form.phoneNumber)) e.phoneNumber = 'Phone number must be exactly 10 digits.'
        if (form.address && form.address.length > 255) e.address = 'Address must be under 255 characters.'
        if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters.'
        if (form.password.length > 72) e.password = 'Password must be under 72 characters.'
        if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.'
        else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleChange = (field: keyof FormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setIsLoading(true)
        setServerError('')
        try {
            const payload: UserCreate = {
                username: form.username,
                name: form.name,
                email: form.email,
                phoneNumber: form.phoneNumber,
                address: form.address || undefined,
                status: Status.ACTIVE,
                password: form.password,
                roleID: form.roleID,
            }
            // TODO: call your register API here
            console.log('Register payload:', payload)
            router.push(ROUTES.GUEST.HOME)
        } catch (err: any) {
            setServerError(err?.message || 'Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (isAuthenticated) return null

    const inputStyle = (hasError: boolean) => ({
        background: '#faf6f0',
        border: `1.5px solid ${hasError ? '#f87171' : '#dcc9b0'}`,
        color: '#4a3525',
        fontFamily: 'Georgia, serif',
    })

    const Field = ({
        label, field, type = 'text', placeholder, required = true, hint, rightSlot,
    }: {
        label: string
        field: keyof FormData
        type?: string
        placeholder?: string
        required?: boolean
        hint?: string
        rightSlot?: React.ReactNode
    }) => (
        <div>
            <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                {label.toUpperCase()}{required && <span style={{ color: '#e85d1a' }}> *</span>}
            </label>
            <div className="relative">
                <input
                    type={type}
                    value={form[field] as string}
                    onChange={e => handleChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={inputStyle(!!errors[field])}
                    onFocus={e => { if (!errors[field]) e.target.style.borderColor = '#d4af37' }}
                    onBlur={e => { if (!errors[field]) e.target.style.borderColor = '#dcc9b0' }}
                />
                {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
            </div>
            {errors[field] && <p className="mt-1 text-xs" style={{ color: '#c0392b' }}>{errors[field]}</p>}
            {hint && !errors[field] && <p className="mt-1 text-xs" style={{ color: '#b09070' }}>{hint}</p>}
        </div>
    )

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
                className="relative w-full max-w-2xl rounded-2xl overflow-hidden animate-slide-up"
                style={{
                    background: 'white',
                    boxShadow: '0 20px 60px rgba(74,53,37,0.18)',
                }}
            >
                <div style={{ height: '4px', background: 'linear-gradient(90deg, #8b6b4a, #e85d1a)' }} />

                <div className="px-10 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid #f5ede0' }}>
                    <img
                        src={LOGO_URL}
                        className="w-14 h-14 rounded-full mx-auto mb-4 object-cover"
                        style={{ background: 'linear-gradient(135deg, #8b6b4a, #6b4e35)' }}
                    />
                    <h2 className="text-2xl font-bold mb-1" style={{ color: '#4a3525' }}>Create an Account</h2>
                    <p className="text-sm" style={{ color: '#a08060' }}>Join Foodie Restaurant and enjoy exclusive member benefits</p>
                </div>

                <div className="px-10 py-8">
                    {serverError && (
                        <div
                            className="flex items-start gap-2 p-3 rounded-lg mb-6 text-sm"
                            style={{ background: '#fff5f5', border: '1px solid #fecaca', color: '#c0392b' }}
                        >
                            <span className="mt-0.5">⚠</span>
                            <span>{serverError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <p className="text-xs font-bold tracking-widest mb-4" style={{ color: '#c0622a' }}>ACCOUNT DETAILS</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Field label="Username" field="username" placeholder="ex: nguyenvana123" />
                            <Field label="Full Name" field="name" placeholder="ex: Nguyen Van A" />
                            <div className="sm:col-span-2">
                                <Field label="Email" field="email" type="email" placeholder="ex: you@example.com" />
                            </div>
                        </div>

                        <p className="text-xs font-bold tracking-widest mb-4" style={{ color: '#c0622a' }}>PERSONAL INFORMATION</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Field label="Phone Number" field="phoneNumber" placeholder="ex: 0912345678" hint="Exactly 10 digits" />
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    ADDRESS
                                </label>
                                <input
                                    type="text"
                                    name="street-address"
                                    id="street-address"
                                    value={form.address ?? ''}
                                    onChange={e => handleChange('address', e.target.value)}
                                    placeholder="Your address..."
                                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                                    style={inputStyle(false)}
                                    onFocus={e => (e.target.style.borderColor = '#d4af37')}
                                    onBlur={e => (e.target.style.borderColor = '#dcc9b0')}
                                    autoComplete="street-address"
                                />
                                {errors.address && <p className="mt-1 text-xs" style={{ color: '#c0392b' }}>{errors.address}</p>}
                            </div>
                        </div>

                        <p className="text-xs font-bold tracking-widest mb-4" style={{ color: '#c0622a' }}>SECURITY</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    PASSWORD <span style={{ color: '#e85d1a' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={form.password}
                                        onChange={e => handleChange('password', e.target.value)}
                                        placeholder=""
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all"
                                        style={inputStyle(!!errors.password)}
                                        onFocus={e => { if (!errors.password) e.target.style.borderColor = '#d4af37' }}
                                        onBlur={e => { if (!errors.password) e.target.style.borderColor = '#dcc9b0' }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <EyeIcon show={showPassword} toggle={() => setShowPassword(p => !p)} />
                                    </div>
                                </div>
                                {errors.password
                                    ? <p className="mt-1 text-xs" style={{ color: '#c0392b' }}>{errors.password}</p>
                                    : <p className="mt-1 text-xs" style={{ color: '#b09070' }}>Your password with 6–72 characters</p>
                                }
                            </div>

                            <div>
                                <label className="block text-xs font-semibold tracking-wider mb-1.5" style={{ color: 'rgba(107,78,53,0.6)' }}>
                                    CONFIRM PASSWORD <span style={{ color: '#e85d1a' }}>*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={form.confirmPassword}
                                        onChange={e => handleChange('confirmPassword', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm outline-none transition-all"
                                        style={inputStyle(!!errors.confirmPassword)}
                                        onFocus={e => { if (!errors.confirmPassword) e.target.style.borderColor = '#d4af37' }}
                                        onBlur={e => { if (!errors.confirmPassword) e.target.style.borderColor = '#dcc9b0' }}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <EyeIcon show={showConfirm} toggle={() => setShowConfirm(p => !p)} />
                                    </div>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-xs" style={{ color: '#c0392b' }}>{errors.confirmPassword}</p>
                                )}
                                {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                                    <p className="mt-1 text-xs" style={{ color: '#2d7a2d' }}>✓ Passwords match</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ background: '#e85d1a', boxShadow: '0 4px 16px rgba(232,93,26,0.25)' }}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <p className="text-center text-xs mt-5" style={{ color: '#a08060' }}>
                            Already have an account?{' '}
                            <Link
                                href={ROUTES.AUTH.LOGIN}
                                className="font-semibold hover:underline" style={{ color: '#c0622a' }}>
                                Sign in here
                            </Link>
                        </p>
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
                </div>
            </div>
        </div>
    )
}

export default RegisterPage