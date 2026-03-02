"use client";

import { useAppSelector } from "@/redux/hooks";
import { DashboardTab, ManageTab, OrderTab } from "@/components/staff/staff.components";

export default function StaffPage() {
    const { activeTab } = useAppSelector((state) => state.staff);

    return (
        <div className="h-[calc(100dvh-64px)] overflow-hidden">
            {activeTab === 'dashboard' && <DashboardTab />}
            {activeTab === 'order' && <OrderTab />}
            {activeTab === 'manage' && <ManageTab />}
        </div>
    );
}