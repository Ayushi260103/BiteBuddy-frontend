import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { serverUrl } from '../App';
import { useState } from 'react';
import { useSelector } from 'react-redux';

function UserOrderCard({ data }) {
    const { userData} = useSelector(state => state.user);
    const userId=userData._id;
    const navigate = useNavigate();
    const [selectedRating, setSelectedRating] = useState({})  //{itemId: rating}
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
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            {/* Status, mode, id, date */}
            <div className='flex justify-between border-b pb-2'>
                {/* Left */}
                <div>
                    <p className='font-semibold'>
                        order #{data._id.slice(-6)}
                    </p>
                    <p className='text-sm text-gray-500'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                {/* Right */}
                <div className='text-right'>
                    {data.paymentMethod == 'cod' ?
                        <p className='text-sm text-gray-500'>{data.paymentMethod?.toUpperCase()}</p> :
                        <p className='text-sm text-gray-500 font-semibold'>{data.payment ? "Done" : "Pending Online"}</p>
                    }
                    {data?.shopOrders?.[0].status == "delivered" ? (
                        <p className='font-medium text-green-600 capitalize'>{data.shopOrders?.[0].status}</p>) : (
                        <p className='font-medium text-blue-600 capitalize'>{data.shopOrders?.[0].status}</p>)
                    }
                </div>
            </div>
            {/* Order details */}
            {data.shopOrders.map((shopOrder, idx) => (
                <div className='border rounded-lg p-3 bg-[#fffaf7] space-y-3' key={idx}>
                    <p className='font-semibold text-[#2f2f2f]'>{shopOrder.shop?.name}</p>
                    <div className='flex space-x-4 overflow-x-auto pb-2'>
                        {shopOrder.shopOrderItems.map((item, i) => (

                            <div key={i} className='flex flex-col shrink-0 w-40 border rounded-lg p-2 bg-white shadow-sm'>
                                <img src={item.item?.image} alt={item.item?.name || item.name} className='w-full h-24 object-cover rounded-md' />
                                <p className='text-sm font-semibold mt-2 text-[#1f1f1f] leading-tight'>{item.item?.name || item.name}</p>
                                <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity} x ₹{item.price}</p>
                                {/* rating */}

                                {shopOrder.status == 'delivered' && (
                                    <div className='flex space-x-1 mt-2'>
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const itemId = item.item?._id;

                                            // find rating from DB for this user
                                            const dbRatingObj = item.item?.userRatings?.find(
                                                r => r.userId === userId
                                            );

                                            const dbRating = dbRatingObj?.value || 0;

                                            const currentRating =
                                                selectedRating[itemId] ?? dbRating;

                                            const isRated = currentRating > 0;

                                            return (
                                                <button
                                                    key={star}
                                                    disabled={isRated}
                                                    className={`text-lg ${currentRating >= star
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-400'
                                                        } ${isRated
                                                            ? 'cursor-not-allowed opacity-80'
                                                            : 'cursor-pointer'
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
                    <div className='flex justify-between items-center border-t pt-2'>
                        <p className='font-semibold'>Subtotal: {shopOrder.subtotal}</p>
                        {shopOrder?.status == "delivered" ? (
                            <span className='text-sm font-medium text-green-600'>Status: {shopOrder.status}</span>) : (
                            <span className='text-sm font-medium text-blue-600'>Status: {shopOrder.status}</span>)
                        }
                    </div>


                </div>
            ))}
            {/* Total */}
            <div className='flex justify-between items-center border-t pt-2'>
                <p className='font-semibold'>Total:  ₹{data.totalAmount}</p>
                <button className='bg-[#ff4d2d] hover-[#e64526] text-white px-4 py-2 rounded-lg text-sm cursor-pointer'
                    onClick={() => navigate(`/track-order/${data._id}`)}>
                    Track Order
                </button>
            </div>
        </div>
    )
}

export default UserOrderCard
