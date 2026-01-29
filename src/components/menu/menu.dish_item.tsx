import { IDish } from "@/interfaces";
import { formatter } from "@/utils";
import { FaHeart, FaLeaf } from "react-icons/fa";
import AddToCart from "./menu.addtocart_button";

const DishItem = ({ dish, onClick, addToCart }:
    { dish: IDish, onClick: (dish: IDish) => void, addToCart: () => void }) => {
    return (
        <>
            <div className="relative">
                <div className="absolute top-2 right-2 z-5">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <FaHeart className="text-gray-400 hover:text-pink-500" />
                    </button>
                </div>
            </div>
            <div
                className="mt-0"
                onClick={() => onClick(dish)}>
                <div className="relative md:h-48 sm:h-36">
                    <img
                        src={dish.imgUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start">
                        <h3 className="md:text-md sm:text-sm font-semibold">{dish.name}</h3>
                        <span className="text-orange-500 md:text-md sm:text-sm font-semibold">
                            {formatter.format(dish.price)}
                        </span>
                    </div>
                </div>
            </div>
            <div
                className="p-2 place-items-center lg:flex lg:place-content-between sm:justify-items-end mt-auto">
                <p className="text-gray-600 text-sm px-2 lg:inline sm:hidden">{dish.describe}</p>
                <AddToCart addToCart={addToCart} />
            </div>
        </>
    )
}

export default DishItem