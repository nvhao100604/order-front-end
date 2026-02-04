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
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleCloseCart}
                    className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                    <FiX size={24} />
                </button>
            </div>
            <div className="flex justify-between p-3.5 place-items-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={handleToggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <button className="text-md text-red-600 hover:text-red-700 cursor-pointer"
                    onClick={() => setIsConfirmed(true)}
                    disabled={cart.currentCart.dishes.length == 0}
                >
                    Remove All ({cart.currentCart.dishes.length})
                </button>
            </div>

            {isConfirmed &&
                <Modal handleClick={() => setIsConfirmed(false)}>
                    <div className="flex-1 items-center text-lg">
                        <h3 className="text-lg font-semibold mb-4">Remove Items</h3>
                        <p className="mb-6">Are you sure you want to remove
                            <span className="text-red-500 px-2">All Items</span>
                            from your cart?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setIsConfirmed(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleRemoveAll()
                                    setIsConfirmed(false)
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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