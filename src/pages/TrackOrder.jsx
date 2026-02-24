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

    return (
        <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>
            <div className='z-[10] cursor-pointer relative flex items-center gap-4 top-[20px] left-[20px] mb-[10px]'
                onClick={() => navigate("/my-orders")} >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                <h1 className='text-2xl font-bold md:text-center'>
                    Track Order
                </h1>
            </div>
            {/* Map Order */}
            {currentOrder && currentOrder.shopOrders.map((shopOrder, idx) => (
                <div className='bg-white p-4 rounded-2xl shadow-md border border-orange-200 space-y-4'
                    key={idx}>
                    {/* Order details */}
                    <div>
                        <p className='text-lg font-bold mb-2 text-[#ff4d2d]'>
                            {shopOrder?.shop?.name}
                        </p>
                        <p className='font-semibold'>
                            <span>
                                Items:
                            </span>
                            {shopOrder?.shopOrderItems?.map(i => i.name).join(",  ")}
                        </p>
                        <p>
                            <span className='font-semibold'>
                                Subtotal:
                            </span>
                            {shopOrder?.subtotal}
                        </p>
                        <p className='mt-6'>
                            <span className='font-semibold'>
                                Delivery Address:
                            </span>
                            {currentOrder.deliveryAddress.text}
                        </p>
                    </div>
                    {/* Delivery Boy details */}
                    {shopOrder.status != "delivered" ?
                        <>

                            {shopOrder.assignedDeliveryBoy ?
                                (<>
                                    <div className='text-sm text-gray-700'>
                                        <p className='font-semibold'>
                                            <span className='pr-1'>
                                                Delivery Boy Name:
                                            </span>
                                            {shopOrder.assignedDeliveryBoy.fullName}
                                        </p>
                                        <p className='font-semibold'>
                                            <span className='pr-1'>
                                                Delivery Boy Contact:
                                            </span>
                                            {shopOrder.assignedDeliveryBoy.mobile}
                                        </p>
                                    </div>
                                    {/* Map*/}
                                    <div className='h-[400px] w-full rounded-2xl overflow-hidden shadow-md'>
                                        <DeliveryBoyTracking data={{
                                            deliveryBoyLocation:
                                                liveLocation[shopOrder?.assignedDeliveryBoy._id] || {             //if livelocation has value for that delivery boy id then use that value else use other
                                                    lat: shopOrder?.assignedDeliveryBoy.location.coordinates[1],
                                                    lon: shopOrder?.assignedDeliveryBoy.location.coordinates[0]
                                                },
                                            customerLocation: {
                                                lat: currentOrder.deliveryAddress.latitude,
                                                lon: currentOrder.deliveryAddress.longitude
                                            }
                                        }} />
                                    </div>
                                </>) :
                                <p className='font-semibold'>
                                    Delivery Boy Not assigned yet
                                </p>
                            }
                        </> :
                        <p className='text-green-600 font-semibold text-lg'>
                            Delivered
                        </p>
                    }
                </div>
            ))
            }
        </div>
    )
}

export default TrackOrder