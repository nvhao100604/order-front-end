import { FaCreditCard, FaFacebookF, FaInstagram, FaLinkedinIn, FaPaypal, FaTwitter } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8 z-1000">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div className="transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-bold mb-4 text-orange-500">Quick Links</h3>
                        <ul className="space-y-3">
                            {["About Us", "Contact", "Menu", "Delivery Information", "Terms of Service"].map(
                                (link) => (
                                    <li key={link}>
                                        <button className="text-gray-400 hover:text-white hover:translate-x-2 transition-all inline-block">
                                            {link}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-bold mb-4 text-orange-500">Contact Information</h3>
                        <div className="space-y-3 text-gray-400">
                            <p className="hover:text-white transition-colors">123 Food Street, Cuisine City</p>
                            <p className="hover:text-white transition-colors">Phone: (555) 123-4567</p>
                            <p className="hover:text-white transition-colors">Email: info@foodiespot.com</p>
                            <p className="hover:text-white transition-colors">Hours: Mon-Sun 10:00 - 22:00</p>
                        </div>
                    </div>

                    <div className="transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-bold mb-4 text-orange-500">Follow Us</h3>
                        <div className="flex space-x-4">
                            {[
                                { icon: <FaFacebookF />, label: "Facebook" },
                                { icon: <FaTwitter />, label: "Twitter" },
                                { icon: <FaInstagram />, label: "Instagram" },
                                { icon: <FaLinkedinIn />, label: "LinkedIn" },
                            ].map((social) => (
                                <button
                                    key={social.label}
                                    className="bg-gray-700 p-3 rounded-full hover:bg-orange-600 transition-all hover:scale-110 transform"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="transform hover:scale-105 transition-transform">
                        <h3 className="text-xl font-bold mb-4 text-orange-500">Newsletter</h3>
                        <div className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-300 transition-all"
                            />
                            <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all hover:scale-105 transform w-full">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-6 mb-4 md:mb-0">
                            <FaCreditCard className="text-3xl hover:text-orange-500 transition-colors transform hover:scale-110" />
                            <FaPaypal className="text-3xl hover:text-orange-500 transition-colors transform hover:scale-110" />
                        </div>
                        <p className="text-gray-400 text-center hover:text-white transition-colors">
                            © {currentYear} FoodieSpot. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer