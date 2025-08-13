'use client'
import { useState } from "react";
import CategoriesSidebar, { Category } from "./Sidebar";
import OrderConfirmationModal from "./OrderConfirmModal";
import CartSidebar from "./CartSidebar";
import MenuGrid from "./MenuGrid";
import Header from "./Header";

// Types
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    emoji: string;
    gradient: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}



// Sample menu data
const menuItems: MenuItem[] = [
    {
        id: '1',
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan and croutons',
        price: 12.99,
        category: 'appetizers',
        emoji: '🥗',
        gradient: 'from-green-400 to-green-600'
    },
    {
        id: '2',
        name: 'Shrimp Cocktail',
        description: 'Fresh shrimp served with cocktail sauce',
        price: 16.99,
        category: 'appetizers',
        emoji: '🍤',
        gradient: 'from-yellow-400 to-orange-500'
    },
     {
        id: '3',
        name: 'Shrimp Cocktail',
        description: 'Fresh shrimp served with cocktail sauce',
        price: 16.99,
        category: 'appetizers',
        emoji: '🍤',
        gradient: 'from-yellow-400 to-orange-500'
    },
    {
        id: '3',
        name: 'Grilled Steak',
        description: 'Premium ribeye steak grilled to perfection',
        price: 28.99,
        category: 'mains',
        emoji: '🥩',
        gradient: 'from-red-400 to-red-600'
    },
    {
        id: '4',
        name: 'Pasta Carbonara',
        description: 'Creamy pasta with bacon and parmesan',
        price: 18.99,
        category: 'mains',
        emoji: '🍝',
        gradient: 'from-yellow-400 to-yellow-600'
    },
    {
        id: '5',
        name: 'Fresh Lemonade',
        description: 'Freshly squeezed lemon juice with mint',
        price: 4.99,
        category: 'drinks',
        emoji: '🥤',
        gradient: 'from-blue-400 to-blue-600'
    },
    {
        id: '6',
        name: 'Chocolate Cake',
        description: 'Rich chocolate cake with cream frosting',
        price: 8.99,
        category: 'desserts',
        emoji: '🍰',
        gradient: 'from-pink-400 to-pink-600'
    }
];

const RestaurantApp = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('appetizers');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
    const [showOrderModal, setShowOrderModal] = useState(false);

    const handleAddToCart = (item: MenuItem) => {
        // Show adding state
        setAddingItems(prev => new Set(prev).add(item.id));

        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            // Update quantity of existing item
            const updatedCart = [...cartItems];
            updatedCart[existingItemIndex].quantity += 1;
            setCartItems(updatedCart);
        } else {
            // Add new item to cart
            const newCartItem: CartItem = {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            };
            setCartItems(prev => [...prev, newCartItem]);
        }

        // Remove adding state after 1 second
        setTimeout(() => {
            setAddingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(item.id);
                return newSet;
            });
        }, 1000);
    };

    const handleUpdateQuantity = (id: string, quantity: number) => {
        const updatedCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity } : item
        );
        setCartItems(updatedCart);
    };

    const handleRemoveItem = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = () => {
        setShowOrderModal(true);
        setCartItems([]);
    };

    const handleCloseModal = () => {
        setShowOrderModal(false);
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header cartItemCount={totalCartItems} />

            <div className="flex h-screen">
                <CategoriesSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                <MenuGrid
                    items={menuItems}
                    activeCategory={activeCategory}
                    onAddToCart={handleAddToCart}
                    addingItems={addingItems}
                />

                <CartSidebar
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onCheckout={handleCheckout}
                />
            </div>

            <OrderConfirmationModal
                isOpen={showOrderModal}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default RestaurantApp