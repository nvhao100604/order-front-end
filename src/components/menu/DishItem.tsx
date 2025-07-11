import { IDish } from "@/interfaces";
import { FaHeart, FaLeaf } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";

const DishItem = ({ dish, onClick }: { dish: IDish, onClick: (dish: IDish) => void }) => {
    return (
        <div
        >
            <div className="relative">
                <div className="absolute top-2 right-2 z-5">
                    <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                        <FaHeart className="text-gray-400 hover:text-red-500" />
                    </button>
                </div>
            </div>
            <div onClick={() => onClick(dish)}>
                <div className="relative h-48">
                    <img
                        src={dish.strMealThumb}
                        alt={dish.strMeal}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{dish.strMeal}</h3>
                        <span className="text-orange-500 font-semibold">
                            ${dish.strTags}
                        </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{dish.strArea}</p>
                    {/* <div className="flex items-center gap-2">
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
            </div>
        </div>
    )
}

export default DishItem