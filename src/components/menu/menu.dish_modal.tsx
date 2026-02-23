'use client'
import { useState } from "react";
import { IDish } from "@/interfaces";
import { formatter } from "@/utils";
import { FaHeart, FaStar, FaTimes, FaMinus, FaPlus, FaClock, FaFireAlt, FaCarrot } from "react-icons/fa";
import AddToCart from "./menu.addToCartButton";

const DishModal = ({ dish, onClose, addToCart }:
    { dish: IDish, onClose: () => void, addToCart: (quantity: number) => void }) => {

    const [quantity, setQuantity] = useState(1);

    if (!dish) return null;

    const increaseQuantity = () => setQuantity(prev => prev + 1);
    const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-2xl relative">

            <div className="relative w-full h-56 md:h-64 shrink-0 bg-gray-100">
                <img
                    src={dish.imgUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                />
                <button className="absolute top-3 left-3 md:top-4 md:left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all hover:scale-110 group">
                    <FaHeart className="text-gray-400 group-hover:text-pink-500 text-xl transition-colors" />
                </button>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-red-500 hover:text-white transition-all hover:scale-110 shadow-md"
                >
                    <FaTimes className="text-base md:text-lg" />
                </button>
            </div>

            <div className="p-5 md:p-6 flex flex-col flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {dish.name}
                </h2>
                <p className="text-sm text-gray-500 font-medium mb-3">
                    Dessert • Vietnamese
                </p>

                <div className="flex items-center gap-1 text-sm text-yellow-400 mb-4">
                    <FaStar />
                    <span className="text-gray-800 font-bold ml-1">4.8</span>
                    <span className="text-gray-400 font-medium cursor-pointer hover:text-orange-500 ml-1">
                        (124 reviews)
                    </span>
                </div>

                <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                    {dish.describe}
                </p>
                <hr className="border-gray-100 mb-5" />
                <div className="flex flex-wrap items-center gap-4 md:gap-8 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><FaCarrot /></div>
                        <div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Ingredients</p>
                            <p className="text-sm font-medium text-gray-700">Fresh, Organic</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FaClock /></div>
                        <div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Serving Time</p>
                            <p className="text-sm font-medium text-gray-700">10-15 mins</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 text-green-500 rounded-lg"><FaFireAlt /></div>
                        <div>
                            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">Calories</p>
                            <p className="text-sm font-medium text-gray-700">320 kcal</p>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-100 mb-5" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    <div className="w-full sm:w-auto flex justify-between items-center sm:block">
                        <span className="text-2xl md:text-3xl font-bold text-orange-500">
                            {formatter.format(dish.price * quantity)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1 h-11 shadow-inner">
                            <button onClick={decreaseQuantity} className="w-8 h-full flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-500 hover:text-orange-500 active:scale-95 transition-all">
                                <FaMinus className="text-xs" />
                            </button>
                            <span className="w-10 text-center font-bold text-gray-800 text-lg">
                                {quantity}
                            </span>
                            <button onClick={increaseQuantity} className="w-8 h-full flex justify-center items-center bg-white rounded-lg shadow-sm text-gray-500 hover:text-orange-500 active:scale-95 transition-all">
                                <FaPlus className="text-xs" />
                            </button>
                        </div>

                        <div className="flex-1 sm:flex-none justify-items-end">
                            <AddToCart addToCart={() => addToCart(quantity)} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default DishModal