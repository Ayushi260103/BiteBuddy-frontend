import React, { use } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import useGetCity from './hooks/useGetCity';
import useGetMyShop from './hooks/useGetMyShop';
import CreateEditShop from './pages/CreateEditShop';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import useGetShopByCity from './hooks/UseGetShopByCity'
import useGetItemByCity from './hooks/useGetItemByCity'
import CartPage from './pages/CartPage';
import CheckOut from './pages/CheckOut';
import OrderPlaced from './pages/OrderPlaced';
import MyOrders from './pages/MyOrders';
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateUserLocation from './hooks/useUpdateUserLocation'
import TrackOrder from './pages/TrackOrder'
import Shop from './pages/Shop'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'


//backend url
export const serverUrl = "http://localhost:8000";

function App() {
  useGetCurrentUser(); // Call the hook to fetch current user data
  useGetCity(); // Call the hook to fetch user's city based on geolocation  
  useGetMyShop(); // Call the hook to fetch current shop data for shop owners
  useGetShopByCity(); // Call the hook to fetch shops in user's city
  useGetItemByCity(); // Call the hook to fetch items in user's city
  useGetMyOrders();
  useUpdateUserLocation();

  const dispatch = useDispatch();
  const { userData, authLoading } = useSelector((state) => state.user); // Access user data and loading state from Redux store


  useEffect(() => {
    
    //connect 
    const socketInstance = io(serverUrl, { withCredentials: true });
    dispatch(setSocket(socketInstance));

    socketInstance.on('connect',()=>{
      if(userData){                                                    //emit sends an event to backend, on access an event
        socketInstance.emit('identity', {userId:userData._id});       //emit krenge ek event, "identity" event name is given by us so we need to use this exact name at backend
      }                                                              //will send user id
      console.log(socketInstance.id);
    })
    return () =>{
      socketInstance.disconnect();
    }
  }, [userData?._id]);


  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
      <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
      <Route path="/create-edit-shop" element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />} />
      <Route path="/add-item" element={userData ? <AddItem /> : <Navigate to={"/signin"} />} />
      <Route path="/edit-item/:itemId" element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />
      <Route path="/cart" element={userData ? <CartPage /> : <Navigate to={"/signin"} />} />
      <Route path="/checkout" element={userData ? <CheckOut /> : <Navigate to={"/signin"} />} />
      <Route path="/order-placed" element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />} />
      <Route path="/my-orders" element={userData ? <MyOrders /> : <Navigate to={"/signin"} />} />
      <Route path="/track-order/:orderId" element={userData ? <TrackOrder /> : <Navigate to={"/signin"} />} />
      <Route path="/shop/:shopId" element={userData ? <Shop /> : <Navigate to={"/signin"} />} />

    </Routes>
  )
}

export default App