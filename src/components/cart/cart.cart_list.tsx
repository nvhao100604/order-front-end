'use client'
import { useState } from "react";
import { ICartItem } from "@/interfaces"
import { useAppSelector } from "@/redux/hooks"
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi"
import ConfirmModal from "./cart.confirm_modal";
import { Modal } from "../app";
import { formatter } from "@/utils";
import { useRemoveFromCart, useSelectItem, useUpdateQuantity } from "@/hooks";

const CardItem = ({ item, setSelectedDishToRemove }
    : {
        item: ICartItem,
        setSelectedDishToRemove: (dish: ICartItem) => void
    }) => {
    const toggleItemSelection = useSelectItem()
    const confirmRemove = (dish: ICartItem) => setSelectedDishToRemove(dish)
    const updateQuantity = useUpdateQuantity()

    const updateDishQuantity = (dish: ICartItem, change: number) => {
        // console.log("change: " + change)
        if (dish.quantity + change <= 0) {
            setSelectedDishToRemove(dish)
            return
        }
        updateQuantity(dish, change)
    }

    return (
        <div
            className="sm:relative flex w-full items-center gap-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:shadow-md"
        >
            <input
                type="checkbox"
                checked={item.checked ?? false}
                onChange={() => toggleItemSelection(item)}
                className="w-4 h-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <img
                src={item.imgUrl}
                alt={item.name}
                className="shrink-0 w-20 h-20 sm:w-12 sm:h-12 object-cover rounded-md"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c";
                }}
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{formatter.format(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
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
    )
}

const CartList = () => {
    const [selectedDishToRemove, setSelectedDishToRemove] = useState<ICartItem | null>()
    const cartList = useAppSelector(state => state.cart)
    const cart = cartList.currentCart.dishes
    const removeDish = useRemoveFromCart()

    const handleRemove = () => {
        if (selectedDishToRemove) {
            removeDish(selectedDishToRemove)
            setSelectedDishToRemove(null)
        }
    }

    return (
        <>
            {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
                <>
                    <div className="space-y-4 mb-6 sm:w-full">
                        {cart.map((item) => (
                            <CardItem
                                key={item.id}
                                item={item}
                                setSelectedDishToRemove={(dish: ICartItem) => setSelectedDishToRemove(dish)}
                            />
                        ))}
                    </div>
                    <div className="mb-4 text-sm text-gray-600">
                        {cart.reduce((count, dish) => dish.checked ? count += 1 : count += 0, 0)} of {cart.length} items selected
                    </div>
                </>
            )}
            {
                selectedDishToRemove && (
                    <Modal handleClick={() => setSelectedDishToRemove(null)}>
                        <ConfirmModal
                            dish={selectedDishToRemove as ICartItem}
                            setShowConfirmModal={() => setSelectedDishToRemove(null)}
                            removeFromCart={handleRemove}
                        />
                    </Modal>
                )
            }
        </>
    )
}

export default CartList