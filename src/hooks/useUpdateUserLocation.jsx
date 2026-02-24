import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { serverUrl } from '../App';


function useUpdateUserLocation() {
  const dispatch = useDispatch()
  const {userData} = useSelector((state) => state.user); // Access user data from Redux store
  useEffect(()=>{
    const updateLocation = async (lat,lon) =>{
        const result = await axios.post(`${serverUrl}/api/user/update-location`,
            {lat,lon},{withCredentials:true});
        console.log(result.data);
    }

    //run this function whenever lat lon changes
    navigator.geolocation.watchPosition((pos)=>{
        updateLocation(pos.coords.latitude, pos.coords.longitude);
    })
  },[userData])
}

export default useUpdateUserLocation;