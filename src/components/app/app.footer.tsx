import { FaCreditCard, FaFacebookF, FaInstagram, FaLinkedinIn, FaPaypal, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import { ILink } from "./header/header.index";

const links: ILink[] = [
    { name: "Menu", href: "/guest/#menu" },
    { name: "About Us", href: "/guest/#about-us" },
    { name: "Delivery Information", href: "/guest/#delivery-information" },
    { name: "Terms of Service", href: "/guest/#terms-of-service" }
]
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8 relative z-50" id="footer">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    <div>
                        <h3 className="text-xl font-bold mb-6 text-orange-500">Quick Links</h3>
                        <ul className="space-y-4">
                            {Array.isArray(links) && links.map(
                                (link, index) => (
                                    <li key={link.name ?? `link-${index}`}>
                                        <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-block text-left"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-6 text-orange-500">Contact Information</h3>
                        <div className="space-y-4 text-gray-400">
                            <p className="hover:text-white transition-colors cursor-default">123 Food Street, Ho Chi Minh City</p>
                            <p className="hover:text-white transition-colors cursor-default">Phone: (555) 123-4567</p>
                            <p className="hover:text-white transition-colors cursor-default">Email: info@foodiespot.com</p>
                            <p className="hover:text-white transition-colors cursor-default">Hours: Mon-Sun 10:00 - 22:00</p>
                        </div>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                        <h3 className="text-xl font-bold mb-6 text-orange-500">Newsletter</h3>
                        <div className="space-y-4 w-full sm:w-2/3 lg:w-full">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-500 transition-all placeholder-gray-500"
                            />
                            <button className="bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-700 transition-all hover:shadow-lg w-full">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-6">
                            <FaCreditCard className="text-3xl text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
                            <FaPaypal className="text-3xl text-gray-400 hover:text-orange-500 transition-colors cursor-pointer" />
                        </div>
                        <p className="text-gray-400 text-sm md:text-base text-center hover:text-white transition-colors cursor-default">
                            © {currentYear} FoodieSpot. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;