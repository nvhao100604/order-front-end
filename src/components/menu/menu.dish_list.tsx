'use client'
import { useAddToCart } from "@/hooks"
import { ICartItem, IDish } from "@/interfaces"
import { useEffect, useState } from "react"
import DishModal from "./menu.dish_modal"
import { Modal } from "../app"
import DishItem from "./menu.dish_item"
import LoadingBox from "../ui/loading"
import { scrollToTop } from "@/utils"

const MenuList = (
    { dishes, isLoading }:
        {
            dishes: IDish[] | undefined,
            isLoading: boolean
        }
) => {
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)
    const handleAdd = useAddToCart()

    useEffect(() => {
        if (!isLoading) scrollToTop()
    }, [isLoading])

    const handleClick = (dish: IDish) => setSelectedDish(dish)
    const handleClose = () => setSelectedDish(null)

    return (
        <>
            {isLoading ?
                <div className="w-full h-screen">
                    <LoadingBox />
                </div>
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
                                <DishItem dish={dish} onClick={handleClick} addToCart={() => handleAdd({
                                    ...(dish as ICartItem),
                                    quantity: 1,
                                    checked: false
                                })} />
                            </div>
                        ))}
                    </div>
                )
                )}
            {selectedDish &&
                <>
                    <Modal handleClick={handleClose}>
                        <DishModal
                            dish={selectedDish as ICartItem}
                            onClose={handleClose}
                            addToCart={() => handleAdd(selectedDish as ICartItem)}
                        />
                    </Modal>
                </>

            }
        </>
    )
}

export default MenuList