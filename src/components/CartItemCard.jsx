import React from 'react'
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { CiTrash } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { updateQuantity } from '../redux/userSlice';
import { removeCartItem } from '../redux/userSlice';

function CartItemCard({ data }) {
    const dispatch = useDispatch();

    const handleIncrease = (id, currentQuantity) => {
        dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
    }

    const handleDecrease = (id, currentQuantity) => {
        if (currentQuantity > 1) {
            dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
        }
    }

    const handleRemoveFromCart = () => {
        dispatch(removeCartItem(data.id));
    }
    
    return (
        <div className='flex items-center justify-between bg-white p-4 rounded-xl shadow border'>
            {/* left side*/}
            <div className='flex items-center gap-4'>
                <img src={data.image} alt={data.name} className='w-20 h-20 object-cover rounded-lg border' />
                <div>
                    <h1 className='font-medium text-gray-800'>{data.name}</h1>
                    <p className='text-gray-500 text-sm'>₹{data.price} x {data.quantity}</p>
                    <p className='text-gray-900 font-bold'>₹{data.price * data.quantity}</p>
                </div>
            </div>
            {/* right side */}
            <div className='flex items-center gap-4'>
                <button className='p-2 hover:bg-gray-200 cursor-pointer bg-gray-100 rounded-full'
                    onClick={() => handleDecrease(data.id, data.quantity)}>
                    <FaMinus size={12} />
                </button>
                <span className='px-2 py-1 text-sm'>{data.quantity}</span>
                <button className='p-2 hover:bg-gray-200 cursor-pointer bg-gray-100 rounded-full'
                    onClick={() => handleIncrease(data.id, data.quantity)}>
                    <FaPlus size={12} />
                </button>
                <button className='p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200'
                onClick={handleRemoveFromCart}>
                    <CiTrash size={18} />
                </button>
            </div>
        </div>
    )
}

export default CartItemCard