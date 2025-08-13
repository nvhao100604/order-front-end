'use client'
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Category } from "@/interfaces";
import { useFetchGet } from "@/hooks";

const MenuSearch = () => {
    const [activeCategory, setActiveCategory] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const { data: categories, error: categoryError } = useFetchGet("Category")
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-4 gap-4">
                <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {categories && categories.map((category: Category) => (
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

                <div className="relative lg:w-128 md:w-96 sm:w-48">
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
        </>
    )
}

export default MenuSearch