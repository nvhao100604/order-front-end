'use client'
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useSWR from "swr";
import { Modal } from "@/components/app";
import { DishItem, DishModal } from "@/components/menu";
import { Category, Dish, IDish } from "@/interfaces";
import Link from "next/link";

const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "appetizers", name: "Appetizers" },
    { id: "main", name: "Main Courses" },
    { id: "desserts", name: "Desserts" },
    { id: "beverages", name: "Beverages" },
    { id: "vegetarian", name: "Vegetarian" }
]

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [selectedDish, setSelectedDish] = useState<IDish | null>(null)

    const fetcher = (url: string) => fetch(url).then((res) => res.json())
    const { data, error, isLoading } = useSWR(
        "https://www.themealdb.com/api/json/v1/1/search.php?f=a",
        fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    )

    const diss: IDish[] = (data?.meals as IDish[])
    console.log(diss)

    // const filteredDishes = dishes.filter(dish => {
    //     const matchesCategory = activeCategory === "all" || dish.category === activeCategory
    //     const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    //     return matchesCategory && matchesSearch
    // })

    const handleClick = (dish: IDish) => {
        setSelectedDish(dish);
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
        setSelectedDish(null);
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8 text-center">
                    Our Menu
                </h1>
                <button><Link href={"/"}>return</Link></button>
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

                {!diss ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No dishes found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {diss.map(dish => (
                            <div
                                key={dish.idMeal}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <DishItem dish={dish} onClick={handleClick} />
                            </div>
                        ))}
                    </div>
                )}

                {showModal && (
                    <Modal handleClick={handleClose}>
                        <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative">
                            <DishModal
                                dish={selectedDish as IDish}
                                onClose={handleClose}
                            />
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default Menu