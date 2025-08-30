import { IDish } from "@/interfaces";
import AddToCart from "./menu.addtocart_button";
import { formatter } from "@/utils";

const DishModal = ({ dish, onClose, addToCart }:
    { dish: IDish, onClose: () => void, addToCart: () => void }) => {
    if (!dish) return null;

    return (
        <>
            <button
                onClick={onClose}
                className="absolute z-1 top-2 right-2 text-gray-500 bg-gray-100 rounded-sm w-8 h-8 hover:bg-gray-400 hover:text-white"
            >
                ×
            </button>
            <img
                src={dish.imgUrl}
                alt={dish.name}
                className="w-full h-72 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{dish.name}</h2>
            <p className="text-gray-600 mb-4">{dish.describe}</p>
            <div className="flex items-center justify-between">
                <span className="text-xl font-semibold text-orange-500">{formatter.format(dish.price)}</span>
                <AddToCart addToCart={addToCart} />
            </div>
        </>
    )
}

export default DishModal