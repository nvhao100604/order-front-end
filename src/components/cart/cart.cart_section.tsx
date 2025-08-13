import CartDetail from "./cart.cart_detail"
import CartHeader from "./cart.cart_header"
import CartList from "./cart.cart_list"

const CartSection = () => {
    return (
        <>
            <CartHeader />
            <CartList />
            <div className="sm:fixed sm:bottom-0 sm:bg-gray-100 sm:left-0 sm:w-full sm:p-6 sm:z-1000 rounded-sm
            lg:relative lg:z-100 md:relative md:z-100"><CartDetail /></div>
        </>
    )
}

export default CartSection