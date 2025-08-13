export type Category = 'appetizers' | 'mains' | 'drinks' | 'desserts';
const categories = [
    { id: 'appetizers', name: 'Appetizers', emoji: '🥗' },
    { id: 'mains', name: 'Main Dishes', emoji: '🍖' },
    { id: 'drinks', name: 'Beverages', emoji: '🥤' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' }
];
const CategoriesSidebar = ({ activeCategory, onCategoryChange }: {
    activeCategory: Category;
    onCategoryChange: (category: Category) => void;
}) => {
    return (
        <div className="w-64 bg-white shadow-lg border-r">
            <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-800">Categories</h2>
            </div>
            <div className="p-4 space-y-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id as Category)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium ${activeCategory === category.id
                            ? 'bg-orange-500 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                            }`}
                    >
                        <span className="text-xl">{category.emoji}</span>
                        <span>{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
export default CategoriesSidebar