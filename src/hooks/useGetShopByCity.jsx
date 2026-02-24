import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setShopsInMyCity} from '../redux/userSlice.js';
import { useSelector } from 'react-redux';

function useGetShopByCity() {
    const dispatch = useDispatch();
    const {currentCity} = useSelector((state) => state.user);
  useEffect(() => {
    
    const fetchShopByCity = async () => {
    try{
            const result= await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`, {withCredentials: true});
            dispatch(setShopsInMyCity(result.data));
            console.log("shop by city data", result.data);
        }
        catch(err){
            console.error(err);
        }
    }
    fetchShopByCity();
  }, [currentCity]);
}

export default useGetShopByCity