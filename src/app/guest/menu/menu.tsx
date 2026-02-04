'use client'
import { CartSection, CartToggle, MenuHeader, MenuList, MenuSearch } from "@/components"
import useQuery from "@/hooks/useQuery"
import { IDish } from "@/interfaces"
import { defaultQuery } from "@/interfaces/query/query.interface"
import { useAppSelector } from "@/redux/hooks"
import { getDishesSWR } from "@/services/dish/dish.services.ts"
import { useEffect, useState } from "react"

const Menu = () => {
    const { isOpen: isCartOpen } = useAppSelector(state => state.cart)
    const [query, updateQuery, resetQuery] = useQuery(
        {
            ...defaultQuery,
            page: 1,
            limit: 9,
            categoryID: -1,
            name: ""
        }
    )
    const { data, isLoading } = getDishesSWR(query)
    const dishes = data?.data

    useEffect(() => {
        console.log("Active Category changed:", query.categoryID)
    }, [query.categoryID])

    return (
        <>
            <div className="container mx-auto md:min-h-screen md:p-4 m-auto sm:p-8 items-start">
                <div className="flex lg:m-auto overflow-hidden sm:place-items-center lg:place-items-start md:place-items-start w-full">
                    <div className={`bg-white rounded-xl shadow-lg border border-gray-100
                        transition-all duration-300 ease-in-out
                        overflow-hidden
                        fixed inset-0 z-50
                        lg:z-auto lg:h-auto lg:sticky lg:top-4
                        ${isCartOpen ?
                            "translate-x-0 opacity-100 lg:w-96 lg:translate-x-0"
                            :
                            "translate-x-full opacity-0 lg:w-0 lg:translate-x-0 lg:p-0 pointer-events-none"}
                        `}>
                        {isCartOpen && (
                            <div className="h-full lg:h-auto overflow-y-auto max-h-screen lg:max-h-[calc(100vh-2rem)] custom-scrollbar w-full">
                                <div className="w-full lg:w-96 p-4">
                                    <CartSection />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={"flex-1 w-full min-w-0 transition-all duration-300"}>
                        <div className="space-y-6 mb-8">
                            <MenuHeader />
                            <MenuSearch
                                activeCategory={query.categoryID ?? 1}
                                searchQuery={query.name ?? ""}
                                setActiveCategory={(id) => updateQuery({ ...query, categoryID: id })}
                                setSearchQuery={(text) => updateQuery({ ...query, name: text })}
                            />
                        </div>

                        <MenuList
                            dishes={(dishes as IDish[])}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
                <CartToggle />
            </div>
        </>
    )
}

export default Menu