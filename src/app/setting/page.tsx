'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'
import { ROUTES } from '@/config/constants/route'
import { LOGO_URL } from '@/config/constants/public'

const SettingPage = () => {
    const { user } = useEnhancedAuth()
    const [language, setLanguage] = useState<'VI' | 'EN'>('VI')
    const [emailNotif, setEmailNotif] = useState(true)
    const [orderSmsNotif, setOrderSmsNotif] = useState(true)

    // Password change form
    const [currentPass, setCurrentPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setPassMsg(null)
        if (!currentPass) return setPassMsg({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' })
        if (!newPass || newPass.length < 6) return setPassMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
        if (newPass !== confirmPass) return setPassMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp.' })

        setIsLoading(true)
        try {
            await new Promise((r) => setTimeout(r, 800))
            setPassMsg({ type: 'success', text: 'Đã đổi mật khẩu thành công!' })
            setCurrentPass('')
            setNewPass('')
            setConfirmPass('')
        } catch {
            setPassMsg({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen py-10 px-4 sm:px-6 lg:px-8"
            style={{
                background: 'linear-gradient(135deg, #FAF6F0 0%, #F5EDE0 100%)',
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Top Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img
                            src={LOGO_URL}
                            alt="Logo"
                            className="w-12 h-12 rounded-full border border-amber-900/20 object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-amber-950 font-serif">⚙️ Cài Đặt Hệ Thống</h1>
                            <p className="text-xs text-amber-900/60">Tùy chỉnh cấu hình tài khoản & thông báo của bạn</p>
                        </div>
                    </div>

                    <Link
                        href={ROUTES.GUEST.HOME}
                        className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-900/20 transition-all"
                    >
                        🏠 Trang chủ
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar menu */}
                    <div className="space-y-2">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-900/10 space-y-1">
                            <a
                                href="#general"
                                className="block px-4 py-2.5 rounded-xl font-semibold text-sm bg-amber-600 text-white shadow-xs"
                            >
                                🌐 Thói Quản & Ngôn Ngữ
                            </a>
                            <a
                                href="#notifications"
                                className="block px-4 py-2.5 rounded-xl font-medium text-sm text-amber-900 hover:bg-amber-50 transition-colors"
                            >
                                🔔 Cấu Hình Thông Báo
                            </a>
                            <a
                                href="#security"
                                className="block px-4 py-2.5 rounded-xl font-medium text-sm text-amber-900 hover:bg-amber-50 transition-colors"
                            >
                                🔒 Mật Khẩu & Bảo Mật
                            </a>
                        </div>
                    </div>

                    {/* Main content panels */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Panel 1: Preferences */}
                        <div id="general" className="bg-white rounded-2xl p-6 shadow-sm border border-amber-900/10 space-y-4">
                            <h2 className="text-lg font-bold text-amber-950 border-b border-amber-900/10 pb-3">
                                🌐 Ngôn Ngữ & Giao Diện
                            </h2>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-amber-950 text-sm">Ngôn ngữ hiển thị</h3>
                                    <p className="text-xs text-amber-900/60">Chọn ngôn ngữ mặc định trên toàn hệ thống</p>
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'VI' | 'EN')}
                                    className="px-3 py-2 rounded-xl border border-amber-900/20 text-sm bg-amber-50/50 text-amber-900 font-semibold outline-none"
                                >
                                    <option value="VI">🇻🇳 Tiếng Việt</option>
                                    <option value="EN">🇺🇸 English</option>
                                </select>
                            </div>
                        </div>

                        {/* Panel 2: Notifications */}
                        <div id="notifications" className="bg-white rounded-2xl p-6 shadow-sm border border-amber-900/10 space-y-4">
                            <h2 className="text-lg font-bold text-amber-950 border-b border-amber-900/10 pb-3">
                                🔔 Kênh Nhận Thông Báo
                            </h2>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-amber-950 text-sm">Thông báo qua Email</h3>
                                    <p className="text-xs text-amber-900/60">Nhận thông tin ưu đãi và cập nhật trạng thái đơn hàng</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotif}
                                    onChange={(e) => setEmailNotif(e.target.checked)}
                                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div>
                                    <h3 className="font-semibold text-amber-950 text-sm">Thông báo SMS đặt bàn</h3>
                                    <p className="text-xs text-amber-900/60">Gửi tin nhắn xác nhận giữ chỗ trước qua điện thoại</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={orderSmsNotif}
                                    onChange={(e) => setOrderSmsNotif(e.target.checked)}
                                    className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Panel 3: Change Password */}
                        <div id="security" className="bg-white rounded-2xl p-6 shadow-sm border border-amber-900/10 space-y-4">
                            <h2 className="text-lg font-bold text-amber-950 border-b border-amber-900/10 pb-3">
                                🔒 Đổi Mật Khẩu
                            </h2>

                            {passMsg && (
                                <div
                                    className={`p-3 rounded-xl text-xs font-semibold ${
                                        passMsg.type === 'success'
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                                >
                                    {passMsg.text}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Mật khẩu hiện tại
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={currentPass}
                                        onChange={(e) => setCurrentPass(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={newPass}
                                        onChange={(e) => setNewPass(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'Đang xử lý...' : 'Cập Nhật Mật Khẩu'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingPage