'use client'
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { links, Logo, Navigation, NavigationItem, ReservationButton, UserMenu } from "./header/header.index";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-[1000] w-full bg-gray-900/90 px-4 md:px-8 border-b border-white/10">
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

                    <UserMenu />

                    <button
                        className={`block lg:hidden text-white hover:text-orange-500 text-2xl transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                        onClick={toggleMenu}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            <nav
                className={`   absolute left-0 top-full w-full lg:hidden
                    bg-black/80 backdrop-blur-md
                    transition-all duration-300 ease-out
                    overflow-hidden shadow-2xl origin-top
                    ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}
                `}
            >
                <div className="px-4 py-6 flex flex-col gap-6">
                    <ul className="flex flex-col gap-6">
                        {links.map((link, index) => (
                            <NavigationItem
                                key={link.name ?? `nav-item-${index}`}
                                onClick={() => setIsOpen(false)}
                                path={link.href}
                                text={link.name}
                            />
                        ))}
                    </ul>

                    <div className="h-px bg-white/10" />
                    <div onClick={() => setIsOpen(false)}>
                        <ReservationButton />
                    </div>

                </div>
            </nav>
        </header>
    );
}

export default Header;