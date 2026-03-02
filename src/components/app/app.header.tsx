'use client'
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import { links, Logo, Navigation, NavigationItem, ReservationButton } from "./header/header.index";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen)
    return (
        <header className="sticky top-0 z-[1000] w-full bg-black/30 px-4 md:px-8">
            <div className="flex h-[10dvh] items-center justify-between">
                <div className="flex-shrink-0">
                    <Logo />
                </div>
                <div className="hidden lg:flex flex-1 justify-center">
                    <Navigation />
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex items-center space-x-6">
                        <ReservationButton />
                    </div>

                    <button className="text-2xl text-gray-100 hover:text-orange-600 transition-colors transform hover:scale-110">
                        <Link href={'/login'}><FaUser /></Link>
                    </button>

                    <button
                        className={`block lg:hidden text-white hover:text-orange-500 text-2xl focus:outline-none transition-transform duration-300 active:scale-90 ${isOpen ? "rotate-90" : "rotate-0"}`}
                        onClick={toggleMenu}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>
            <nav className={`absolute left-0 top-full w-full bg-gray-800/30 backdrop-blur-sm lg:hidden transition-all duration-500 ease-in-out overflow-hidden shadow-2xl origin-top
                justify-center items-center flex flex-col
                ${isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <ul className="flex flex-col items-center gap-6 py-6 w-full">
                    {links.map((link, index) =>
                        <div onClick={() => setIsOpen(false)} key={link.name ?? `nav-item-${index}`} className="w-full text-center">
                            <NavigationItem path={link.href} text={link.name} />
                        </div>
                    )}
                </ul>
                <div className="p-4 mb-4">
                    <ReservationButton handleClick={() => setIsOpen(false)} />
                </div>
            </nav>
        </header>
    );
}

export default Header;