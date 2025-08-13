import CartItemComponent from "./CartItem";
import { CartItem } from "./RestaurantApp";

const CartSidebar = ({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: {
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
}) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    return (
        <div className="w-80 bg-white shadow-lg border-l">
            <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6">
                <div className="space-y-4 mb-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            <span className="text-4xl mb-2 block">🛒</span>
                            <p>Your cart is empty</p>
                            <p className="text-sm">Add items from the menu</p>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItemComponent
                                key={item.id}
                                item={item}
                                onUpdateQuantity={onUpdateQuantity}
                                onRemoveItem={onRemoveItem}
                            />
                        ))
                    )}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Tax (8.5%):</span>
                        <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4 text-lg font-bold">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={onCheckout}
                        disabled={cartItems.length === 0}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar