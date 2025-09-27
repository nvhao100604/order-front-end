'use client'
import { useState } from "react";

interface MenuItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    time: string;
    tableNumber: string;
    items: MenuItem[];
    subtotal: number;
    tax: number;
    total: number;
}

const RestaurantInvoice = () => {
    const [invoiceData] = useState({
        invoiceNumber: "INV-2024-001",
        date: "2024-01-15",
        time: "14:30",
        tableNumber: "Table 5",
        cashier: "Sarah M.",
        items: [
            { id: "1", name: "Margherita Pizza", quantity: 1, price: 18.50 },
            { id: "2", name: "Caesar Salad", quantity: 2, price: 12.00 },
            { id: "3", name: "Coca Cola", quantity: 2, price: 3.50 },
            { id: "4", name: "Tiramisu", quantity: 1, price: 8.00 }
        ],
        subtotal: 55.50,
        tax: 5.55,
        total: 61.05
    });

    const handlePrint = () => {
        window.print();
    };

    const formatPrice = (price: number) => {
        return `$${price.toFixed(2)}`;
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            {/* Print Button */}
            <button
                onClick={handlePrint}
                className="no-print mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
                🖨️ Print Invoice
            </button>

            {/* Invoice Container */}
            <div className="invoice-container bg-white shadow-lg font-mono text-sm leading-tight">
                {/* Header */}
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3 px-2 pt-3">
                    <h1 className="text-lg font-bold mb-1">BELLA VISTA</h1>
                    <p className="text-xs text-gray-600">Italian Restaurant</p>
                    <p className="text-xs text-gray-600">123 Main Street, City</p>
                    <p className="text-xs text-gray-600">Tel: (555) 123-4567</p>
                </div>

                {/* Invoice Details */}
                <div className="px-2 mb-3 space-y-1">
                    <div className="flex justify-between">
                        <span className="text-xs">Invoice:</span>
                        <span className="text-xs font-semibold">{invoiceData.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs">Date:</span>
                        <span className="text-xs">{invoiceData.date} {invoiceData.time}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs">Table:</span>
                        <span className="text-xs">{invoiceData.tableNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-xs">Cashier:</span>
                        <span className="text-xs">{invoiceData.cashier}</span>
                    </div>
                </div>

                {/* Items Header */}
                <div className="border-t border-b border-dashed border-gray-300 py-2 px-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="flex-1">Item</span>
                        <span className="w-8 text-center">Qty</span>
                        <span className="w-12 text-right">Price</span>
                        <span className="w-12 text-right">Total</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="px-2 py-2">
                    {invoiceData.items.map((item) => (
                        <div key={item.id} className="mb-2">
                            <div className="flex justify-between items-start text-xs">
                                <span className="flex-1 pr-1">{item.name}</span>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <span className="w-12 text-right">{formatPrice(item.price)}</span>
                                <span className="w-12 text-right font-semibold">
                                    {formatPrice(item.quantity * item.price)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-gray-300 pt-2 px-2">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Subtotal:</span>
                            <span>{formatPrice(invoiceData.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>Tax (10%):</span>
                            <span>{formatPrice(invoiceData.tax)}</span>
                        </div>
                        <div className="border-t border-dashed border-gray-300 pt-1 mt-1">
                            <div className="flex justify-between text-sm font-bold">
                                <span>TOTAL:</span>
                                <span>{formatPrice(invoiceData.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="px-2 py-2 border-t border-dashed border-gray-300 mt-2">
                    <div className="flex justify-between text-xs">
                        <span>Payment Method:</span>
                        <span className="font-semibold">Cash</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span>Amount Paid:</span>
                        <span>{formatPrice(70.00)}</span>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                        <span>Change:</span>
                        <span>{formatPrice(8.95)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-2 border-dashed border-gray-300 pt-3 mt-3 px-2 pb-4">
                    <p className="text-xs text-gray-600 mb-2">Thank you for dining with us!</p>
                    <p className="text-xs text-gray-600 mb-1">Visit us again soon</p>
                    <p className="text-xs text-gray-600">www.bellavista.com</p>

                    {/* QR Code Placeholder */}
                    <div className="flex justify-center mt-3">
                        <div className="w-12 h-12 border-2 border-gray-300 flex items-center justify-center text-xs text-gray-500">
                            QR
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Scan for feedback</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="no-print mt-6 text-center text-sm text-gray-600 max-w-md">
                <p className="mb-2">This invoice is designed for K80 thermal paper (80mm width).</p>
                <p>Click the print button to print on your thermal printer.</p>
            </div>
        </div>
    );
};

export default RestaurantInvoice
