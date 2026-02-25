import React from 'react'
import { FaLeaf } from 'react-icons/fa';
import { FaDrumstickBite } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaRegStar } from 'react-icons/fa6';
import { FaMinus } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';

function FoodCard({ data }) {
    const dispatch = useDispatch();
    const { cartItems } = useSelector(state => state.user);
    const [quantity, setQuantity] = React.useState(0);

    const renderStarts = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
                stars.push(<FaStar key={i} className='text-yellow-500 text-lg' />);
            }
            else {
                stars.push(<FaRegStar key={i} className='text-yellow-500 text-lg' />);
            }
        }
        return stars;
    }

    const handleIncrease = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
    }

    const handleDecrease = () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
        }
    }

    const handleAddToCart = () => {
        if (quantity > 0) {
            dispatch(addToCart({
                id: data._id,
                name: data.name,
                price: data.price,
                image: data.image,
                shop: data.shop,
                quantity: quantity,
                foodType: data.foodType
            }));
        }
    }

    return (
        <div className="w-[260px] rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
            <div className="relative w-full h-[180px] bg-gray-100 overflow-hidden">
                <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
                    {data.foodType === "veg" ? <FaLeaf className='text-green-500 text-l' /> : <FaDrumstickBite className='text-red-500 text-l' />}
                </div>
                <img src={data.image} alt={data.name} className='w-full h-full object-cover transition-transform duration-300 hover:scale-105' />
            </div>

            <div className="flex flex-col p-4 gap-1">
                <h1 className='"font-semibold text-gray-900 text-base line-clamp-1 truncate'>{data.name}</h1>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                    {renderStarts(data.rating?.average || 0)}
                    <span className='text-xs text-gray-500'>
                        {data.rating?.count || 0} {data.rating?.count === 1 ? "rating" : "ratings"}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-4 mt-auto">
                <span className="text-lg font-bold text-gray-900">
                    ₹{data.price}
                </span>
                <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
                    <button className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer' onClick={handleDecrease}>
                        <FaMinus size={12} />
                    </button>
                    <span className='px-2 py-1 text-sm'>{quantity}</span>
                    <button className='px-2 py-1 hover:bg-gray-100 transition cursor-pointer' onClick={handleIncrease}>
                        <FaPlus size={12} />
                    </button>
                    <button className={`  ${cartItems.some(item => item.id === data._id) ? "bg-gray-800" : "bg-[#ff4d2d]"} text-white p-2 rounded-full hover:scale-105 transition cursor-pointer`}
                        onClick={handleAddToCart}>
                        <FaShoppingCart />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FoodCard