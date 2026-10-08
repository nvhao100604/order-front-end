'use client'
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { POLL_INTERVAL } from "@/config/constants/api";
import { getDashboardOrdersSWR } from "./useDashboard";
import { IOrderResponse } from "@/interfaces";

/**
 * useOrderPolling
 *
 * Replaces useOrderWebSocket with a polling-based approach.
 * Fetches dashboard orders every POLL_INTERVAL milliseconds using SWR,
 * then compares snapshots to detect new orders and status changes,
 * firing toast notifications accordingly.
 *
 * Drop-in replacement for useOrderWebSocket in StaffShell.
 */
const useOrderPolling = () => {
    // Store the previous list of orders so we can diff on each poll
    const prevOrdersRef = useRef<IOrderResponse[] | null>(null);
    // Track order IDs that have already been toasted to avoid duplicates
    const seenNewOrderIds = useRef<Set<string | number>>(new Set());

    const { data } = getDashboardOrdersSWR(undefined, {
        refreshInterval: POLL_INTERVAL,
        revalidateOnFocus: true,
        revalidateIfStale: true,
        revalidateOnReconnect: true,
    });

    useEffect(() => {
        const rawOrders = data?.data;
        if (!Array.isArray(rawOrders)) return;

        const currentOrders: IOrderResponse[] = rawOrders;

        // ── First load: just store snapshot, no toasts ──────────────────
        if (prevOrdersRef.current === null) {
            prevOrdersRef.current = currentOrders;
            // Seed seen-set so we don't toast on first load
            currentOrders.forEach((o) => seenNewOrderIds.current.add(o.id));
            return;
        }

        const prevOrders = prevOrdersRef.current;

        // ── Detect NEW orders ────────────────────────────────────────────
        const prevIds = new Set(prevOrders.map((o) => o.id));
        const newOrders = currentOrders.filter(
            (o) => !prevIds.has(o.id) && !seenNewOrderIds.current.has(o.id)
        );

        newOrders.forEach((order) => {
            seenNewOrderIds.current.add(order.id);
            toast.info(`🔔 New Order #${order.id} — Table ${order.tableID ?? ""}`, {
                toastId: `new-order-${order.id}`,
            });
        });

        // ── Detect STATUS changes on existing orders ─────────────────────
        const prevStatusMap = new Map(prevOrders.map((o) => [o.id, o.status]));
        currentOrders.forEach((order) => {
            const prevStatus = prevStatusMap.get(order.id);
            if (prevStatus !== undefined && prevStatus !== order.status) {
                toast.success(
                    `✅ Order #${order.id} → ${order.status}`,
                    { toastId: `status-${order.id}-${order.status}` }
                );
            }
        });

        // ── Update snapshot ───────────────────────────────────────────────
        prevOrdersRef.current = currentOrders;
    }, [data]);
};

export default useOrderPolling;
