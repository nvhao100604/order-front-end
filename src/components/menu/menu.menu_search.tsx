'use client'
import { useEffect, useState, useRef } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Skeleton } from "../ui/skeleton";
import { defaultQuery, ICategory } from "@/interfaces";
import { useQuery } from "@/hooks";
import categories_services from './../../services/category/category.services';
import { onMouseDownHandler, onMouseLeaveHandler, onMouseMoveHandler, onMouseUpHandler } from "@/utils";

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

    const all_category: ICategory = { id: -1, name: "All" }
    const categories = [all_category, ...(data?.data ?? [])]

    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft: sLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(sLeft > 0);
            setCanScrollRight(sLeft < scrollWidth - clientWidth - 1);
        }
    };
    const handleScroll = (offset: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: offset,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        setActiveCategory(-1);
        setTimeout(checkScrollButtons, 500);
    }, [isLoading]);

    const dragRefs = { scrollRef, isDragging, startX, scrollLeft };

    return (
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 mt-4 gap-4 md:gap-6 w-full">

            <div className="relative flex-1 w-full group overflow-hidden">
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-2 z-10 flex items-center bg-gradient-to-r from-amber-50 via-amber-50/80 to-transparent pr-8">
                        <button
                            onClick={() => handleScroll(-200)}
                            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 transition-all active:scale-90"
                        >
                            <FaChevronLeft size={14} />
                        </button>
                    </div>
                )}

                <div
                    ref={scrollRef}
                    onMouseDown={(e) => onMouseDownHandler(e, dragRefs)}
                    onMouseLeave={() => onMouseLeaveHandler(dragRefs)}
                    onMouseUp={() => onMouseUpHandler(dragRefs)}
                    onMouseMove={(e) => onMouseMoveHandler(e, dragRefs, checkScrollButtons)}
                    onScroll={checkScrollButtons}
                    className="flex overflow-x-auto pb-2 w-full gap-2 md:gap-3 items-center cursor-grab select-none [&::-webkit-scrollbar]:hidden"
                >
                    {error && <div className="p-2 w-full text-left text-gray-500">No Categories here</div>}

                    {isLoading && (
                        <div className="flex gap-3 w-full">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <Skeleton key={item} className="bg-gray-200 h-10 w-24 md:w-28 rounded-full shrink-0" />
                            ))}
                        </div>
                    )}

                    {!isLoading && !error && categories.map((category: ICategory) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full whitespace-nowrap text-sm md:text-base font-medium transition-all duration-300 active:scale-95 shrink-0
                                ${activeCategory === category.id
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                                    : "bg-white text-gray-600 border border-gray-100 shadow-sm hover:bg-orange-50 hover:text-orange-500 hover:border-orange-200"
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-2 z-10 flex items-center bg-gradient-to-l from-amber-50 via-amber-50/80 to-transparent pl-8">
                        <button
                            onClick={() => handleScroll(200)}
                            className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:text-orange-500 transition-all active:scale-90"
                        >
                            <FaChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            <div className="relative w-full lg:w-72 xl:w-80 shrink-0">
                <input
                    type="text"
                    placeholder="Search dishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 bg-white focus:bg-white text-sm md:text-base
                    focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all shadow-sm"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

        </div>
    )
}

export default MenuSearch;