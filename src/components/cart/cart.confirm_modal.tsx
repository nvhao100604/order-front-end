import { ICartItem, IDish } from "@/interfaces"

const ConfirmModal = ({ dish, setShowConfirmModal, removeFromCart }:
    { dish: ICartItem, setShowConfirmModal: () => void, removeFromCart: () => void }) => {
    return (
        <div className="flex-1 items-center bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Remove Item</h3>
            <div className="place-items-center">
                <img
                    src={dish.imgUrl}
                    alt={dish.name}
                    className="w-36 h-24 object-cover rounded-lg mb-4"
                />
            </div>
            <p className="mb-6">Are you sure you want to remove {dish.name} from your cart?</p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={setShowConfirmModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={removeFromCart}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    Remove
                </button>
            </div>
        </div>
    )
}

export default ConfirmModal