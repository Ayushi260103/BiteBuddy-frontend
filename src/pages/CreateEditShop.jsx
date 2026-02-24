import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';
import ClipLoader from "react-spinners/ClipLoader";

function CreateEditShop() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner); // Access shop data from Redux store for shop owners
    const { currentCity, currentState, currentAddress } = useSelector((state) => state.user); // Access current city and state from Redux store for user

    const [name, setName] = React.useState(myShopData?.name || "");
    const [frontendImage, setFrontendImage] = React.useState(myShopData?.image || null);
    const [backendImage, setBackendImage] = React.useState(null);
    const [city, setCity] = React.useState(myShopData?.city || currentCity);
    const [state, setState] = React.useState(myShopData?.state || currentState);
    const [address, setAddress] = React.useState(myShopData?.address || currentAddress);
    const [loading, setLoading] = React.useState(false);
    const ImageRef = React.useRef();


    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("address", address);
            if (backendImage) {
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, {
                withCredentials: true,
            })
            dispatch(setMyShopData(result.data)); // Update shop data in Redux store after creation or editing
            setLoading(false);
            navigate("/"); // Navigate back to home page after successful shop creation or editing
        } catch (err) {
            setLoading(false);
            console.error(err);
        }
    }
    return (
        <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'
                onClick={() => navigate("/")} >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'><FaUtensils className='text-[#ff4d2d] w-16 h-16' /></div>
                    <div className='text-3xl font-extrabold text-gray-900'>{myShopData ? "Edit Shop" : "Add Shop"}</div>
                </div>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Name</label>
                        <input type="text" placeholder='Enter your shop name' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Shop Image</label>
                        <input type="file" accept="image/*" placeholder='Enter your shop Image' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={handleImage} />
                        {frontendImage &&
                            <div className='mt-4'>
                                <img src={frontendImage} alt="Shop" className='w-full h-[200px] object-cover rounded-lg mt-2' onClick={() => ImageRef.current.click()} />
                            </div>
                        }
                    </div>
                    <div className='grid grid-colss-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>City</label>
                            <input type="text" placeholder='Enter your shop city' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                                onChange={(e) => setCity(e.target.value)} value={city} />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>State</label>
                            <input type="text" placeholder='Enter your shop state' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                                onChange={(e) => setState(e.target.value)} value={state} />
                        </div>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
                        <input type="text" placeholder='Enter your shop address' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setAddress(e.target.value)} value={address} />
                    </div>
                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'
                    disabled={loading}>
                        {loading ? <ClipLoader/>:"Save"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateEditShop