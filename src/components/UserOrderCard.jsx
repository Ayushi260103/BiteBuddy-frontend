import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../App';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function UserOrderCard({ data }) {
    const { userData } = useSelector(state => state.user);
    const userId = userData._id;
    const navigate = useNavigate();
    const [selectedRating, setSelectedRating] = useState({})  //{itemId: rating}
    const statusSteps = ["placed", "preparing", "out for delivery", "delivered"];


    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    const handleRating = async (itemId, rating) => {
        try {
            console.log("Sending rating:", itemId, rating);
            const result = await axios.post(`${serverUrl}/api/item/rating`, { itemId, rating }, { withCredentials: true });
            setSelectedRating(prev => ({
                ...prev,
                [itemId]: rating
            }))
        }
        catch (error) {
            console.log(error.response?.data);
        }
    }
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 space-y-5">

            {/* Header */}
            <div className="flex justify-between items-start border-b pb-3">
                <div>
                    <p className="font-bold text-gray-800">
                        Order #{data._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                        {formatDate(data.createdAt)}
                    </p>
                </div>

                <div className="text-right">
                    {data.paymentMethod === "cod" ? (
                        <p className="text-xs text-gray-500 uppercase">
                            COD
                        </p>
                    ) : (
                        <p className="text-xs font-semibold text-gray-600">
                            {data.payment ? "Payment Done" : "Payment Pending"}
                        </p>
                    )}

                    <p
                        className={`mt-1 font-semibold capitalize ${data?.shopOrders?.[0].status === "delivered"
                            ? "text-green-600"
                            : "text-blue-600"
                            }`}
                    >
                        {data.shopOrders?.[0].status=="pending"?"Placed":data.shopOrders?.[0].status}
                    </p>
                </div>
            </div>

            {/* Shop Orders */}
            {data.shopOrders.map((shopOrder, idx) => (
                <div
                    key={idx}
                    className="bg-[#fffaf7] border rounded-xl p-4 space-y-4"
                >
                    <p className="font-semibold text-lg text-gray-800">
                        {shopOrder.shop?.name}
                    </p>

                    {/* Progress bar */}
                    {/* Order Progress */}
                    <div className="flex items-center justify-between mt-3 mb-4">
                        {["Placed", "Preparing", "Out for Delivery", "Delivered"].map((label, stepIndex) => {
                            const statusrightnow= shopOrder.status=="pending"?"placed":shopOrder.status;
                            const currentStep = statusSteps.indexOf(statusrightnow);

                            return (
                                <div key={label} className="flex-1 flex flex-col items-center relative">

                                    {/* Connecting Line */}
                                    {stepIndex !== 0 && (
                                        <div
                                            className={`absolute left-[-50%] top-[12px] w-full h-[2px] ${currentStep >= stepIndex
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                                }`}
                                        />
                                    )}

                                    {/* Circle */}
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10 ${currentStep >= stepIndex
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-300 text-gray-500"
                                            }`}
                                    >
                                        ✓
                                    </div>

                                    {/* Label */}
                                    <span className="text-xs mt-1 text-gray-600">
                                        {label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Items */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {shopOrder.shopOrderItems.map((item, i) => (
                            <div
                                key={i}
                                className="w-40 shrink-0 bg-white rounded-xl shadow-sm border p-2"
                            >
                                <img
                                    src={item.item?.image}
                                    alt={item.item?.name || item.name}
                                    className="w-full h-24 object-cover rounded-lg"
                                />

                                <p className="text-sm font-semibold mt-2 text-gray-800 leading-tight">
                                    {item.item?.name || item.name}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                    Qty {item.quantity} × ₹{item.price}
                                </p>

                                {/* Rating */}
                                {shopOrder.status === "delivered" && (
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const itemId = item.item?._id;
                                            const dbRatingObj = item.item?.userRatings?.find(
                                                (r) => r.userId === userId
                                            );
                                            const dbRating = dbRatingObj?.value || 0;
                                            const currentRating =
                                                selectedRating[itemId] ?? dbRating;
                                            const isRated = currentRating > 0;

                                            return (
                                                <button
                                                    key={star}
                                                    disabled={isRated}
                                                    className={`text-lg transition ${currentRating >= star
                                                        ? "text-yellow-400"
                                                        : "text-gray-300"
                                                        } ${isRated
                                                            ? "cursor-not-allowed opacity-80"
                                                            : "hover:scale-110"
                                                        }`}
                                                    onClick={() => handleRating(itemId, star)}
                                                >
                                                    ★
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                        <p className="font-semibold text-gray-700">
                            Subtotal: ₹{shopOrder.subtotal}
                        </p>
                        <span
                            className={`text-sm font-medium ${shopOrder.status === "delivered"
                                ? "text-green-600"
                                : "text-blue-600"
                                }`}
                        >
                            {shopOrder.status}
                        </span>
                    </div>
                </div>
            ))}

            {/* Footer */}
            <div className="flex justify-between items-center border-t pt-4">
                <p className="text-lg font-bold text-gray-800">
                    Total: ₹{data.totalAmount}
                </p>

                <button
                    className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                    onClick={() => navigate(`/track-order/${data._id}`)}
                >
                    Track Order
                </button>
            </div>
        </div>

    )
}

export default UserOrderCard
