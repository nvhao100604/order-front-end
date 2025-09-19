'use client'
import { useCartControl } from "@/hooks"
import { useAppSelector } from "@/redux/hooks"
import { scrollToTop } from "@/utils"
import { useEffect, useRef, useState } from "react"

const CartToggle = () => {
    let timerId = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [isCartUpdate, setIsCartUpdate] = useState(true)
    const { currentCart: cart } = useAppSelector(state => state.cart)
    const handleControlCart = useCartControl()

    useEffect(() => {
        setIsCartUpdate(true)
        timerId.current = setTimeout(() => {
            setIsCartUpdate(false)
        }, 1500)

        return () => {
            clearTimeout(timerId.current!)
        }
    }, [cart.dishes])

    const setCartOpen = () => {
        handleControlCart()
        scrollToTop()
    }

    return (
        <button
            onClick={setCartOpen}
            className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg z-100
             text-white bg-green-500 hover:bg-green-800
            ${isCartUpdate ? "animate-[wiggle_0.5s_ease-in-out_0.1s]" : ""}`}
        >
            Cart ({cart.dishes.length})
        </button>
    )
}

export default CartToggle