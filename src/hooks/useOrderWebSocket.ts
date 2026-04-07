'use client'
import { useEffect, useRef } from "react";
import { useSWRConfig } from "swr";
import { DASHBOARD_ORDERS_KEY } from "@/config/constants/api";
import { toast } from "react-toastify";
import { store } from "@/redux/store";

const useOrderWebSocket = () => {
    const { mutate } = useSWRConfig();
    const socketRef = useRef<WebSocket | null>(null)
    const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const destroyed = useRef(false)

    useEffect(() => {
        destroyed.current = false

        const connect = () => {
            if (destroyed.current) return

            const existing = socketRef.current
            if (existing && (existing.readyState === WebSocket.OPEN || existing.readyState === WebSocket.CONNECTING)) return

            const token = store.getState().auth.token
            if (!token) {
                retryTimer.current = setTimeout(connect, 2000)
                return
            }

            const socket = new WebSocket(`ws://localhost:8080/ws/orders?token=${token}`)
            socketRef.current = socket

            socket.onopen = () => console.log("✅ WebSocket connected")

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                switch (data.type) {
                    case "NEW_ORDER": {
                        toast.info(`🔔 ${data.message}`, {
                            toastId: `new-order-${data.order?.id}`
                        })
                        mutate(
                            DASHBOARD_ORDERS_KEY,
                            { revalidate: false }
                        )
                        break
                    }

                    case "STATUS_UPDATED": {
                        toast.success(`Update: Order #${data.order_id} → ${data.new_status}`, {
                            toastId: `status-${data.order_id}-${data.new_status}`
                        })
                        mutate(
                            DASHBOARD_ORDERS_KEY,
                            { revalidate: false }
                        )
                        break
                    }

                    default:
                        console.log("Unknown WS type:", data.type)
                }
            }

            socket.onclose = () => {
                if (destroyed.current) return
                console.log("🔄 Reconnecting...")
                retryTimer.current = setTimeout(connect, 3000)
            }

            socket.onerror = () => socket.close()
        }

        connect()

        return () => {
            destroyed.current = true
            if (retryTimer.current) {
                clearTimeout(retryTimer.current)
                retryTimer.current = null
            }
            if (socketRef.current) {
                socketRef.current.onclose = null
                socketRef.current.close()
                socketRef.current = null
            }
        }
    }, [mutate])
}

export default useOrderWebSocket