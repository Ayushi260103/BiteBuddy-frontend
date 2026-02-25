import React from 'react'
import { useSelector } from 'react-redux';
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard';
import OwnerDashboard from '../components/OwnerDashboard';
import UserDashboard from '../components/UserDashboard';

function Home() {
  const { userData } = useSelector((state) => state.user); // Access user data from Redux store
  console.log("User data:", userData);


  return (
    <>
      {!userData ?
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#fff9f6]">

          {/* Spinner */}
          <div className="w-14 h-14 rounded-full border-4 border-[#ff4d2d]/30 border-t-[#ff4d2d] animate-spin"></div>

          {/* Text */}
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading your dashboard
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Preparing something delicious 🍔
          </p>

        </div> :
        <div className='w-full min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
          {userData.role == "user" && <UserDashboard />}
          {userData.role == "owner" && <OwnerDashboard />}
          {userData.role == "deliveryBoy" && <DeliveryBoyDashboard />}
        </div>
      }
    </>
  )
}

export default Home