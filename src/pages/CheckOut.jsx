import React, { useEffect } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoLocationSharp, IoSearchOutline } from 'react-icons/io5';
import { TbCurrentLocation } from 'react-icons/tb';
import L from "leaflet";
import { MapContainer } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { TileLayer } from 'react-leaflet';
import { Marker } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setAddress } from '../redux/mapSlice';
import { setLocation } from '../redux/mapSlice';
import { useMap } from 'react-leaflet';
import axios from 'axios';
import { FaMobileScreenButton } from 'react-icons/fa6';
import { FaCreditCard } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { serverUrl } from '../App';
import { addNewOrderToMyOrders, clearCart } from '../redux/userSlice';
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});



function MapViewHandler({ center }) {
    if (center.lat && center.lng) {
        const map = useMap();
        map.setView([center.lat, center.lng], 16, { animate: true });
    }
    return null;
}

function CheckOut() {
    const { userData } = useSelector(state => state.user);
    const { cartItems, totalAmount } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [addressInput, setAddressInput] = React.useState("");
    const { location, address } = useSelector(state => state.map);
    const [paymentMethod, setPaymentMethod] = React.useState("cod");

    const deliveryFee = totalAmount < 500 ? 40 : 0; // Flat delivery fee of ₹20 for orders below ₹500
    const AmountWithDelivery = totalAmount + deliveryFee;

    const onDragEnd = (event) => {
        console.log("Marker dragged to: ", event.target._latlng);
        const { lat, lng } = event.target.getLatLng();
        dispatch(setLocation({ lat, lng }));
        getAddressByLatLng(lat, lng);
    }

    const getAddressByLatLng = async (lat, lng) => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`);
            const address = (result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1);
            dispatch(setAddress(address));
            console.log("dragged address", address);
        }
        catch (err) {
            console.error("Error fetching address: ", err);
        }
    }

    const getCurrentLocation = () => {

        const latitude = userData?.location?.coordinates[1]
        const longitude = userData?.location?.coordinates[0];
        dispatch(setLocation({ lat: latitude, lng: longitude }));
        getAddressByLatLng(latitude, longitude);

    }

    const getLatLngByAddress = async () => {
        try {
            const searchText = `${addressInput}, India`;
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(searchText)}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`);
            if (!result.data.results || result.data.results.length === 0) {
                alert("Address not found. Please enter full address with city.");
                return;
            }
            console.log("geocoding result", result?.data);
            dispatch(setLocation({ lat: result?.data?.results[0]?.lat, lng: result?.data?.results[0]?.lon }));

        } catch (err) {
            console.error("Error fetching geocoding data: ", err);
        }
    }

    useEffect(() => {
        setAddressInput(address);
    }, [address])

    const openRazorpayWindow = (orderId, razorpayOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: 'INR',
            name: 'Bite Buddy',
            description: 'Food Delivery Website',
            order_id: razorpayOrder.id,
            handler: async function (response) {      // razor pay ki window par pay krne par konsa controller chalega
                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-payment`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId
                    }, { withCredentials: true });
                    dispatch(addNewOrderToMyOrders(result.data));
                    dispatch(clearCart());
                    navigate("/order-placed");
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
    }
    const handlePlaceOrder = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/place-order`, {
                paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    latitude: location.lat,
                    longitude: location.lng
                },
                totalAmount: AmountWithDelivery,
                cartItems
            }, { withCredentials: true })
            console.log(result.data);

            if (paymentMethod == 'cod') {
                dispatch(addNewOrderToMyOrders(result.data));
                dispatch(clearCart());
                navigate("/order-placed");
            }
            else {
                //open razorpay window 
                const orderId = result.data.orderId;
                const razorpayOrder = result.data.razorpayOrder;
                openRazorpayWindow(orderId, razorpayOrder);
            }
        }
        catch (error) {
            console.log("checkout error " + error);
        }
    }

    return (
        <div className="min-h-screen bg-[#fff9f6] flex justify-center px-4 py-8 relative">

    {/* Back Button */}
    <button
        onClick={() => navigate("/cart")}
        className="fixed top-6 left-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:shadow-md transition"
    >
        <IoIosArrowRoundBack size={28} className="text-[#ff4d2d]" />
    </button>

    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8">

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800">
            Checkout
        </h1>

        {/* ================= LOCATION ================= */}
        <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <IoLocationSharp className="text-[#ff4d2d]" />
                Delivery Location
            </h2>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter your delivery address"
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                />

                <button
                    className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 rounded-xl flex items-center justify-center transition"
                    onClick={getLatLngByAddress}
                >
                    <IoSearchOutline size={18} />
                </button>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-xl flex items-center justify-center transition"
                    onClick={getCurrentLocation}
                >
                    <TbCurrentLocation size={18} />
                </button>
            </div>

            {/* Map */}
            <div className="rounded-2xl border bg-gray-100 overflow-hidden">
                <div className="h-64 w-full flex items-center justify-center">
                    {location?.lat && location?.lng && (
                        <MapContainer
                            className="w-full h-full"
                            center={[location.lat, location.lng]}
                            zoom={16}
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapViewHandler center={location} />
                            <Marker
                                position={[location.lat, location.lng]}
                                draggable
                                eventHandlers={{ dragend: onDragEnd }}
                            />
                        </MapContainer>
                    )}
                </div>
            </div>
        </section>

        {/* ================= PAYMENT ================= */}
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* COD */}
                <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition
                    ${paymentMethod === "cod"
                            ? "border-[#ff4d2d] bg-orange-50 shadow"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    onClick={() => setPaymentMethod("cod")}
                >
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <MdDeliveryDining className="text-green-600 text-2xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Cash on Delivery</p>
                        <p className="text-xs text-gray-500">Pay when food arrives</p>
                    </div>
                </div>

                {/* Online */}
                <div
                    className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition
                    ${paymentMethod === "online"
                            ? "border-[#ff4d2d] bg-orange-50 shadow"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    onClick={() => setPaymentMethod("online")}
                >
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <FaMobileScreenButton className="text-purple-700 text-xl" />
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaCreditCard className="text-blue-700 text-xl" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">Online Payment</p>
                        <p className="text-xs text-gray-500">UPI / Card / Wallets</p>
                    </div>
                </div>
            </div>
        </section>

        {/* ================= SUMMARY ================= */}
        <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
                Order Summary
            </h2>

            <div className="rounded-2xl border bg-gray-50 p-5 space-y-3">
                {(cartItems || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                    </div>
                ))}

                <hr />

                <div className="flex justify-between font-medium text-gray-800">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between text-xl font-extrabold text-[#ff4d2d] pt-2">
                    <span>Total</span>
                    <span>₹{AmountWithDelivery}</span>
                </div>
            </div>
        </section>

        {/* ================= CTA ================= */}
        <button
            className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-4 rounded-2xl text-lg font-bold transition shadow-lg"
            onClick={handlePlaceOrder}
        >
            {paymentMethod === "cod" ? "Place Order" : "Proceed to Pay"}
        </button>

    </div>
</div>

    )
}

export default CheckOut
