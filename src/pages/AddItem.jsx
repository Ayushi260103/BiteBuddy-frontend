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
        if(!name || !price || !category || !foodType || !backendImage){
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
        <div className='flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen'>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]'
                onClick={() => navigate("/")} >
                <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <div className='max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100'>
                <div className='flex flex-col items-center mb-6'>
                    <div className='bg-orange-100 p-4 rounded-full mb-4'><FaUtensils className='text-[#ff4d2d] w-16 h-16' /></div>
                    <div className='text-3xl font-extrabold text-gray-900'>Add Food Item</div>
                </div>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Name</label>
                        <input type="text" placeholder='Enter your food name' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setName(e.target.value)} value={name} />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Food Image</label>
                        <input type="file" accept="image/*" placeholder='Enter your food Image' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={handleImage} />
                        {frontendImage &&
                            <div className='mt-4'>
                                <img src={frontendImage} alt="Item" className='w-full h-[200px] object-cover rounded-lg mt-2' onClick={() => ImageRef.current.click()} />
                            </div>
                        }
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price</label>
                        <input type="number" placeholder='0' className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setPrice(e.target.value)} value={price} />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Category</label>
                        <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setCategory(e.target.value)} value={category}>
                            <option value="">Select a category</option>
                            {categories.map((cat,index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Select Food Type</label>
                        <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200'
                            onChange={(e) => setFoodType(e.target.value)} value={foodType}>
                            <option value="">Select a food type</option>
                            <option value="veg">Veg</option>
                            <option value="non-veg">Non-Veg</option>
                        </select>
                    </div>

                    <button className='w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer'>
                   {loading?
                    <ClipLoader size={20} color="white"/>:
                    "Save"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default AddItem