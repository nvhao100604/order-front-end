import { useAddToCart } from "@/hooks";
import { ICartItem, ICategory, IDish } from "@/interfaces";
import { formatter } from "@/utils";
import { dishes_services } from './../../services/dish/dish.services';

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
    )
}

const OrderConfirmationModal = ({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: () => void
}) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md mx-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h3>
                    <p className="text-gray-600 mb-6">Your order has been successfully placed. Thank you!</p>
                    <button
                        onClick={onClose}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

const StaffDishCard = ({ dish }: { dish: IDish }) => {
    const handleAdd = useAddToCart()
    return (
        <div className="w-full flex flex-col justify-between p-2 border-2 border-gray-400 rounded-md">
            <img
                className="w-3/4 aspect-square object-cover overflow-hidden rounded-sm mx-auto"
                src={dish.imgUrl} alt="" />
            <h1 className="font-bold font-nunito text-lg my-2">{dish.name}</h1>
            <div className="flex justify-between w-full">
                <span className="text-orange-600 font-bold text-lg">
                    {formatter.format(dish.price)}
                </span>
                <button
                    onClick={() => handleAdd({
                        ...(dish as ICartItem),
                        quantity: 1,
                        checked: false
                    })}
                    className="rounded-lg bg-orange-500 hover:bg-orange-700 transition-colors duration-300 py-2 px-4 font-bold text-white">
                    Add
                </button>
            </div>
        </div>
    )
}
const StaffMenuList = () => {
    const { data, isLoading, error } = dishes_services.getDishesSWR({ limit: 10, offset: 0 })
    const dishes = data as IDish[]
    if (error) return <div>Error</div>
    if (isLoading) return <div>Loading...</div>
    return (
        <>
            {dishes &&
                (dishes.length == 0) ?
                <div>No dishes</div>
                :
                <div className="grid grid-cols-4 gap-2">
                    {dishes.map(dish => (
                        <StaffDishCard key={`dish-${dish.id}`} dish={dish} />
                    ))}
                </div>
            }
        </>
    )
}

export { CategoriesSidebar, OrderConfirmationModal, StaffMenuList }