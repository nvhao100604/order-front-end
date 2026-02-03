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
            categoryID: 1,
            name: ""
        }
    )
    const { data, isLoading } = getDishesSWR(query)
    const dishes = data?.data

    useEffect(() => {
        console.log("Active Category changed:", query.typeID)
    }, [query.typeID])

    return (
        <>
            <div className="container flex items-center md:min-h-screen md:p-4 m-auto sm:p-8">
                <div className="flex lg:m-auto overflow-hidden sm:place-items-center lg:place-items-start md:place-items-start w-full">
                    <div className={`bg-white rounded-lg shadow-lg p-4 w-full
                        ${isCartOpen ? "transform transition-all duration-200 ease-linear" : "w-0 opacity-0"}`}>
                        {isCartOpen && <CartSection />}
                    </div>
                    <div className={`px-4 py-8 z-50
                        ${isCartOpen ? "transform transition-all duration-300 ease-out w-[calc(100%_-_400px)] md:inline sm:hidden"
                            :
                            "-ml-100 w-full"}`}>
                        <MenuHeader />
                        <MenuSearch
                            activeCategory={query.categoryID ?? 1}
                            searchQuery={query.name ?? ""}
                            setActiveCategory={(id) => updateQuery({ ...query, categoryID: id })}
                            setSearchQuery={(text) => updateQuery({ ...query, name: text })}
                        />
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