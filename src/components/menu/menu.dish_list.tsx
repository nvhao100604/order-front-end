'use client'
import { useFetchGet } from "@/hooks"
import { IDish } from "@/interfaces"
import { useAppDispatch } from "@/redux/hooks"
import { addToCart, updateTotal } from "@/redux/slices/cartSlices"
import { useState } from "react"
import DishModal from "./menu.dish_modal"
import { Modal } from "../app"
import DishItem from "./menu.dish_item"

const MenuList = () => {
    const [showModal, setShowModal] = useState(false)
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const query = {
        limit: 12,
        offset: 0
    }
    const { data: dishes, isLoading } = useFetchGet("Dish", query)
    const dispatch = useAppDispatch()

    const handleAdd = (dish: IDish) => {
        console.log(dish)
        dispatch(addToCart(dish))
        dispatch(updateTotal())
        setShowModal(false);
    }

    const handleClick = (dish: IDish) => {
        setSelectedDish(dish);
        setShowModal(true);
    }
    const handleClose = () => {
        setShowModal(false);
        setSelectedDish(null);
    }
    return (
        <>
            {isLoading ?
                <div>Loading...</div>
                :
                (!dishes ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No dishes found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dishes && (dishes as IDish[]).map(dish => (
                            <div
                                key={dish.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden
                                 hover:shadow-lg transition-shadow duration-300 cursor-pointer 
                                 flex flex-col
                                 animate-appear"
                            >
                                <DishItem dish={dish} onClick={handleClick} addToCart={() => handleAdd(dish)} />
                            </div>
                        ))}
                    </div>
                )
                )}
            {showModal &&
                <Modal handleClick={handleClose}>
                    <DishModal
                        dish={selectedDish as IDish}
                        onClose={handleClose}
                        addToCart={() => handleAdd(selectedDish as IDish)}
                    />
                </Modal>
            }
        </>
    )
}

export default MenuList