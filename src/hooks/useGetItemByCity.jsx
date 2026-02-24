import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App.jsx';
import { useDispatch } from 'react-redux';
import { setItemsInMyCity} from '../redux/userSlice.js';
import { useSelector } from 'react-redux';

function useGetItemByCity() {
    const dispatch = useDispatch();
    const { currentCity, userData } = useSelector((state) => state.user);
  useEffect(() => {
    if (!userData || !currentCity?.trim()) {
      return;
    }

    const fetchItemByCity = async () => {
    try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-city/${encodeURIComponent(currentCity.trim())}`, {withCredentials: true});
            dispatch(setItemsInMyCity(result.data));
            console.log("item by city data", result.data);
        }
        catch(err) {
            console.error(err);
        }
    }
    fetchItemByCity();
  }, [currentCity, userData, dispatch]);
}

export default useGetItemByCity
