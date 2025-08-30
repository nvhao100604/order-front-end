const OrderConfirmationModal = ({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    if (!isOpen) return null;

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
    );
};

export default OrderConfirmationModal