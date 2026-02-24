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
import { addNewOrderToMyOrders } from '../redux/userSlice';
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className='z-[10] cursor-pointer absolute top-[20px] left-[20px]'
                onClick={() => navigate("/")} >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
                <h1 className='text-2xl font-bold text-gray-800'>
                    Checkout
                </h1>
                {/* Location Section */}
                <section>
                    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'>
                        <IoLocationSharp className='text-[#ff4d2d]' />
                        Delivery Location
                    </h2>
                    <div className='flex gap-2 mb-3'>
                        <input type='text' placeholder='Enter your delivery address'
                            className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]'
                            value={addressInput} onChange={(e) => { setAddressInput(e.target.value) }}
                        />
                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer'
                            onClick={getLatLngByAddress}>
                            <IoSearchOutline size={17} />
                        </button>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer'
                            onClick={getCurrentLocation}>
                            <TbCurrentLocation size={17} />
                        </button>
                    </div>
                    {/* Map Placeholder */}
                    <div className='rounded-xl border overflow-hidden'>
                        <div className='h-64 w-full flex items-center justify-center'>
                            {location?.lat && location?.lng && (
                                <MapContainer className={'w-full h-full'} center={[location?.lat, location?.lng]} zoom={16} >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    {/* Helper component to auto-pan when location changes */}

                                    <MapViewHandler center={location} />
                                    <Marker position={[location?.lat, location?.lng]} draggable={true} eventHandlers={{ dragend: onDragEnd }} />

                                </MapContainer>
                            )}
                        </div>
                    </div>
                </section>


                {/* Payment Method Section */}
                <section>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"} cursor-pointer`}
                            onClick={() => setPaymentMethod("cod")}>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                                <MdDeliveryDining className='text-green-600 text-xl' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'> Cash On Delivery </p>
                                <p className='text-xs text-gray-500'> Pay when your food arrives</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"} cursor-pointer`}
                            onClick={() => setPaymentMethod("online")}>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                                <FaMobileScreenButton className='text-purple-700 text-xl' />
                            </span>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                                <FaCreditCard className='text-blue-700 text-xl' />
                            </span>
                            <div>
                                <p className='font-medium text-gray-800'> Online Payment </p>
                                <p className='text-xs text-gray-500'> Pay securely online</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Order Summary Section */}
                <section>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
                    <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                        {cartItems.map((item, idx) => (
                            <div key={idx} className='flex justify-between text-sm text-gray-700'>
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                        <hr className='border-gray-200 my-2' />
                        <div className='flex justify-between font-medium text-gray-800'>
                            <span>
                                Subtotal
                            </span>
                            <span>
                                {`₹${totalAmount}`}
                            </span>
                        </div>
                        <div className='flex justify-between text-gray-700'>
                            <span>
                                Delivery Fee
                            </span>
                            <span>
                                {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                            </span>
                        </div>
                        <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
                            <span>
                                Total Amount
                            </span>
                            <span>
                                {`₹${AmountWithDelivery}`}
                            </span>
                        </div>
                    </div>
                </section>
                <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold cursor-pointer'
                    onClick={handlePlaceOrder}>
                    {paymentMethod === "cod" ? "Place Order" : "Proceed to Pay"}
                </button>
            </div>


        </div>
    )
}

export default CheckOut
