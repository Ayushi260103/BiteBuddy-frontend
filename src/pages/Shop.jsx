import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { useState } from 'react';
import { FaStore, FaUtensils } from 'react-icons/fa6';
import { FaLocationDot } from 'react-icons/fa6';
import FoodCard from '../components/FoodCard';
import { FaArrowLeft } from 'react-icons/fa6';


function Shop() {
    const navigate = useNavigate();
    const { shopId } = useParams();

    const [items, setItems] = useState([]);
    const [shop, setShop] = useState([]);
    const [imageLoaded, setImageLoaded] = useState(false)


    const handleShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true });
            setItems(result.data.items);
            setShop(result.data.shop);
            console.log(result.data);
        }
        catch (error) {
            console.log(error.response?.data);
        }
    }
    useEffect(() => {
        handleShop();
    }, []);

    const isLoading = !shop || !imageLoaded

    return (
        <div className="min-h-screen bg-[#fff9f6]">

            {/* Back Button */}
            <button
                className="fixed top-4 left-4 z-30 flex items-center gap-2 bg-black/60 hover:bg-black/80 text-white px-4 py-2 rounded-full shadow-lg transition"
                onClick={() => navigate("/")}
            >
                <FaArrowLeft />
                Back
            </button>

            {/* Loader */}
            {isLoading && (
                <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white">
                    <div className="w-14 h-14 border-4 border-[#ff4d2d]/30 border-t-[#ff4d2d] rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Loading restaurant...
                    </p>
                </div>
            )}

            {/* Shop Content */}
            {shop && (
                <>
                    {/* Hero Section */}
                    <div className="relative w-full h-64 md:h-80 lg:h-[420px]">
                        <img
                            src={shop.image}
                            alt="shop"
                            className="w-full h-full object-cover"
                            onLoad={() => setImageLoaded(true)}
                        />

                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 flex flex-col justify-center items-center text-center px-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4">
                                <FaStore className="text-white text-4xl mx-auto mb-2" />
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                                    {shop.name}
                                </h1>
                                <div className="flex items-center justify-center gap-2 mt-3 text-gray-200 text-sm md:text-base">
                                    <FaLocationDot className="text-red-500" />
                                    <span>{shop.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div className="max-w-7xl mx-auto px-4 py-10">
                        <h2 className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-bold text-gray-800 mb-10">
                            <FaUtensils className="text-[#ff4d2d]" />
                            Our Menu
                        </h2>

                        {items.length > 0 ? (
                            <div className="
                                grid grid-cols-1
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                gap-8
                            ">
                                {items.map((item) => (
                                    <FoodCard key={item._id} data={item} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-lg">
                                No items available
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>

    )
}

export default Shop