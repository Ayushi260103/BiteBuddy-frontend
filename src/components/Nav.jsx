import React, { useEffect, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FiShoppingCart } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { RxCross2 } from 'react-icons/rx'
import { useDispatch } from 'react-redux'
import { setSearchItems, setUserData } from '../redux/userSlice'
import axios from 'axios'
import { serverUrl } from '../App'
import { FaPlus } from 'react-icons/fa'
import { TbReceipt2 } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'


function Nav() {
    const navigate = useNavigate();
    const { userData, currentCity, cartItems } = useSelector((state) => state.user); // Access user data from Redux store  
    const [showInfo, setShowInfo] = React.useState(false);
    const [showSearch, setShowSearch] = React.useState(false);
    const [query, setQuery] = useState("");
    const { myShopData } = useSelector((state) => state.owner); // Access shop data from Redux store for shop owners
    const dispatch = useDispatch();

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
            dispatch(setUserData(null)); // Clear user data from Redux store on logout
            console.log(result.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const handleSearchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`, { withCredentials: true });
            dispatch(setSearchItems(result.data));
            console.log(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (query) handleSearchItems();
        else dispatch(setSearchItems([]));
    }, [query]);

    return (
        <div className="fixed top-0 left-0 w-full z-[9999] bg-white/90 backdrop-blur border-b border-gray-100">
            <div className="h-[72px] max-w-[1280px] mx-auto flex items-center justify-between md:justify-center gap-6 px-4 md:px-6">

                {/* logo */}
                <h1
                    className="text-2xl md:text-3xl font-extrabold text-[#ff4d2d] cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Bite<span className="text-gray-900">Buddy</span>
                </h1>

                {/* desktop search */}
                {showSearch && userData.role == "user" &&
                    <div className="w-[90%] h-[64px] bg-white shadow-2xl rounded-2xl flex items-center gap-4 fixed top-[90px] left-[5%] z-[9999] md:hidden px-3">
                        <div className="flex items-center w-[30%] gap-2 pr-2 border-r border-gray-300 overflow-hidden">
                            <FaLocationDot size={26} className="text-[#ff4d2d]" />
                            <div className="truncate text-sm text-gray-600">
                                {currentCity}
                            </div>
                        </div>

                        <div className="flex items-center w-[70%] gap-2">
                            <IoIosSearch size={22} className="text-[#ff4d2d]" />
                            <input
                                type="text"
                                placeholder="Search for food items..."
                                className="w-full outline-none text-sm text-gray-700 placeholder-gray-400"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                    </div>
                }

                {userData.role == "user" && (
                    <div
                        className="
                md:w-[60%] lg:w-[42%]
                h-[48px]
                bg-gray-50
                rounded-full
                flex items-center gap-3
                px-4
                shadow-sm
                hidden md:flex
            "
                    >
                        <div className="flex items-center gap-2 pr-3 border-r border-gray-200">
                            <FaLocationDot size={24} className="text-[#ff4d2d]" />
                            <div className="max-w-[140px] truncate text-sm text-gray-600">
                                {currentCity}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-1">
                            <IoIosSearch size={20} className="text-[#ff4d2d]" />
                            <input
                                type="text"
                                placeholder="Search for dishes or restaurants"
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-4">

                    {userData.role == "user" && (
                        showSearch ? (
                            <RxCross2
                                size={24}
                                className="text-[#ff4d2d] md:hidden cursor-pointer"
                                onClick={() => setShowSearch(false)}
                            />
                        ) : (
                            <IoIosSearch
                                size={24}
                                className="text-[#ff4d2d] md:hidden cursor-pointer"
                                onClick={() => setShowSearch(true)}
                            />
                        )
                    )}

                    {userData.role == "user" && (
                        <>
                            <div
                                className="relative cursor-pointer"
                                onClick={() => navigate("/cart")}
                            >
                                <FiShoppingCart size={24} className="text-[#ff4d2d]" />
                                <span className="absolute -right-2 -top-2 text-xs font-semibold text-[#ff4d2d]">
                                    {cartItems.length}
                                </span>
                            </div>

                            <button
                                className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium cursor-pointer"
                                onClick={() => navigate("/my-orders")}
                            >
                                My Orders
                            </button>
                        </>
                    )}

                    {userData.role != "user" && (
                        <>
                            {myShopData && (
                                <>
                                    <button
                                        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                                        onClick={() => navigate("/add-item")}
                                    >
                                        <FaPlus size={18} />
                                        <span>Add Food Item</span>
                                    </button>

                                    <button
                                        className="md:hidden flex items-center p-2 rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]"
                                        onClick={() => navigate("/add-item")}
                                    >
                                        <FaPlus size={20} />
                                    </button>
                                </>
                            )}

                            <div
                                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium cursor-pointer"
                                onClick={() => navigate("/my-orders")}
                            >
                                <TbReceipt2 size={18} />
                                <span>My Orders</span>
                            </div>

                            <div
                                className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium cursor-pointer"
                                onClick={() => navigate("/my-orders")}
                            >
                                <TbReceipt2 size={18} />
                            </div>
                        </>
                    )}

                    <div
                        className="w-[40px] h-[40px] rounded-full bg-[#ff4d2d] text-white flex items-center justify-center text-lg font-semibold cursor-pointer"
                        onClick={() => setShowInfo(prev => !prev)}
                    >
                        {userData?.fullName?.slice(0, 1)?.toUpperCase()}
                    </div>

                    {showInfo && (
                        <div
                            className={`fixed top-[80px] right-[10px]
                ${userData.role == 'deliveryBoy'
                                    ? "md:right-[20%] lg:right-[32%]"
                                    : "md:right-[10%] lg:right-[25%]"
                                }
                w-[190px] bg-white shadow-2xl rounded-xl p-4 flex flex-col gap-3 z-[9999]`}
                        >
                            <div className="text-base font-semibold">
                                {userData?.fullName}
                            </div>

                            {userData.role == "user" && (
                                <div
                                    className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer"
                                    onClick={() => navigate("/my-orders")}
                                >
                                    My Orders
                                </div>
                            )}

                            <div
                                className="text-[#ff4d2d] font-semibold cursor-pointer"
                                onClick={handleLogOut}
                            >
                                Log Out
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Nav