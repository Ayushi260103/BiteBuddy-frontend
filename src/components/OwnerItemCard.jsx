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

    
        const handleDelete = async () =>{
            try{
                const result= await axios.delete(`${serverUrl}/api/item/delete-item/${item._id}`,{
                    withCredentials:true,
                })
                dispatch(setMyShopData(result.data));
            }catch(err){
                console.error("Error deleting item", err);
            }
        }
    
    return (
        <div className="flex bg-white rounded-lg shadow-md overflow-hidden border border-[#ff4d2d] w-full max-w-2xl">
            <div className='w-36 h-full flex-shrink-0 bg-gray-50'>
                <img src={item.image} alt={item.name} className="w-full object-cover" />
            </div>
            <div className='flex flex-col justify-between p-3 flex-1'>
                <div>
                    <h2 className='text-base font-semibold text-[#ff4d2d] capitalize'>{item.name}</h2>
                    <p className='capitalize'><span className='font-medium text-gray-70'>Category:</span> {item.category}</p>
                    <p className='capitalize'><span className='font-medium text-gray-70'>Food Type:</span> {item.foodType}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='text-[#ff4d2d] font-bold'> ₹{item.price}</div>
                    <div className=' flex items-center gap-3'>
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'
                        onClick={()=>navigate(`/edit-item/${item._id}`)}>
                            <FaPen size={16} className='text-blue-500 cursor-pointer hover:text-blue-700' />
                        </div>
                        <div className='p-2 rounded-full hover:bg-[#ff4d2d]/10 text-[#ff4d2d]'
                        onClick={handleDelete}>
                            <FaTrashAlt size={16} className='text-red-500 cursor-pointer hover:text-red-700' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OwnerItemCard