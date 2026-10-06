'use client'

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { getOrderById } from "@/services/order.services";
import { IOrderResponse } from "@/interfaces";
import { formatter } from "@/utils";

const InvoiceContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [order, setOrder] = useState<IOrderResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!orderId) {
            setErrorMsg("No Order ID provided in URL (e.g. /staff/invoice?orderId=1)");
            setIsLoading(false);
            return;
        }

        const fetchOrder = async () => {
            setIsLoading(true);
            setErrorMsg("");
            try {
                const res = await getOrderById(Number(orderId));
                if (res.success && res.data) {
                    setOrder(res.data);
                } else {
                    setErrorMsg(res.message || "Failed to fetch order details.");
                }
            } catch (err: any) {
                setErrorMsg(err.response?.data?.detail || err.message || "Error loading order.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-mono text-sm text-gray-600">
                Loading thermal invoice data for Order #{orderId}...
            </div>
        );
    }

    if (errorMsg || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-2xl shadow-md text-center max-w-md">
                    <div className="text-red-500 text-3xl mb-2">⚠</div>
                    <h2 className="font-bold text-lg text-gray-800 mb-2">Invoice Error</h2>
                    <p className="text-sm text-gray-600 mb-4">{errorMsg || "Order not found."}</p>
                    <a href="/staff/manage" className="text-xs font-semibold px-4 py-2 bg-amber-600 text-white rounded-lg">
                        ← Back to Order Management
                    </a>
                </div>
            </div>
        );
    }

    const createdAtDate = order.createdAt ? new Date(order.createdAt) : new Date();

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
            {/* Print & Back Controls */}
            <div className="no-print mb-6 flex gap-3">
                <a
                    href="/staff/manage"
                    className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    ← Back to Orders
                </a>
                <button
                    onClick={handlePrint}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow"
                >
                    🖨️ Print K80 Thermal Invoice
                </button>
            </div>

            {/* K80 Thermal Invoice Container */}
            <div className="invoice-container bg-white shadow-lg font-mono text-sm leading-tight p-4 w-80">
                {/* Header */}
                <div className="text-center border-b-2 border-dashed border-gray-300 pb-3 mb-3">
                    <h1 className="text-lg font-bold">FOODIE RESTAURANT</h1>
                    <p className="text-xs text-gray-600">Culinary & Dining Experience</p>
                    <p className="text-xs text-gray-600">123 Restaurant Street, City</p>
                    <p className="text-xs text-gray-600">Tel: (028) 3999-8888</p>
                </div>

                {/* Invoice Meta */}
                <div className="mb-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Invoice No:</span>
                        <span className="font-bold">INV-#{order.id}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Date & Time:</span>
                        <span>{createdAtDate.toLocaleDateString('vi-VN')} {createdAtDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Table:</span>
                        <span className="font-semibold">{order.tableID ? `Table B${order.tableID}` : 'Online Order'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-semibold text-green-700">{order.status}</span>
                    </div>
                </div>

                {/* Items Table Header */}
                <div className="border-t border-b border-dashed border-gray-300 py-2 my-2">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="flex-1">Item</span>
                        <span className="w-8 text-center">Qty</span>
                        <span className="w-16 text-right">Price</span>
                    </div>
                </div>

                {/* Items List */}
                <div className="py-1 space-y-2">
                    {order.details && order.details.length > 0 ? (
                        order.details.map((detail: any, i: number) => (
                            <div key={detail.id || i} className="text-xs">
                                <div className="flex justify-between items-start font-medium">
                                    <span className="flex-1 pr-1">{detail.dish?.name || detail.name || `Item #${detail.dishID}`}</span>
                                    <span className="w-8 text-center">x{detail.quantity}</span>
                                    <span className="w-16 text-right">{formatter.currency(detail.price * detail.quantity)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-center text-gray-500 py-2">No item details available</p>
                    )}
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-gray-300 pt-2 mt-3 space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatter.currency(order.subtotal || order.totalPrice)}</span>
                    </div>
                    {order.tax ? (
                        <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>{formatter.currency(order.tax)}</span>
                        </div>
                    ) : null}
                    <div className="border-t border-dashed border-gray-300 pt-1 mt-1 flex justify-between font-bold text-sm">
                        <span>TOTAL:</span>
                        <span>{formatter.currency(order.totalPrice)}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-2 border-dashed border-gray-300 pt-3 mt-4 text-xs text-gray-600">
                    <p className="font-semibold mb-1">Thank you for dining with us!</p>
                    <p>Please keep this receipt for your records.</p>
                </div>
            </div>

            {/* Thermal Print Note */}
            <div className="no-print mt-6 text-center text-xs text-gray-500 max-w-sm">
                Optimized for standard K80 thermal receipt printers.
            </div>
        </div>
    );
};

const RestaurantInvoicePage = () => {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-gray-100 font-mono text-sm text-gray-600">Loading invoice page...</div>}>
            <InvoiceContent />
        </Suspense>
    );
};

export default RestaurantInvoicePage;
