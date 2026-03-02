import { StaffShell } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Staff Portal – Foodie Restaurant",
    description: "Hệ thống quản lý nhà hàng dành cho nhân viên",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <StaffShell>{children}</StaffShell>
        </>
    );
}