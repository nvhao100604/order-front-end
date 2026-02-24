'use client'
import { useCloseCart, useRemoveAll, useSelectAll } from "@/hooks"
import { useAppSelector } from "@/redux/hooks"
import { useState } from "react"
import { FiX } from "react-icons/fi"
import { Modal } from "../app"

const CartHeader = () => {
    const [isSelected, setIsSelected] = useState(false)
    const [isConfirmed, setIsConfirmed] = useState(false)
    const handleCloseCart = useCloseCart()
    const handleRemoveAll = useRemoveAll()
    const handleSelectAll = useSelectAll()

    const cart = useAppSelector(state => state.cart)

    const handleToggleAll = () => {
        handleSelectAll(!isSelected)
        setIsSelected(prev => !prev)
    }

    return (
        <>
            <div className="flex justify-end items-center mb-2 md:mb-4">
                <button
                    onClick={handleCloseCart}
                    className="md:hidden text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 p-2 rounded-full"
                >
                    <FiX size={20} />
                </button>
            </div>

            <div className="flex justify-between items-center px-2 py-3 border-b border-gray-100 mb-2">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={cart.currentCart.dishes.length === 0}
                        onChange={handleToggleAll}
                        className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-600">Select All</span>
                </div>

                <button
                    className={`text-sm font-medium transition-colors ${cart.currentCart.dishes.length === 0 ? "text-gray-300 cursor-not-allowed" : "text-red-500 hover:text-red-600"}`}
                    onClick={() => setIsConfirmed(true)}
                    disabled={cart.currentCart.dishes.length === 0}
                >
                    Remove All ({cart.currentCart.dishes.length})
                </button>
            </div>

            {isConfirmed &&
                <Modal handleClick={() => setIsConfirmed(false)}>
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex justify-center items-center mb-4">
                            <FiX size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Remove All Items?</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to clear your entire cart? This action cannot be undone.
                        </p>
                        <div className="flex justify-center w-full gap-3">
                            <button
                                onClick={() => setIsConfirmed(false)}
                                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleRemoveAll()
                                    setIsConfirmed(false)
                                }}
                                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </Modal>}
        </>
    )
}
export default CartHeader