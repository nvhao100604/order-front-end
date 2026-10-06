'use client'

import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export function ProfileSettingsTab() {
    return (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EBE6DD] shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-6">
            <div className="border-b border-[#F0ECE1] pb-4">
                <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                    Account & Security Settings
                </h2>
                <p className="text-xs text-stone-500 font-normal mt-0.5">
                    Customize language preferences, security credentials, and app preferences
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-[#F7F5F0] border border-[#EBE6DD]">
                <div>
                    <h4 className="font-bold text-stone-900 text-base">
                        System Preferences & Security
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                        Change password, configure notifications, and select system language options
                    </p>
                </div>

                <Link
                    href="/setting"
                    className="px-5 py-2.5 rounded-xl bg-[#1F1A17] hover:bg-stone-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
                >
                    <span>Open Settings</span>
                    <FiArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}
