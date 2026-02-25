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
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-5 space-y-5 border border-gray-100">

  {/* CUSTOMER INFO */}
  <div className="space-y-1">
    <h2 className="capitalize text-lg font-semibold text-gray-900">
      {data?.user?.fullName?.toLowerCase()}
    </h2>

    <p className="text-sm text-gray-500">{data?.user?.email}</p>

    <p className="flex items-center gap-2 text-sm text-gray-600">
      <MdPhone className="text-gray-400" />
      <span>{data?.user?.mobile}</span>
    </p>

    {data.paymentMethod === "online" ? (
      <p className="text-sm mt-1">
        <span className="font-medium text-gray-600">Online Payment:</span>{" "}
        <span
          className={`font-semibold ${
            data.payment ? "text-green-600" : "text-orange-500"
          }`}
        >
          {data.payment ? "Done" : "Pending"}
        </span>
      </p>
    ) : (
      <p className="text-sm mt-1 text-gray-600">
        <span className="font-medium">Payment Method:</span> COD
      </p>
    )}
  </div>

  {/* DELIVERY ADDRESS */}
  <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600">
    <p>{data?.deliveryAddress?.text}</p>
    <p className="text-xs text-gray-400 mt-1">
      Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
      {data?.deliveryAddress?.longitude}
    </p>
  </div>

  {/* ITEMS */}
  <div className="flex gap-4 overflow-x-auto pb-2">
    {data.shopOrders.shopOrderItems.map((item, i) => (
      <div
        key={i}
        className="flex flex-col shrink-0 w-40 bg-white border border-gray-100 rounded-xl p-2 shadow-sm hover:shadow-md transition"
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
          Qty: {item.quantity} × ₹{item.price}
        </p>
      </div>
    ))}
  </div>

  {/* STATUS + ACTION */}
  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
    <span className="text-sm text-gray-700">
      Status:{" "}
      <span className="font-semibold capitalize text-[#ff4d2d]">
        {data?.shopOrders?.status === "pending"
          ? "Placed"
          : data?.shopOrders?.status}
      </span>
    </span>

    <select
      className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 border-orange-200 disabled:opacity-60"
      disabled={
        data?.shopOrders?.status === "delivered" ||
        data?.shopOrders?.status === "out for delivery"
      }
      onChange={(e) =>
        handleUpdateStatus(
          data._id,
          data.shopOrders.shop._id,
          e.target.value
        )
      }
    >
      <option value="change status">Change Status</option>
      <option value="pending">Placed</option>
      <option value="preparing">Preparing</option>
      <option value="out for delivery">Out for delivery</option>
    </select>
  </div>

  {/* DELIVERY BOY INFO */}
  {data.shopOrders.status === "out for delivery" && (
    <div className="mt-3 p-3 rounded-xl bg-orange-50 border border-orange-100 text-sm space-y-1">
      {data.shopOrders.assignedDeliveryBoy ? (
        <p className="font-medium text-gray-700">
          Assigned Delivery Boy:
        </p>
      ) : (
        <p className="font-medium text-gray-700">
          Available Delivery Boys:
        </p>
      )}

      {availableBoys.length > 0 ? (
        availableBoys.map((boy, idx) => (
          <div key={idx} className="text-gray-600">
            {boy.fullName} — {boy.mobile}
          </div>
        ))
      ) : data.shopOrders.assignedDeliveryBoy ? (
        <div className="text-gray-700">
          {data.shopOrders.assignedDeliveryBoy.fullName} —{" "}
          {data.shopOrders.assignedDeliveryBoy.mobile}
        </div>
      ) : (
        <div className="text-gray-500">
          Waiting for delivery boy to accept
        </div>
      )}
    </div>
  )}

  {/* TOTAL */}
  <div className="text-right font-bold text-gray-900 text-sm pt-2">
    Total: ₹{data?.shopOrders?.subtotal}
  </div>
</div>

    )
}

export default OwnerOrderCard