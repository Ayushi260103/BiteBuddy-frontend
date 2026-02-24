import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCurrentCity, setCurrentState, setCurrentAddress } from '../redux/userSlice';
import { useSelector } from 'react-redux';
import { setAddress, setLocation } from '../redux/mapSlice';


function useGetCity() {
  const dispatch = useDispatch()
  const {userData} = useSelector((state) => state.user); // Access user data from Redux store
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async (position)=>{
        console.log("geolocation",position)
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude; 

        // for checkout page map
        dispatch(setLocation({lat: latitude, lng: longitude}));

        const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${import.meta.env.VITE_GEOAPIKEY}`);
        console.log("API dataresult", result);

        const city = result?.data?.results[0]?.city;
        console.log("city",city);
        dispatch(setCurrentCity(city));

        const state = result?.data?.results[0]?.state;
        dispatch(setCurrentState(state));

        const address= (result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1);
        dispatch(setCurrentAddress(address));

        //for checkout map page
        dispatch(setAddress(address));
    })
  },[userData])
}

export default useGetCity