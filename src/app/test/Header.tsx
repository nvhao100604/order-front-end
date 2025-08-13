const Header = ({ cartItemCount }: { cartItemCount: number }) => {
    return (
        <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-800">Restaurant Menu</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"></path>
                    </svg>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};
export default Header