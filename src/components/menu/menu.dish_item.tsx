import { IDish } from "@/interfaces";
import { formatter } from "@/utils";
import { FaHeart, FaStar } from "react-icons/fa";
import AddToCart from "./menu.addToCartButton";

const DishItem = ({ dish, onClick, addToCart }:
    { dish: IDish, onClick: (dish: IDish) => void, addToCart: () => void }) => {
    return (
        <div
            onClick={() => onClick(dish)}
            className="w-full max-w-[240px] md:max-w-[280px] mx-auto h-full bg-white rounded-xl overflow-hidden cursor-pointer flex flex-col transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-900/5 hover:shadow-2xl hover:shadow-orange-900/15"
        >
            <div className="relative h-32 md:h-40 overflow-hidden shrink-0">
                <img
                    className="h-full w-full object-cover animate-fadeIn"
                    src={dish.imgUrl}
                    alt={dish.name}
                />

                <button
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-2 right-2 bg-white/90 text-gray-400 rounded-full p-2 text-sm md:text-base hover:text-pink-500 shadow-sm transition-colors"
                >
                    <FaHeart />
                </button>
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1 relative text-left">
                <h3 className="text-sm md:text-base font-bold text-gray-800 mb-1 line-clamp-1">
                    {dish.name}
                </h3>

                <p className="text-[11px] md:text-xs text-gray-500 font-medium line-clamp-2 mb-2">
                    {dish.describe}
                </p>

                <div className="flex items-center text-yellow-400 mb-4">
                    <FaStar className="text-[10px] md:text-xs" />
                    <FaStar className="text-[10px] md:text-xs" />
                    <FaStar className="text-[10px] md:text-xs" />
                    <FaStar className="text-[10px] md:text-xs" />
                    <FaStar className="text-[10px] md:text-xs" />
                    <span className="text-gray-400 ml-1 font-medium text-[10px] md:text-xs">(4.8)</span>
                </div>

                <div className="flex justify-between items-end mt-auto pt-2 border-t border-gray-100/80">
                    <span className="text-base md:text-lg font-bold text-orange-600 pb-0.5 md:pb-1">
                        {formatter.format(dish.price)}
                    </span>

                    <div
                        className="shrink-0 scale-90 md:scale-100 origin-bottom-right"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AddToCart addToCart={addToCart} />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DishItem;