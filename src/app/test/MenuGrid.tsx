import MenuItemCard from "./Menu";
import { MenuItem } from "./RestaurantApp";
import { Category } from "./Sidebar";

const MenuGrid = ({ items, activeCategory, onAddToCart, addingItems }: {
    items: MenuItem[];
    activeCategory: Category;
    onAddToCart: (item: MenuItem) => void;
    addingItems: Set<string>;
}) => {
    const filteredItems = items.filter(item => item.category === activeCategory);

    return (
        <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Menu Items</h2>
                <p className="text-gray-600">Select items to add to your order</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={onAddToCart}
                        isAdding={addingItems.has(item.id)}
                    />
                ))}
            </div>
        </div>
    );
};
export default MenuGrid