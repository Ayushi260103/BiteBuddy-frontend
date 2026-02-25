import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealTimeOrderStatus, updateAssignedDeliveryBoy } from '../redux/userSlice';
import { OrderSkeleton } from '../components/SkeletonCard';

function MyOrders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData, myOrders, socket } = useSelector(state => state.user);

    // const Myorders = Array.isArray(myOrders) ? myOrders : [];

    useEffect(() => {

        //listen newOrder event
        socket?.on('newOrder', (data) => {
            console.log("SOCKET DATA:", data);

            const ownerId = data?.shopOrders?.owner?._id || data?.shopOrders?.owner;

            if (ownerId == userData._id) {
                dispatch(setMyOrders([data, ...myOrders]));
            }
        });
        //listen updateStatus event
        socket?.on('updateStatus', ({ orderId, shopId, status, userId }) => {
            if (userId == userData._id) {
                dispatch(updateRealTimeOrderStatus({ orderId, shopId, status }));
            }
        });
        socket?.on('assignmentAccepted', ({ orderId, shopId, assignedDeliveryBoy }) => {
            dispatch(updateAssignedDeliveryBoy({ orderId, shopId, assignedDeliveryBoy }));
        });


        //turn off newOrder event when use effect returns
        return () => {
            socket?.off('newOrder');
            socket?.off('updateStatus');
            socket?.off('assignmentAccepted');
        }
    }, [socket, userData?._id, myOrders]);

    return (
        <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4 py-6">
            <div className="w-full max-w-[900px]">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div
                        className="cursor-pointer p-2 rounded-full hover:bg-[#ff4d2d]/10 transition"
                        onClick={() => navigate("/")}
                    >
                        <IoIosArrowRoundBack size={36} className="text-[#ff4d2d]" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                        My Orders
                    </h1>
                </div>

                {/* Orders */}
                <div className="space-y-8">
                    {!myOrders && (
                        <>
                            <OrderSkeleton />
                            <OrderSkeleton />
                            <OrderSkeleton />
                        </>
                    )}
                    {myOrders.map((order, idx) =>
                        userData?.role === "user" ? (
                            <UserOrderCard data={order} key={idx} />
                        ) : userData?.role === "owner" ? (
                            <OwnerOrderCard data={order} key={idx} />
                        ) : null
                    )}

                    {myOrders.length === 0 && (
                        <div className="text-center py-16 bg-white rounded-2xl shadow">
                            <p className="text-gray-500 text-lg">No orders found</p>
                        </div>
                    )}
                </div>

            </div>
        </div>

    )
}

export default MyOrders;
