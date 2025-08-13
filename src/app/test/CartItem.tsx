import { CartItem } from "./RestaurantApp";

const CartItemComponent = ({ item, onUpdateQuantity, onRemoveItem }: {
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
}) => {
    const handleDecrease = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, item.quantity - 1);
        } else {
            onRemoveItem(item.id);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex-1">
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={handleDecrease}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold"
                >
                    -
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                    onClick={handleIncrease}
                    className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                >
                    +
                </button>
            </div>
        </div>
    );
};
export default CartItemComponent