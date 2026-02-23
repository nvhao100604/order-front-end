'use client'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (page: number) => {
        onPageChange(page);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="w-full flex justify-center items-center gap-2 md:gap-3 mt-10 mb-6">

            <button
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 md:w-11 md:h-11 flex justify-center items-center rounded-xl bg-white border shadow-sm transition-all duration-300
                    ${currentPage === 1
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 hover:shadow-md active:scale-95'}`}
            >
                <FaChevronLeft className="text-sm" />
            </button>

            <div className="flex items-center gap-1.5 md:gap-2">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`w-10 h-10 md:w-11 md:h-11 flex justify-center items-center rounded-xl font-bold text-sm md:text-base transition-all duration-300 active:scale-95
                            ${currentPage === page
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 md:w-11 md:h-11 flex justify-center items-center rounded-xl bg-white border shadow-sm transition-all duration-300
                    ${currentPage === totalPages
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500 hover:shadow-md active:scale-95'}`}
            >
                <FaChevronRight className="text-sm" />
            </button>

        </div>
    );
};

export default Pagination;