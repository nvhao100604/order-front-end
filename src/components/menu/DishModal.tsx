import { FaLeaf } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";
import { IDish } from "@/interfaces";

const DishModal = ({ dish, onClose }: { dish: IDish, onClose: () => void }) => {
    if (!dish) return null;
    return (
        <>
            <button
                onClick={onClose}
                className="absolute z-0 top-2 right-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-sm w-8 h-8 hover:bg-gray-400 hover:text-white"
            >
                ×
            </button>
            <img
                src={dish.strMealThumb}
                alt={dish.strMeal}
                className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{dish.strMeal}</h2>
            <p className="text-gray-600 mb-4">{dish.strTags}</p>
            <div className="flex items-center justify-between">
                <span className="text-xl font-semibold">${dish.strCategory}</span>
                {/* <div className="flex gap-2">
                    {dish.dietary.vegetarian && (
                        <FaLeaf className="text-green-500" title="Vegetarian" />
                    )}
                    {dish.dietary.spiceLevel && (
                        <div className="flex">
                            {[...Array(dish.dietary.spiceLevel)].map((_, i) => (
                                <GiChiliPepper
                                    key={i}
                                    className="text-red-500"
                                    title={`Spice Level: ${dish.dietary.spiceLevel}`}
                                />
                            ))}
                        </div>
                    )}
                </div> */}
            </div>
        </>
    )
}

export default DishModal