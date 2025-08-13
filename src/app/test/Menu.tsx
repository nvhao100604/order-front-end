import { MenuItem } from "./RestaurantApp";

const MenuItemCard = ({ item, onAddToCart, isAdding }: {
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
    isAdding: boolean;
}) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <span className="text-6xl">{item.emoji}</span>
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-500">${item.price.toFixed(2)}</span>
                    <button
                        onClick={() => onAddToCart(item)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isAdding
                            ? 'bg-green-500 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isAdding ? 'Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemCard