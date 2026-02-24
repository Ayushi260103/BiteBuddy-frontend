import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { useEffect } from 'react';
import { setMyOrders, updateRealTimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData, myOrders, socket } = useSelector(state => state.user);
    
    // const Myorders = Array.isArray(myOrders) ? myOrders : [];

    useEffect(() => {

        //listen newOrder event
        socket?.on('newOrder', (data) => {
            console.log("SOCKET DATA:", data);

            const ownerId = data?.shopOrders.owner._id;

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


        //turn off newOrder event when use effect returns
        return () => {
            socket?.off('newOrder');
            socket?.off('updateStatus');
        }
    },[socket, userData?._id, myOrders]);

    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
            <div className='w-full max-w-[800px] p-4'>
                <div className='flex items-center gap-[20px] mb-6'>
                    <div className='z-[10] cursor-pointer'
                        onClick={() => navigate("/")} >
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='text-2xl font-bold text-start' >My Orders</h1>
                </div>
                <div className='space-y-6'>
                    {myOrders.map((order, idx) => (
                        userData?.role == 'user' ? (
                            <UserOrderCard data={order} key={idx} />
                        ) :
                            userData?.role == 'owner' ? (
                                <OwnerOrderCard data={order} key={idx} />
                            ) :
                                null
                    ))}
                    {myOrders.length === 0 && (
                        <p className='text-gray-500'>No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyOrders;
