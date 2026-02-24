import React, { use, useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function useGetCurrentUser() {
    const dispatch = useDispatch();
  useEffect(() => {
    
    const fetchUser = async () => {
    try{
            const result= await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true});
            dispatch(setUserData(result.data.user)); // Store user data in Redux store
            console.log("Current user data", result.data.user);
        }
        catch(err){
            console.error(err);
                dispatch(setUserData(null)); // Clear user data from Redux store if not authenticated
        }
    }
    fetchUser();
  }, []);
}

export default useGetCurrentUser