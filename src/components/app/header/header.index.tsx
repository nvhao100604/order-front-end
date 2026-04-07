'use client'
import { LOGO_URL } from "@/config/constants/public"
import { ROUTES } from "@/config/constants/route"
import { useEnhancedAuth } from "@/hooks/redux_custom_hooks/authSlice.hooks"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FaBars, FaCog, FaSignInAlt, FaSignOutAlt, FaTimes, FaUser, FaUserCircle } from "react-icons/fa"

export interface ILink {
    name: string;
    href: string;
}

export const links: ILink[] = [
    { name: "Home", href: ROUTES.GUEST.HOME },
    { name: "Menu", href: ROUTES.GUEST.MENU },
    { name: "About Us", href: ROUTES.GUEST.ABOUT },
    { name: "Contact", href: ROUTES.CONTACT },
]

const Logo = () => {
    return (
        <>
            <div className="flex items-center space-x-4 lg:space-x-6 justify-start" >
                <img
                    src={LOGO_URL}
                    alt="Restaurant Logo"
                    className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full transition-transform hover:scale-105"
                />
                <span className="text-2xl md:text-2xl font-nunito font-bold text-orange-600 text-shadow-2xs" >
                    <Link href={"/guest"}> Foodie Restaurant </Link>
                </span>
            </div>
        </>
    )
}

const NavigationItem = ({ text, path, onClick }: { text: string, path: string, onClick?: () => void }) => {
    return (
        <li
            className="list-none w-full"
            onClick={onClick}
        >
            <Link
                className="flex w-full text-white uppercase text-base lg:font-normal font-semibold tracking-wide
                        transition-colors duration-300
                        py-1 lg:py-2 px-3 rounded-sm
                        hover:bg-gray-200/20 ripple
                        lg:hover:text-white 
                        lg:hover:bg-transparent"
                href={path}> {text} </Link>
        </li>
    )
}

const Navigation = () => {
    return (
        <nav className="container flex m-auto place-items-center justify-center">
            <ul className="flex gap-2 w-[50%]">
                {links.map((link, index) =>
                    <NavigationItem
                        key={link.name ?? `nav-item-${index}`}
                        path={link.href}
                        text={link.name} />
                )}
            </ul>
        </nav>
    )
}

const ReservationButton = ({
    handleClick
}: {
    handleClick?: () => void
}
) => {
    return (
        <button
            onClick={handleClick}
            className="w-full text-white font-medium text-lg px-3 py-2 bg-orange-600 rounded-md 
                    shadow-neutral-800 shadow-lg transition-transform transform-all duration-300 ease-in-out 
                    hover:bg-orange-700 hover:scale-110"
        ><Link href={ROUTES.GUEST.RESERVATION}>
                Make a Reservation</Link>
        </button>
    )
}

const UserMenu = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated, logout } = useEnhancedAuth();

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-2xl text-gray-100 hover:text-orange-500 transition-all transform hover:scale-110 p-2 rounded-full hover:bg-white/10"
            >
                <FaUser />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-gray-900/95 border border-white/10 p-2 shadow-2xl backdrop-blur-lg animate-in fade-in zoom-in duration-200">
                    <div className="py-1">
                        {/* 1. Trung tâm tài khoản */}
                        {isAuthenticated &&
                            <Link
                                href="/account"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FaUserCircle className="text-lg" />
                                <span>Account Center</span>
                            </Link>}

                        {/* 2. Cài đặt hệ thống */}
                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-200 hover:bg-orange-500 hover:text-white rounded-lg transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <FaCog className="text-lg" />
                            <span>Settings</span>
                        </Link>

                        <div className="my-1 border-t border-white/10"></div>

                        {/* 3. Đăng nhập / Đăng xuất */}
                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    logout();
                                    setIsDropdownOpen(false);
                                }}
                                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors font-medium"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span>Log out</span>
                            </button>
                        ) : (
                            <Link
                                href={ROUTES.AUTH.LOGIN}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-green-400 hover:bg-green-500/20 rounded-lg transition-colors font-medium"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <FaSignInAlt className="text-lg" />
                                <span>Log in</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export { Logo, NavigationItem, Navigation, ReservationButton, UserMenu }
