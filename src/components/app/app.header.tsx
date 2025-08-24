import Link from "next/link";
import { FaUser } from "react-icons/fa"

const Header = () => {

    return (
        <header className="bg-white shadow-lg sticky top-0 z-1000">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 lg:space-x-6">
                        <img
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                            alt="Restaurant Logo"
                            className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full transition-transform hover:scale-105"
                        />
                        <span className="text-xl md:text-2xl font-bold text-orange-600">
                            <Link href={"/"}>FoodieSpot</Link>
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center space-x-6">
                        <button className="text-2xl text-gray-600 hover:text-orange-600 transition-colors transform hover:scale-110">
                            <FaUser />
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header