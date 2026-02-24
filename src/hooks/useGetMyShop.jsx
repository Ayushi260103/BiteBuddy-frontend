import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';
import { useSelector } from 'react-redux';

function useGetMyShop() {
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user); // Access user data from Redux store
    useEffect(() => {

        const fetchShop = async () => {
            if (!userData || userData.role !== 'owner') return; // Only fetch if user is an owner
            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-my`, { withCredentials: true });
                dispatch(setMyShopData(result.data)); // Store user data in Redux store
                console.log("Current shop owner data", result.data);
            }
            catch (err) {
                console.error("Fetch shop error:", err);
                dispatch(setMyShopData(null)); // Clear user data from Redux store if not authenticated
            }
        }
        fetchShop();
    }, [userData, dispatch]);
}

export default useGetMyShop;