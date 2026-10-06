'use client'

import React from 'react'

export type ProfileTabKey = 'overview' | 'orders' | 'reservations' | 'settings'

interface ProfileTabsProps {
    activeTab: ProfileTabKey
    setActiveTab: (tab: ProfileTabKey) => void
    tabs: { id: ProfileTabKey; label: string; icon: React.ReactNode }[]
}

export function ProfileTabs({ activeTab, setActiveTab, tabs }: ProfileTabsProps) {
    return (
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F4EEE7] border border-[#E2D6C8] shadow-xs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        activeTab === tab.id
                            ? 'bg-[#C4823F] text-white shadow-sm'
                            : 'text-stone-600 hover:text-stone-900 hover:bg-[#EAE2D7]'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    )
}
