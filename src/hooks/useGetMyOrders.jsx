import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyOrders} from '../redux/userSlice.js';
import { useSelector } from 'react-redux';

function useGetMyOrders() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user); // Access user data from Redux store
    useEffect(() => {

        const fetchOrders = async () => {
            if (!userData ) return; // Only fetch if user exists
            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`, { withCredentials: true });
                dispatch(setMyOrders(result.data)); // Store order data in Redux store
                console.log("Current user orders data", result.data);
            }
            catch (err) {
                console.error("Fetch my orders error:", err);
            }
        }
        fetchOrders();
    }, [userData]);
}

export default useGetMyOrders;