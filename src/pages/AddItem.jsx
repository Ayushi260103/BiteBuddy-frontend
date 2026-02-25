import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';
import ClipLoader from 'react-spinners/ClipLoader.js';

function AddItem() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner); // Access shop data from Redux store for shop owners

    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState(0);
    const [category, setCategory] = React.useState("");
    const categories = ["Snacks", "Main Course",
        "Desserts", "Pizza", "Burgers",
        "Sandwiches", "South Indian", "North Indian",
        "Chinese", "Fast Food", "Beverages", "Others"]
    const [foodType, setFoodType] = React.useState("veg");
    const [frontendImage, setFrontendImage] = React.useState(null);
    const [backendImage, setBackendImage] = React.useState(null);
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
        if (!name || !price || !category || !foodType || !backendImage) {
            alert("Please fill all the fields");
            setLoading(false);
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("category", category);
            formData.append("foodType", foodType);
            formData.append("price", price);
            if (backendImage) {
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/item/add-item`, formData, {
                withCredentials: true,
            })
            dispatch(setMyShopData(result.data)); // Update shop data in Redux store after creation or editing
            setLoading(false);
            console.log("Added item data", result.data);
            navigate("/");
        } catch (err) {
            setLoading(false);
            console.error(err.response?.data);
        }
    }
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4">

            {/* BACK BUTTON */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-100 transition"
            >
                <IoIosArrowRoundBack size={36} className="text-[#ff4d2d]" />
            </button>

            {/* CARD */}
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border border-orange-100 mt-10">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-orange-100 p-4 rounded-full mb-4 shadow-sm">
                        <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Add Food Item
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Add a delicious item to your menu
                    </p>
                </div>

                {/* FORM */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* FOOD NAME */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Food Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your food name"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </div>

                    {/* IMAGE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Food Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm px-4 py-2 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-200"
                            onChange={handleImage}
                        />

                        {frontendImage && (
                            <div className="mt-4 relative group">
                                <img
                                    src={frontendImage}
                                    alt="Item"
                                    className="w-full h-[220px] object-cover rounded-xl border cursor-pointer"
                                    onClick={() => ImageRef.current.click()}
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-sm font-medium">
                                    Click to change image
                                </div>
                            </div>
                        )}
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                            onChange={(e) => setPrice(e.target.value)}
                            value={price}
                        />
                    </div>

                    {/* CATEGORY */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Category
                        </label>
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                            onChange={(e) => setCategory(e.target.value)}
                            value={category}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* FOOD TYPE */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Food Type
                        </label>
                        <select
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
                            onChange={(e) => setFoodType(e.target.value)}
                            value={foodType}
                        >
                            <option value="">Select a food type</option>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>

                    {/* SUBMIT */}
                    <button
                        className="w-full flex items-center justify-center gap-2 bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 disabled:opacity-70"
                    >
                        {loading ? <ClipLoader size={20} color="white" /> : "Save"}
                    </button>
                </form>
            </div>
        </div>

    )
}

export default AddItem