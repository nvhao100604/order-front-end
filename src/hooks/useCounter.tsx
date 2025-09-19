'use client'
import { useEffect, useRef, useState } from "react";

const useCounter = (endNumber: number, duration: number, isVisible: boolean) => {
    const [count, setCount] = useState(0)
    const timerIdRef = useRef<NodeJS.Timeout | null>(null)
    const currentCountRef = useRef(0)

    useEffect(() => {
        if (endNumber <= 0 || duration <= 0) return
        const stepTime = duration / endNumber

        const runCounter = () => {
            currentCountRef.current += 1
            setCount(currentCountRef.current)

            if (currentCountRef.current < endNumber) {
                timerIdRef.current = setTimeout(runCounter, stepTime)
            }
        }

        if (isVisible == true) runCounter()
        return () => {
            if (timerIdRef.current) clearTimeout(timerIdRef.current)
        }
    }, [endNumber, duration, isVisible])

    return count
}

export default useCounter