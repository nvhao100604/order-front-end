'use client'

import { useState, useEffect } from 'react'
import { defaultQuery, IReservationResponse } from '@/interfaces'
import { formatter } from '@/utils'
import { Header } from './app'
import { useGetReservations } from '@/hooks/useReservation'
import { useGetOrders } from '@/hooks/useOrder'
import { useEnhancedAuth } from '@/hooks/redux_custom_hooks/authSlice.hooks'
import { FiUser, FiCalendar, FiShoppingBag, FiSettings } from 'react-icons/fi'
import { reservation_services } from '@/services/reservation.services'
import { toast } from 'react-toastify'

import { ProfileHero } from './profile/ProfileHero'
import { ProfileTabs, ProfileTabKey } from './profile/ProfileTabs'
import { ProfileOverviewTab } from './profile/ProfileOverviewTab'
import { ProfileOrdersTab } from './profile/ProfileOrdersTab'
import { ProfileReservationsTab } from './profile/ProfileReservationsTab'
import { ProfileSettingsTab } from './profile/ProfileSettingsTab'

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<ProfileTabKey>('overview')
    const [editMode, setEditMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    const { user, updateProfile, mutate: mutateUser } = useEnhancedAuth()

    const { data: reservationRes, mutate: mutateReservations } = useGetReservations(
        user?.email ? { email: user.email } : undefined
    )
    const allReservations = (reservationRes?.data as IReservationResponse[] | undefined) || []
    const upcomingReservation = allReservations.find(
        (r: IReservationResponse) => r.status === 'PENDING' || r.status === 'CONFIRMED'
    )

    const handleCancelReservation = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return
        try {
            await reservation_services.cancelReservation(id)
            toast.success('Reservation cancelled successfully!')
            mutateReservations()
        } catch {
            toast.error('Failed to cancel reservation. Please try again.')
        }
    }

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phoneNumber || '',
        address: user?.address || '',
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || '',
                phone: user.phoneNumber || '',
                address: user.address || '',
            })
        }
    }, [user])

    const handleSaveProfile = async () => {
        if (!editMode) {
            setEditMode(true)
            return
        }

        setIsSaving(true)
        setStatusMsg(null)
        try {
            await updateProfile({
                name: form.name,
                email: form.email,
                phoneNumber: form.phone,
                address: form.address,
            })
            mutateUser()
            setEditMode(false)
            setStatusMsg({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setStatusMsg({ type: 'error', text: err?.message || 'Failed to update profile.' })
        } finally {
            setIsSaving(false)
        }
    }

    const { data: ordersData } = useGetOrders(
        {
            ...defaultQuery,
            customerID: user?.id,
        },
        { revalidateOnMount: true }
    )

    const orderHistory = ordersData?.data || []

    const profileUser = {
        name: user?.name || 'Valued Customer',
        email: user?.email || 'No email provided',
        phone: user?.phoneNumber || 'No phone provided',
        address: user?.address || 'No address provided',
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'foodie'}`,
        joinDate: user?.createdAt ? formatter.date(user.createdAt) : 'Member',
        memberTier: 'VIP Member',
        totalOrders: orderHistory.length,
    }

    const tabs: { id: ProfileTabKey; label: string; icon: React.ReactNode }[] = [
        { id: 'overview', label: 'Personal Info', icon: <FiUser className="w-4 h-4" /> },
        { id: 'orders', label: 'Order History', icon: <FiShoppingBag className="w-4 h-4" /> },
        { id: 'reservations', label: 'Reservation History', icon: <FiCalendar className="w-4 h-4" /> },
        { id: 'settings', label: 'Account Settings', icon: <FiSettings className="w-4 h-4" /> },
    ]

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-stone-800 pb-16 font-sans">
            <Header />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Hero Header Component */}
                <ProfileHero profileUser={profileUser} upcomingReservation={upcomingReservation} />

                {/* Sub Navigation Tabs Component */}
                <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

                {/* Tab Views */}
                {activeTab === 'overview' && (
                    <ProfileOverviewTab
                        form={form}
                        setForm={setForm}
                        editMode={editMode}
                        isSaving={isSaving}
                        statusMsg={statusMsg}
                        handleSaveProfile={handleSaveProfile}
                        profileUser={profileUser}
                    />
                )}

                {activeTab === 'orders' && <ProfileOrdersTab orderHistory={orderHistory} />}

                {activeTab === 'reservations' && (
                    <ProfileReservationsTab
                        allReservations={allReservations}
                        handleCancelReservation={handleCancelReservation}
                    />
                )}

                {activeTab === 'settings' && <ProfileSettingsTab />}
            </div>
        </div>
    )
}