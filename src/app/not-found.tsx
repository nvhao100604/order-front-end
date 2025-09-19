import { NOT_FOUND_IMAGE } from "@/config"
import Link from "next/link"
import React, { ReactElement } from "react"
import { FaHome, FaUtensils, FaBookOpen, FaPhoneAlt } from "react-icons/fa"

export const metadata = {
    title: '404 Not Found'
}

const NotFoundPage = () => {
    // const [searchQuery, setSearchQuery] = useState("")

    // const handleSearch = (e: any) => {
    //     e.preventDefault()
    //     // Handle search functionality
    //     console.log("Searching for:", searchQuery)
    // };

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center">
                <div className="mb-8">
                    <img
                        src={NOT_FOUND_IMAGE}
                        alt="Confused chef"
                        className="w-64 h-64 object-cover mx-auto rounded-full shadow-lg"
                    />
                </div>

                <h1 className="text-8xl font-bold text-orange-600 mb-4 animate-bounce">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    Oops! Looks like this dish got eaten!
                </h2>
                <p className="text-gray-600 mb-8">
                    The page you're looking for seems to have been devoured by our hungry server.
                </p>

                {/* <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search our menu..."
                            className="flex-1 px-4 py-2 rounded-l-lg border-2 border-orange-300 focus:outline-none focus:border-orange-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition-colors duration-300"
                            aria-label="Submit search"
                        >
                            <FaSearch />
                        </button>
                    </div>
                </form> */}

                {/* <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <NavButton href="/" icon={<FaHome />} text="Home" />
                    <NavButton href='/menu' icon={<FaUtensils />} text="Menu" />
                    <NavButton href="/reservation" icon={<FaBookOpen />} text="Reservations" />
                    <NavButton href="/contact" icon={<FaPhoneAlt />} text="Contact" />
                </div> */}

                <div className="mt-8 text-sm text-gray-500">
                    <h3 className="font-semibold mb-2">Quick Links</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <QuickLink href={'/'} text="About Us" />
                        <QuickLink href={'/'} text="Special Offers" />
                        <QuickLink href={'/'} text="Gift Cards" />
                        <QuickLink href={'/'} text="Locations" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const NavButton = ({ icon, text, href }: { icon: ReactElement, text: string, href: string }) => (
    <button
        className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-gray-800 hover:text-orange-500"
        aria-label={text}
    >
        <Link href={href}>
            {icon}
            <span>{text}</span>
        </Link>
    </button>
)

const QuickLink = ({ text, href }: { text: string, href: string }) => (
    <button
        className="text-gray-600 hover:text-orange-500 transition-colors duration-300"
        aria-label={text}
    >
        <Link href={href}>{text}</Link>
    </button>
)

export default NotFoundPage
