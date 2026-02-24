import React from 'react'
import { MdPhone } from 'react-icons/md'
import axios from 'axios'
import { serverUrl } from '../App'
import { updateOrderStatus } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
import { useState } from 'react'

function OwnerOrderCard({ data }) {
    
    const dispatch = useDispatch();
    const [availableBoys, setAvailableBoys] = useState([]);
    const handleUpdateStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true });
            console.log(result.data);
            dispatch(updateOrderStatus({ orderId, shopId, status }));
            setAvailableBoys(result?.data?.availableBoys || []);
            console.log("Available boys: ", result?.data?.availableBoys);

        }
        catch (error) {
            console.log("handle update status error" + error);
        }
    }
    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div>
                <h2 className='capitalize text-lg font-semibold text-gray-800'>{data?.user?.fullName?.toLowerCase()}</h2>
                <p className='text-sm text-gray-500'>{data?.user?.email}</p>
                <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><MdPhone /><span>{data?.user?.mobile}</span></p>
                {data.paymentMethod=='online'?
                <p className='gap-2 text-sm text-gray-600 mt-1'>Online Payment: {data.payment? "Done" : "Pending"}</p>:
                 <p className='gap-2 text-sm text-gray-600 mt-1'>Payment Method: COD</p>
                }
            </div>
            <div className='flex flex-col items-start gap-2 text-gray-600 text-sm'>
                <p>{data?.deliveryAddress?.text}</p>
                <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress?.latitude}, Lon: {data?.deliveryAddress?.longitude}</p>
            </div>
            <div className='flex space-x-4 overflow-x-auto pb-2'>
                {data.shopOrders.shopOrderItems.map((item, i) => (
                    <div key={i} className='flex flex-col shrink-0 w-40 border rounded-lg p-2 bg-white shadow-sm'>
                        <img src={item.item?.image} alt={item.item?.name || item.name} className='w-full h-24 object-cover rounded-md' />
                        <p className='text-sm font-semibold mt-2 text-[#1f1f1f] leading-tight'>{item.item?.name || item.name}</p>
                        <p className='text-xs text-gray-500 mt-1'>Qty: {item.quantity} x ₹{item.price}</p>
                    </div>
                ))}
            </div>
            <div className='flex justify-between items-center mt-auto pt-3 border-t border-gray-100'>
                <span className='text-sm'>Status: <span className='font-semibold capitalize text-[#ff4d2d]'>{data?.shopOrders?.status}</span></span>
                <select className='rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d]'
                disabled={data?.shopOrders?.status == "delivered" || data?.shopOrders?.status == "out for delivery"}
                    onChange={(e) => handleUpdateStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="change status">Change Status</option>
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out for delivery">Out for delivery</option>
                </select>
            </div>
            {data.shopOrders.status == "out for delivery" &&
                <div className='mt-3 p-2 border rounded-lg text-sm bg-orange-50'>
                    {
                        data.shopOrders.assignedDeliveryBoy ?
                        <p> Assigned Delivery Boy: </p>:<p> Available Delivery Boys </p>
                    }
                    {availableBoys.length > 0 ? 
                    (
                        availableBoys.map((boy, idx) => (
                            <div className='text-gray-300' key={idx}>{boy.fullName}-{boy.mobile}</div>
                        ))
                    ) : 
                    (
                        
                            data.shopOrders.assignedDeliveryBoy ?
                                <div>
                                    {data.shopOrders.assignedDeliveryBoy.fullName}- {data.shopOrders.assignedDeliveryBoy.mobile}
                                </div> : 
                                <div> Waiting for delivery boy to accept </div>
                        
                    )}
                    
                </div>
            }
            <div className='text-right font-bold text-gray-800 text-sm'>
                Total: ₹{data?.shopOrders?.subtotal}
            </div>
        </div>
    )
}

export default OwnerOrderCard