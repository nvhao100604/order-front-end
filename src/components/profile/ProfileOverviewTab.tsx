'use client'

import Link from 'next/link'
import { ROUTES } from '@/config/constants/route'
import {
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiAward,
    FiEdit3,
    FiSave,
    FiCheckCircle,
    FiArrowRight,
} from 'react-icons/fi'

interface ProfileForm {
    name: string
    email: string
    phone: string
    address: string
}

interface ProfileOverviewTabProps {
    form: ProfileForm
    setForm: React.Dispatch<React.SetStateAction<ProfileForm>>
    editMode: boolean
    isSaving: boolean
    statusMsg: { type: 'success' | 'error'; text: string } | null
    handleSaveProfile: () => void
    profileUser: {
        name: string
        email: string
        phone: string
        address: string
    }
}

export function ProfileOverviewTab({
    form,
    setForm,
    editMode,
    isSaving,
    statusMsg,
    handleSaveProfile,
    profileUser,
}: ProfileOverviewTabProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DD] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
                {statusMsg && (
                    <div
                        className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                            statusMsg.type === 'success'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                    >
                        <FiCheckCircle className="w-4 h-4 shrink-0" />
                        <span>{statusMsg.text}</span>
                    </div>
                )}

                <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-4">
                    <div>
                        <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                            Personal Profile
                        </h2>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                            Manage your profile details and contact preferences
                        </p>
                    </div>

                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2 ${
                            editMode
                                ? 'bg-[#C4823F] text-white hover:bg-[#B27333]'
                                : 'bg-[#F5F2EC] text-stone-700 hover:bg-[#EAE5DC] border border-[#E2DDD5]'
                        }`}
                    >
                        {isSaving ? (
                            'Saving...'
                        ) : editMode ? (
                            <>
                                <FiSave className="w-4 h-4" />
                                <span>Save Details</span>
                            </>
                        ) : (
                            <>
                                <FiEdit3 className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-stone-500 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                            <FiUser className="w-3.5 h-3.5 text-stone-400" />
                            <span>Full Name</span>
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2DDD5] text-sm text-stone-900 outline-none focus:border-[#C4823F] bg-[#F7F5F0] focus:bg-white transition-all"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-stone-900 px-4 py-2.5 bg-[#F7F5F0] rounded-xl border border-[#EBE6DD]">
                                {profileUser.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-stone-500 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                            <FiMail className="w-3.5 h-3.5 text-stone-400" />
                            <span>Email Address</span>
                        </label>
                        {editMode ? (
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2DDD5] text-sm text-stone-900 outline-none focus:border-[#C4823F] bg-[#F7F5F0] focus:bg-white transition-all"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-stone-900 px-4 py-2.5 bg-[#F7F5F0] rounded-xl border border-[#EBE6DD]">
                                {profileUser.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-stone-500 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                            <FiPhone className="w-3.5 h-3.5 text-stone-400" />
                            <span>Phone Number</span>
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2DDD5] text-sm text-stone-900 outline-none focus:border-[#C4823F] bg-[#F7F5F0] focus:bg-white transition-all"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-stone-900 px-4 py-2.5 bg-[#F7F5F0] rounded-xl border border-[#EBE6DD]">
                                {profileUser.phone}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-stone-500 tracking-wide uppercase mb-2 flex items-center gap-1.5">
                            <FiMapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>Delivery Address</span>
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-[#E2DDD5] text-sm text-stone-900 outline-none focus:border-[#C4823F] bg-[#F7F5F0] focus:bg-white transition-all"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-stone-900 px-4 py-2.5 bg-[#F7F5F0] rounded-xl border border-[#EBE6DD] truncate">
                                {profileUser.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right 1 Col: VIP Benefits & Quick Menu Banner */}
            <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-[#EBE6DD] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
                    <h3 className="font-bold text-stone-900 text-base flex items-center gap-2 border-b border-[#F0ECE1] pb-3">
                        <FiAward className="w-4 h-4 text-[#C4823F]" />
                        <span>Member Privileges</span>
                    </h3>
                    <ul className="space-y-3 text-xs text-stone-600 font-medium">
                        <li className="flex items-start gap-2.5">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>10% discount on total dining bill for online reservations</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Priority table allocation for special occasions</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                            <FiCheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>Complimentary dessert treats on birthdays</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-[#1F1A17] rounded-2xl p-6 text-stone-200 border border-[#332A24] space-y-3 shadow-md">
                    <h3 className="font-bold text-white text-base tracking-tight">
                        Explore Gourmet Menu
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed">
                        Discover our handcrafted seasonal dishes available for dine-in and delivery.
                    </p>
                    <Link
                        href={ROUTES.GUEST.MENU}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C4823F] hover:bg-[#B27333] text-white text-xs font-semibold transition-all shadow-sm"
                    >
                        <span>Browse Menu</span>
                        <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
