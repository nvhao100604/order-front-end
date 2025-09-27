import { LOGO_URL } from "@/config"
import Link from "next/link"
import { FaUser } from "react-icons/fa"

const Logo = () => {
    return (
        <>
            <div className="flex items-center space-x-4 lg:space-x-6 justify-between" >
                <img
                    src={LOGO_URL}
                    alt="Restaurant Logo"
                    className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full transition-transform hover:scale-105"
                />
                <span className="text-2xl md:text-2xl font-nunito font-bold text-orange-600" >
                    <Link href={"/guest"}> Foodie Restaurant </Link>
                </span>
            </div>
        </>
    )
}

const NavigationItem = ({ text, path }: { text: string, path: string }) => {
    return (
        <li
            className="py-2 px-3 rounded-sm text-white uppercase text-md font-medium"
        >
            <Link href={path}> {text} </Link>
        </li>
    )
}

const Navigation = () => {
    return (
        <nav className="container flex m-auto place-items-center justify-center">
            <ul className="flex gap-2">
                <NavigationItem path="/guest" text="Home" />
                <NavigationItem path="/guest/menu" text="Menu" />
                <NavigationItem path="/guest/#about-us" text="About" />
                <NavigationItem path="/guest/contact" text="Contact" />
            </ul>
        </nav>
    )
}

const HeaderUser = () => {
    return (
        <>
            <div className="hidden lg:flex space-x-6 justify-between w-full">
                <button
                    className="text-white font-medium text-lg px-3 py-2 bg-orange-600 rounded-md 
                    shadow-neutral-800 shadow-lg transition-transform transform-all duration-300 ease-in-out 
                    hover:bg-orange-700 hover:scale-110"
                ><Link href={"/guest/reservation"}>
                        Make a Reservation</Link>
                </button>

                <button className="text-2xl text-gray-100 hover:text-orange-600 transition-colors transform hover:scale-110">
                    <Link href={'/login'}><FaUser /></Link>
                </button>
            </div>
        </>
    )
}

export { Logo, Navigation, HeaderUser }
