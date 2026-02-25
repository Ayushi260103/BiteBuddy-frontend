import React, { useEffect, useState } from 'react'
import Nav from './Nav.jsx'
import { useSelector } from 'react-redux'
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import DeliveryBoyTracking from './DeliveryBoyTracking.jsx';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ClipLoader from 'react-spinners/ClipLoader.js';



function DeliveryBoyDashboard() {
  const { userData, socket } = useSelector(state => state.user);
  const [currentOrder, setCurrentOrder] = useState();
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0);

  // live tracking
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);

  useEffect(() => {
    if (!socket || userData?.role != 'deliveryBoy') return;

    let watchId;
    if (navigator.geolocation) {
      //when lat lng changes then socket will work
      watchId = navigator.geolocation.watchPosition((pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        setDeliveryBoyLocation({ lat: latitude, lon: longitude });
        //event send karna h to emit
        //event listen karna h to on
        socket.emit('updateLocation', {
          latitude,
          longitude,
          userId: userData._id
        })
      }, (error) => {
        console.log(error);
      }, {
        enableHighAccuracy: true          //watch position will now use gps to get our location for high accuracy
      });
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    }
  }, [socket, userData])

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true });
      setCurrentOrder(result.data);
      console.log(result.data);
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }

  const getAssignment = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true });
      setAvailableAssignments(result.data);
      // console.log(result.data);
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }

  const handleAcceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true });
      console.log(result.data);
      setAvailableAssignments(prev => prev.filter(a => a.assignmentId !== assignmentId));
      await getCurrentOrder();
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }

  const handleSendDeliveryOtp = async () => {
    setLoading(true);
    try {
      const orderId = currentOrder._id;
      const shopOrderId = currentOrder.shopOrder._id;
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`,
        { orderId, shopOrderId },
        { withCredentials: true });
      setLoading(false);
      setShowOtpBox(true)
      console.log(result.data);
    }
    catch (err) {
      setLoading(false);
      setShowOtpBox(false);
      console.log(err.response?.data);
    }
  }

  const handleVerifyDeliveryOtp = async () => {
    setMessage("");
    try {
      const orderId = currentOrder._id;
      const shopOrderId = currentOrder.shopOrder._id;
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`,
        { orderId, shopOrderId, otp },
        { withCredentials: true });
      setMessage(result.data.message);
      console.log(result.data);
      location.reload() //reload current page
    }
    catch (err) {
      setMessage("")
      console.log(err.response?.data);
    }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true });
      console.log(result.data);
      setTodayDeliveries(result.data);
    }
    catch (err) {
      console.log(err.response?.data);
    }
  }


  useEffect(() => {
    if (!socket || userData?.role !== 'deliveryBoy') return;

    socket.on('newAssignment', (data) => {
      //send to correct delivery boy
      if (data.sentTo == userData._id) {
        setAvailableAssignments(prev => {
          const exists = prev.some(a => a.assignmentId === data.assignmentId);
          return exists ? prev : [...prev, data];
        });
      }
    });
    return () => {
      socket.off('newAssignment');
    }
  }, [socket, userData?._id, userData?.role]);

  useEffect(() => {
    getAssignment();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      <div className="w-full max-w-[800px] flex flex-col gap-6 items-center py-4">

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-[90%] border border-orange-100 text-center space-y-2">
          <h1 className="text-xl font-bold text-[#ff4d2d] capitalize">
            👋 Welcome, {userData?.fullName || "Delivery Partner"}
          </h1>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Latitude:</span>{" "}
            {deliveryBoyLocation?.lat ?? userData?.location?.coordinates?.[1] ?? "N/A"}
            <span className="mx-1">|</span>
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation?.lon ?? userData?.location?.coordinates?.[0] ?? "N/A"}
          </p>
        </div>

        {/* Today Deliveries */}
        {totalEarning>0 &&
        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] border border-orange-100 space-y-6">
          <h1 className="text-lg font-bold text-[#ff4d2d]">Today Deliveries</h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip
                formatter={(value) => [value, "orders"]}
                labelFormatter={(label) => `${label}:00`}
              />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>

          {/* Earnings */}
          <div className="max-w-sm mx-auto p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow text-center">
            <h1 className="text-sm font-semibold text-gray-600 mb-1">
              Today's Earnings
            </h1>
            <span className="text-3xl font-bold text-green-600">
              ₹{totalEarning}
            </span>
          </div>
        </div>
        }

        {/* No Current Order */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4">
              Available Order Assignments
            </h1>

            <div className="space-y-4">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, idx) => (
                  <div
                    key={idx}
                    className="border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
                  >
                    <div>
                      <p className="text-sm font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Deliver At:</span>{" "}
                        {a?.deliveryAddress?.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(a?.items || [])
                          .map((item) => `${item?.name || item?.item?.name} x ${item?.quantity}`)
                          .join(", ")}{" "}
                        | {a?.subtotal}
                      </p>
                    </div>

                    <button
                      className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 active:scale-95 transition"
                      onClick={() => handleAcceptOrder(a?.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center">
                  No Assignments available
                </p>
              )}
            </div>
          </div>
        )}

        {/* Current Assigned Order */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              📦 Current Assigned Order
            </h2>

            <div className="border rounded-xl p-4 mb-4 bg-[#fffaf7]">
              <p className="font-semibold text-sm">
                {currentOrder?.shopOrder?.shop?.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.deliveryAddress.text}
              </p>
              <p className="text-xs text-gray-400">
                {(currentOrder?.shopOrder?.shopOrderItems || [])
                  .map((item) => `${item?.name || item?.item?.name} x ${item?.quantity}`)
                  .join(", ")}{" "}
                |{" "}
                {currentOrder.shopOrder?.subtotal}
              </p>
            </div>

            {/* Map (untouched functionality) */}
            <div className="h-[350px] w-full rounded-2xl overflow-hidden shadow-md border">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation:
                    deliveryBoyLocation || {
                      lat: userData.location.coordinates[1],
                      lon: userData.location.coordinates[0],
                    },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>

            {!showOtpBox && (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-xl shadow-md
            hover:bg-green-600 active:scale-95 transition-all duration-200 disabled:opacity-70"
                onClick={handleSendDeliveryOtp}
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Mark as Delivered"}
              </button>
            )}

            {showOtpBox && (
              <div className="mt-4 p-4 border rounded-xl bg-gray-50 space-y-3">
                <p className="text-sm font-semibold">
                  Enter OTP sent to{" "}
                  <span className="text-orange-500">
                    {currentOrder?.user?.fullName
                      ?.toLowerCase()
                      ?.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </p>

                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />

                {message && (
                  <p className="text-center text-green-500 font-medium">
                    {message}
                  </p>
                )}

                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
                  onClick={handleVerifyDeliveryOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

  )
}
export default DeliveryBoyDashboard
