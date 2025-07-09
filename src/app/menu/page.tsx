'use client'

import { Modal } from "@/components/app";
import { DishItem, DishModal } from "@/components/menu";
import { Category, Dish } from "@/interfaces";
import { useState } from "react";
import { FaSearch, FaHeart, FaLeaf } from "react-icons/fa";
import { GiChiliPepper } from "react-icons/gi";

const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
    { id: "vegetarian", name: "Vegetarian" }
]

const dishes: Dish[] = [
    {
        id: 1,
        name: "Truffle Risotto",
        category: "main",
        price: 24.99,
        description: "Creamy Italian risotto with black truffle and parmesan",
        image: "https://www.acouplecooks.com/parmesan-black-truffle-risotto/",
        dietary: { vegetarian: true, spiceLevel: 1 }
    },
    {
        id: 2,
        name: "Spicy Tuna Roll",
        category: "appetizers",
        price: 16.99,
        description: "Fresh tuna roll with spicy mayo and cucumber",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
        dietary: { spiceLevel: 3 }
    },
    {
        id: 3,
        name: "Chocolate Lava Cake",
        category: "desserts",
        price: 12.99,
        description: "Warm chocolate cake with molten center",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c",
        dietary: { vegetarian: true }
    }
]

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null)

    const filteredDishes = dishes.filter(dish => {
        const matchesCategory = activeCategory === "all" || dish.category === activeCategory
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleClick = (dish: Dish) => {
        setSelectedDish(dish);
        setShowModal(true);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8 text-center">
                    Our Menu
                </h1>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-4 py-2 rounded-full mr-2 whitespace-nowrap ${activeCategory === category.id
                                    ? "bg-orange-500 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {filteredDishes.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No dishes found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDishes.map(dish => (
                            <DishItem key={dish.id} dish={dish} onClick={handleClick} />
                        ))}
                    </div>
                )}

                {showModal && (
                    <DishModal
                        dish={selectedDish as Dish}
                        onClose={() => {
                            setShowModal(false);
                            setSelectedDish(null);
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default Menu