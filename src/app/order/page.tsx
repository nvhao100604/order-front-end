import React, { useState } from "react";
import { FiPackage, FiTruck, FiCheck, FiClock, FiPhone, FiMapPin, FiUser } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const OrderTracking = () => {
    const [activeStep, setActiveStep] = useState(2);
    const [expandedSection, setExpandedSection] = useState("");

    const orderSteps = [
        { title: "Order Placed", icon: FiClock, time: "10:30 AM", date: "Oct 15, 2023" },
        { title: "Preparing", icon: MdStorefront, time: "10:45 AM", date: "Oct 15, 2023" },
        { title: "Out for Delivery", icon: FiTruck, time: "11:30 AM", date: "Oct 15, 2023" },
        { title: "Delivered", icon: FiCheck, time: "12:15 PM", date: "Oct 15, 2023" }
    ];

    const orderDetails = {
        orderId: "#ORD123456789",
        restaurant: "Gourmet Delights",
        items: [
            { name: "Margherita Pizza", quantity: 1, price: 12.99 },
            { name: "Chicken Wings", quantity: 2, price: 15.98 },
            { name: "Coke", quantity: 2, price: 4.00 }
        ],
        total: 32.97,
        deliveryFee: 3.99
    };

    const deliveryDetails = {
        address: "123 Main Street, Apt 4B, New York, NY 10001",
        partner: {
            name: "John Smith",
            phone: "+1 (555) 123-4567",
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100"
        }
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? "" : section);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Order Status Timeline */}
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
                        <div className="relative">
                            <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-1 bg-gray-200 rounded">
                                <div
                                    className="h-full bg-blue-500 rounded transition-all duration-500 ease-in-out"
                                    style={{ width: `${(activeStep / (orderSteps.length - 1)) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between relative">
                                {orderSteps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${index <= activeStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            <step.icon className="w-5 h-5" />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-gray-900">{step.title}</p>
                                        <p className="text-xs text-gray-500">{step.time}</p>
                                        <p className="text-xs text-gray-500">{step.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-gray-200">
                        <button
                            onClick={() => toggleSection("orderDetails")}
                            className="w-full p-6 text-left focus:outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiPackage className="w-6 h-6 text-gray-500" />
                                    <span className="ml-3 text-lg font-medium text-gray-900">Order Details</span>
                                </div>
                                <span className="text-blue-500">{orderDetails.orderId}</span>
                            </div>
                        </button>
                        {expandedSection === "orderDetails" && (
                            <div className="px-6 pb-6">
                                <div className="space-y-4">
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>{item.quantity}x {item.name}</span>
                                            <span>${item.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span>Delivery Fee</span>
                                            <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold mt-2">
                                            <span>Total</span>
                                            <span>${(orderDetails.total + orderDetails.deliveryFee).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Delivery Information */}
                    <div className="border-t border-gray-200">
                        <button
                            onClick={() => toggleSection("deliveryInfo")}
                            className="w-full p-6 text-left focus:outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FiMapPin className="w-6 h-6 text-gray-500" />
                                    <span className="ml-3 text-lg font-medium text-gray-900">Delivery Information</span>
                                </div>
                            </div>
                        </button>
                        {expandedSection === "deliveryInfo" && (
                            <div className="px-6 pb-6">
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <FiMapPin className="w-5 h-5 text-gray-500 mt-1" />
                                        <p className="ml-3 text-sm text-gray-600">{deliveryDetails.address}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            src={deliveryDetails.partner.image}
                                            alt="Delivery Partner"
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">{deliveryDetails.partner.name}</p>
                                            <p className="text-sm text-gray-500">{deliveryDetails.partner.phone}</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                                        <FiPhone className="inline-block mr-2" />
                                        Contact Delivery Partner
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Support Section */}
                    <div className="border-t border-gray-200 p-6">
                        <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center">
                            <FiUser className="mr-2" />
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderTracking;