import React from 'react'
import { FaPen } from 'react-icons/fa6'
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';
import axios from 'axios';
import { serverUrl } from '../App';



function OwnerItemCard({ item }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleDelete = async () => {
        try {
            const result = await axios.delete(`${serverUrl}/api/item/delete-item/${item._id}`, {
                withCredentials: true,
            })
            dispatch(setMyShopData(result.data));
        } catch (err) {
            console.error("Error deleting item", err);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-orange-100 overflow-hidden">

            {/* IMAGE */}
            <div className="w-32 sm:w-36 flex-shrink-0 bg-gray-50">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover self-stretch"
                />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col justify-between p-4 flex-1">

                {/* TOP */}
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-[#ff4d2d] capitalize">
                        {item.name}
                    </h2>

                    <p className="text-sm text-gray-600 capitalize">
                        <span className="font-medium text-gray-700">Category:</span>{" "}
                        {item.category}
                    </p>

                    <p className="text-sm text-gray-600 capitalize">
                        <span className="font-medium text-gray-700">Food Type:</span>{" "}
                        {item.foodType}
                    </p>
                </div>

                {/* BOTTOM */}
                <div className="flex items-center justify-between mt-4">
                    <div className="text-lg font-bold text-[#ff4d2d]">
                        ₹{item.price}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/edit-item/${item._id}`)}
                            className="p-2 rounded-full hover:bg-blue-50 transition"
                        >
                            <FaPen size={16} className="text-blue-500 hover:text-blue-700" />
                        </button>

                        <button
                            onClick={handleDelete}
                            className="p-2 rounded-full hover:bg-red-50 transition"
                        >
                            <FaTrashAlt size={16} className="text-red-500 hover:text-red-700" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OwnerItemCard