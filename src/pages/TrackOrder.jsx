import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useState } from 'react';
import DeliveryBoyTracking from '../components/DeliveryBoyTracking';
import { useSelector } from 'react-redux';

function TrackOrder() {
    // live map tracking
    const { socket } = useSelector(state => state.user);
    const [liveLocation, setLiveLocation] = useState({});

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { orderId } = useParams();
    const [currentOrder, setCurrentOrder] = useState();
    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`
                , { withCredentials: true });
            setCurrentOrder(result?.data);
            console.log(result.data);
        }
        catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        handleGetOrder();
    }, [orderId]);

    useEffect(() => {
        socket.on('updateDeliveryLocation', ({ deliveryBoyId, latitude, longitude }) => {
            setLiveLocation(prev => ({
                ...prev,
                [deliveryBoyId]: { lat: latitude, lon: longitude }     //key value 
            }))
        })

        return () => {
            socket.off('updateDeliveryLocation');
        };
    }, [socket])
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fff9f6]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-orange-200 border-t-[#ff4d2d] rounded-full animate-spin" />
                    <p className="text-gray-600 font-medium">
                        Loading order details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">

            {/* Header */}
            <div
                className="cursor-pointer flex items-center gap-3 mb-2"
                onClick={() => navigate("/my-orders")}
            >
                <IoIosArrowRoundBack size={34} className="text-[#ff4d2d]" />
                <h1 className="text-2xl font-bold text-gray-800">
                    Track Order
                </h1>
            </div>

            {/* Orders */}
            {currentOrder && currentOrder.shopOrders.map((shopOrder, idx) => (
                <div
                    key={idx}
                    className="bg-white p-5 rounded-2xl shadow-md border border-orange-200 space-y-5"
                >

                    {/* Order details */}
                    <div className="space-y-2">
                        <p className="text-lg font-bold text-[#ff4d2d]">
                            {shopOrder?.shop?.name}
                        </p>

                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Items:</span>{" "}
                            {shopOrder?.shopOrderItems?.map(i => i.name).join(", ")}
                        </p>

                        <p className="text-sm">
                            <span className="font-semibold">Subtotal:</span>{" "}
                            ₹{shopOrder?.subtotal}
                        </p>

                        <p className="text-sm mt-3">
                            <span className="font-semibold">Delivery Address:</span>{" "}
                            {currentOrder.deliveryAddress.text}
                        </p>
                    </div>

                    {/* Delivery Boy details */}
                    {shopOrder.status !== "delivered" ? (
                        <>
                            {shopOrder.assignedDeliveryBoy ? (
                                <>
                                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-1">
                                        <p>
                                            <span className="font-semibold">Delivery Boy:</span>{" "}
                                            {shopOrder.assignedDeliveryBoy.fullName}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Contact:</span>{" "}
                                            {shopOrder.assignedDeliveryBoy.mobile}
                                        </p>
                                    </div>

                                    {/* Map */}
                                    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md border">
                                        <DeliveryBoyTracking
                                            data={{
                                                deliveryBoyLocation:
                                                    liveLocation[shopOrder?.assignedDeliveryBoy._id] || {
                                                        lat: shopOrder?.assignedDeliveryBoy.location.coordinates[1],
                                                        lon: shopOrder?.assignedDeliveryBoy.location.coordinates[0],
                                                    },
                                                customerLocation: {
                                                    lat: currentOrder.deliveryAddress.latitude,
                                                    lon: currentOrder.deliveryAddress.longitude,
                                                },
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <p className="font-semibold text-orange-600">
                                    Delivery Boy not assigned yet
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-green-600 font-semibold text-lg text-center">
                            ✅ Delivered
                        </p>
                    )}
                </div>
            ))}
        </div>

    )
}

export default TrackOrder