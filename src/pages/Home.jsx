import React from 'react'
import { useSelector } from 'react-redux';
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import UserDashboard from '../components/UserDashboard';        

function Home() {
    const {userData} = useSelector((state) => state.user); // Access user data from Redux store
    console.log("User data:", userData);
      if (!userData) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }
  return (
    <div className='w-full min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
        {userData.role == "user" && <UserDashboard/>}
        {userData.role == "owner" && <OwnerDashboard/>}
        {userData.role == "deliveryBoy" && <DeliveryBoyDashboard/>}
    </div>
  )
}

export default Home