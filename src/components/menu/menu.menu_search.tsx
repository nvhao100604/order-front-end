'use client'
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";
import { defaultQuery, ICategory } from "@/interfaces";
import { useQuery } from "@/hooks";
import categories_services from './../../services/category/category.services';

const MenuSearch = ({ activeCategory, setActiveCategory, searchQuery, setSearchQuery }
    :
    {
        activeCategory: number,
        setActiveCategory: (id: number) => void,
        searchQuery: string,
        setSearchQuery: (query: string) => void
    }
) => {
    const [query, updateQuery, resetQuery] = useQuery(defaultQuery)
    const { data, error, isLoading } = categories_services.getCategoriesSWR(query.page ?? 1, query.limit ?? 8)
    const all_category: ICategory = {
        id: -1,
        name: "All"
    }
    const categories = [all_category, ...(data?.data ?? [])]

    useEffect(() => {
        setActiveCategory(-1)
    }, [])

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 mt-4 gap-4">
                <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                    {error &&
                        <div
                            className="gap-4 p-2 h-12 w-[calc(100vw_-_32rem)] flex justify-center place-content-center-safe "
                        >No Categories here
                        </div>
                    }
                    {isLoading &&
                        <div
                            className="gap-4 p-2 h-12 w-[calc(100vw_-_32rem)] flex justify-between place-content-center-safe "
                        >
                            <Skeleton className="bg-gray-300 p-2 w-full h-full rounded-full" />
                            <Skeleton className="bg-gray-300 p-2 w-full h-full rounded-full" />
                            <Skeleton className="bg-gray-300 p-2 w-full h-full rounded-full" />
                            <Skeleton className="bg-gray-300 p-2 w-full h-full rounded-full" />
                            <Skeleton className="bg-gray-300 p-2 w-full h-full rounded-full" />
                        </div>
                    }

                    {categories && categories.map((category: ICategory) => (
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