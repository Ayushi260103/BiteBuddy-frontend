import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import CartItemCard from '../components/CartItemCard'

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 py-8">
            <div className="w-full max-w-3xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:shadow-md transition"
                    >
                        <IoIosArrowRoundBack size={28} className="text-[#ff4d2d]" />
                    </button>

                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                        Your Cart
                    </h1>
                </div>

                {/* Empty Cart */}
                {cartItems?.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-10 text-center">
                        <p className="text-gray-500 text-lg mb-4">
                            Your cart is empty 🍽️
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-2 px-6 py-3 bg-[#ff4d2d] text-white rounded-lg font-medium hover:bg-[#e64526] transition"
                        >
                            Browse Restaurants
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="space-y-5">
                            {cartItems.map((item, idx) => (
                                <CartItemCard key={idx} data={item} />
                            ))}
                        </div>

                        {/* Bill Summary */}
                        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Total Amount
                                </h2>
                                <span className="text-2xl font-extrabold text-[#ff4d2d]">
                                    ₹{totalAmount}
                                </span>
                            </div>

                            <button
                                className="w-full mt-4 bg-[#ff4d2d] text-white py-3 rounded-xl text-lg font-semibold hover:bg-[#e64526] transition"
                                onClick={() => navigate("/checkout")}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default CartPage
