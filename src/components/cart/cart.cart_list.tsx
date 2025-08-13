'use client'
import { useState } from "react";
import { IDish, tempDish } from "@/interfaces"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"
import ConfirmModal from "./cart.confirm_modal";
import { removeFromCart, selectDish, updateQuantity } from "@/redux/slices/cartSlices";
import { Modal } from "../app";

const CartList = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedDishToRemove, setSelectedDishToRemove] = useState(tempDish)
    const cartList = useAppSelector(state => state.cart)
    const dispatch = useAppDispatch()
    const cart = cartList.currentCart.dishes

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    })

    const toggleItemSelection = (dish: IDish) => {
        dispatch(selectDish(dish))
    }
    const confirmRemove = (dish: IDish) => {
        setSelectedDishToRemove(dish)
        setShowConfirmModal(true)
    };
    const removeDish = () => {
        if (selectedDishToRemove) {
            dispatch(removeFromCart(selectedDishToRemove))
            console.log("removed")
            setShowConfirmModal(false)
            setSelectedDishToRemove(tempDish)
        }
    }
    const updateDishQuantity = (dish: IDish, change: number) => {
        console.log("change: " + change)
        if (dish.quantity! + change <= 0) {
            setSelectedDishToRemove(dish)
            setShowConfirmModal(true)
            return
        }
        dispatch(updateQuantity({ ...dish, quantity: (dish.quantity ?? 0) + change }))

    }
    return (
        <>
            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6 sm:w-full">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="sm:relative flex w-full items-center gap-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md"
                            >
                                <input
                                    type="checkbox"
                                    checked={item.checked ?? false}
                                    onChange={() => toggleItemSelection(item)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="checkbox"></div>
                                <img
                                    src={item.imgUrl}
                                    alt={item.name}
                                    className="w-20 h-20 sm:w-12 sm:h-12 object-cover rounded-md"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                                    }}
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">{formatter.format(item.price)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateDishQuantity(item, -1)}
                                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                    // disabled={(item.quantity ?? 0) <= 1}
                                    >
                                        <FiMinus />
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateDishQuantity(item, 1)}
                                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                                    >
                                        <FiPlus />
                                    </button>
                                    <button
                                        onClick={() => confirmRemove(item)}
                                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                        {cart.reduce((count, dish) => dish.checked ? count += 1 : count += 0, 0)} of {cart.length} items selected
                    </div>
                </>
            )}
            {
                showConfirmModal && (
                    <Modal handleClick={() => setShowConfirmModal(false)}>
                        <ConfirmModal
                            dish={selectedDishToRemove as IDish}
                            setShowConfirmModal={() => setShowConfirmModal(false)}
                            removeFromCart={removeDish}
                        />
                    </Modal>
                )
            }
        </>
    )
}

export default CartList