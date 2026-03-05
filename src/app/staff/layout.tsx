import { ProtectedRoute, StaffShell } from "@/components";
import { PERMISSIONS } from "@/config/constants/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Staff Portal – Foodie Restaurant",
    description: "Hệ thống quản lý nhà hàng dành cho nhân viên",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProtectedRoute requiredRoles={[...PERMISSIONS.STAFF_AND_ADMIN]}
            >
                <StaffShell>{children}</StaffShell>
            </ProtectedRoute>
        </>
    );
}