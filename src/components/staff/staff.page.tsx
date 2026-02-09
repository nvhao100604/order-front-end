'use client'
import { useState } from "react";
import { ICategory, IDish } from "@/interfaces";
import { CategoriesSidebar, StaffMenuList } from "./staff.components";
import CartList from "../cart/cart.cart_list";
import CartDetail from "../cart/cart.cart_detail";
import CartHeader from "../cart/cart.cart_header";
import categories_services from './../../services/category/category.services';

const StaffPage = () => {
    // const [activeCategory, setActiveCategory] = useState<Category>('appetizers');
    const { data, isLoading, error } = categories_services.getCategoriesSWR(1, 100)
    const [showOrderModal, setShowOrderModal] = useState(false);
    console.log("check data: ", data)
    // const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                <CategoriesSidebar
                    categories={data as ICategory[]}
                    activeCategory={1}
                />
                <div className="h-full w-[calc(100vw_-_39rem)] ">
                    <h1 className="text-3xl p-5 sticky z-100 font-bold border-b rounded-b-md">Restaurant Menu</h1>
                    <div className="overflow-y-auto h-[calc(100%_-_5rem)] p-4">
                        <StaffMenuList />
                    </div>
                </div>
                <div className="justify-items-center-safe bg-white shadow-lg
                h-full w-92 flex flex-col p-4 overflow-y-auto">
                    <h2 className="text-2xl font-bold">Cart list</h2>
                    <CartHeader />
                    <CartList />
                    <CartDetail />
                </div>
            </div>
        </div>
    );
};

export default StaffPage