import { ICategory } from "@/interfaces";

const CategoriesSidebar = ({ categories, activeCategory }: { categories: ICategory[], activeCategory: number }) => {

    return (
        <div className="w-64 bg-white shadow-lg border-r">
            <div className="p-6 border-b sticky z-100">
                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
            </div>
            <div className="p-4 space-y-2 overflow-y-auto flex flex-col h-160">
                {categories && categories.map((category) => (
                    <button
                        key={category.id}
                        // onClick={ }
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium 
                            ${activeCategory === category.id
                                ? 'bg-orange-500 text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        {/* <span className="text-xl">{category.emoji}</span> */}
                        <span>{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
export default CategoriesSidebar