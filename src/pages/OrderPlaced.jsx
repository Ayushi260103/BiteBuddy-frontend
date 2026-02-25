import React from 'react'
import { FaCircleCheck } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';

function OrderPlaced() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Decorative background blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-60" />

      <div className="relative bg-white rounded-3xl shadow-2xl px-8 py-10 max-w-md w-full text-center animate-pop">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 rounded-full p-4">
            <FaCircleCheck className="text-green-500 text-6xl" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Order Placed!
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for your purchase. Your order is being prepared 🍽️
          <br />
          You can track your order status in the
          <span className="font-medium text-gray-800"> “My Orders” </span>
          section.
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-6" />

        {/* CTA */}
        <button
          className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-200 active:scale-[0.98]"
          onClick={() => navigate('/my-orders')}
        >
          Back to My Orders
        </button>
      </div>
    </div>
  )
}

export default OrderPlaced
