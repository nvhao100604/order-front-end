'use client'
import { RefObject, useEffect, useState } from "react"

interface IntersectionObserverProps {
    ref: RefObject<HTMLElement | null>,
    threshold?: number,
    root?: Element | null,
    rootMargin?: string
}

const useIntersectionObserver = ({
    ref,
    threshold = 0.2,
    root = null,
    rootMargin = "0px"
}: IntersectionObserverProps) => {
    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

    useEffect(() => {
        if (!ref) return
        if (!ref.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                setEntry(entry)
                // console.log("check entry: ", entry)
                if (entry.isIntersecting) observer.disconnect()
            }
        )

        observer.observe(ref.current)

        return () => observer.disconnect()
    }, [ref, threshold, root, rootMargin])

    return {
        entry,
        isVisible: !!entry?.isIntersecting
    }
}

export { useIntersectionObserver }