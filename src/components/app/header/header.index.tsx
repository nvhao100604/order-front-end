'use client'
import { LOGO_URL } from "@/config"
import Link from "next/link"
import { useState } from "react"
import { FaBars, FaTimes, FaUser } from "react-icons/fa"

export interface ILink {
    name: string;
    href: string;
}

export const links: ILink[] = [
    { name: "Home", href: "/guest" },
    { name: "Menu", href: "/guest/menu" },
    { name: "About Us", href: "/guest/#about-us" },
    { name: "Contact", href: "#footer" },
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
                {links.map((link, index) =>
                    <NavigationItem key={link.name ?? `nav-item-${index}`} path={link.href} text={link.name} />
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
            className="text-white font-medium text-lg px-3 py-2 bg-orange-600 rounded-md 
                    shadow-neutral-800 shadow-lg transition-transform transform-all duration-300 ease-in-out 
                    hover:bg-orange-700 hover:scale-110"
        ><Link href={"/guest/reservation"}>
                Make a Reservation</Link>
        </button>
    )
}
const HeaderUser = () => {
    return (
        <>
            <div className="hidden lg:flex space-x-6 justify-between w-full">
                <ReservationButton />
                <button className="text-2xl text-gray-100 hover:text-orange-600 transition-colors transform hover:scale-110">
                    <Link href={'/login'}><FaUser /></Link>
                </button>
            </div>
        </>
    )
}

export { Logo, NavigationItem, Navigation, HeaderUser, ReservationButton }
