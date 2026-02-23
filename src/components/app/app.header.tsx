'use client'
import { FaBars, FaTimes } from "react-icons/fa";
import { HeaderUser, links, Logo, Navigation, NavigationItem, ReservationButton } from "./header/header.index";
import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen)
    return (
        <header className="sticky top-0 z-[1000] w-full bg-black/30 px-4 md:px-8">
            <div className="flex h-16 items-center justify-between">
                <div className="flex-shrink-0">
                    <Logo />
                </div>
                <div className="hidden lg:flex flex-1 justify-center">
                    <Navigation />
                </div>
                <div className="flex items-center gap-4">
                    <HeaderUser />

                    {/* Đưa hiệu ứng xoay ra ngoài button để nó xoay mượt cả khi mở lẫn khi đóng */}
                    <button
                        className={`block lg:hidden text-white hover:text-orange-500 text-2xl focus:outline-none transition-transform duration-300 active:scale-90 ${isOpen ? "rotate-90" : "rotate-0"}`}
                        onClick={toggleMenu}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* 1. Giữ nguyên bg-gray-800/30 backdrop-blur-sm "chân ái" của bạn.
                2. Gỡ bỏ cái "border-t border-gray-800" gây lằn đen.
            */}
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
                    <ReservationButton />
                </div>
            </nav>
        </header>
    );
}

export default Header;