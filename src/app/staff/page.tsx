"use client";

import LoadingBox from "@/components/ui/loading";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffPage() {
    const { activeTab } = useAppSelector((state) => state.staff);
    const router = useRouter();

    useEffect(() => {
        router.replace(`/staff/${activeTab}`);
    }, [activeTab, router]);

    return (
        <div className="flex items-center justify-center h-full bg-[#f0e6d3]">
            {/* <LoadingBox /> */}
        </div>
    );
}