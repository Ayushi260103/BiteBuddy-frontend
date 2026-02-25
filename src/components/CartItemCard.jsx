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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-200 gap-4">

            {/* Left side */}
            <div className="flex items-center gap-4">
                <img
                    src={data.image}
                    alt={data.name}
                    className="w-20 h-20 object-cover rounded-xl border"
                />

                <div className="space-y-1">
                    <h1 className="font-semibold text-gray-800 leading-tight">
                        {data.name}
                    </h1>

                    <p className="text-gray-500 text-sm">
                        ₹{data.price} × {data.quantity}
                    </p>

                    <p className="text-gray-900 font-bold text-lg">
                        ₹{data.price * data.quantity}
                    </p>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1">
                    <button
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        onClick={() => handleDecrease(data.id, data.quantity)}
                    >
                        <FaMinus size={12} />
                    </button>

                    <span className="min-w-[20px] text-center font-medium text-sm">
                        {data.quantity}
                    </span>

                    <button
                        className="p-2 rounded-full hover:bg-gray-200 transition"
                        onClick={() => handleIncrease(data.id, data.quantity)}
                    >
                        <FaPlus size={12} />
                    </button>
                </div>

                <button
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                    onClick={handleRemoveFromCart}
                    title="Remove item"
                >
                    <CiTrash size={18} />
                </button>
            </div>
        </div>

    )
}

export default CartItemCard