import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux';
import { FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa6';
import OwnerItemCard from './OwnerItemCard';

function OwnerDashboard() {
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner); // Access shop data from Redux store for shop owners
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#fff9f6] to-[#fff1ec] flex flex-col items-center">
      <Nav />

      {!myShopData ? (
        /* EMPTY STATE – ADD SHOP */
        <div className="flex flex-1 justify-center items-center px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-50 p-5 rounded-full mb-5">
                <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                You haven’t added your restaurant yet. Set up your shop and start
                sharing your delicious food with customers.
              </p>

              <button
                onClick={() => navigate("/create-edit-shop")}
                className="w-full py-3 bg-[#ff4d2d] text-white rounded-xl font-semibold hover:bg-[#e04324] transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD */
        <div className="w-full flex flex-col items-center gap-8 px-4 sm:px-6 pb-10">

          {/* HEADER */}
          <div className="mt-8 flex items-center gap-4 text-center">
            <FaUtensils className="text-[#ff4d2d] w-12 h-12 sm:w-16 sm:h-16" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Welcome, {myShopData.name}
            </h1>
          </div>

          {/* SHOP CARD */}
          <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-md hover:shadow-2xl transition-all">

            {/* EDIT BUTTON */}
            <button
              onClick={() => navigate("/create-edit-shop")}
              className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-3 rounded-full shadow-md hover:bg-orange-600 transition"
            >
              <FaPen size={18} />
            </button>

            {/* IMAGE */}
            <img
              src={myShopData.image}
              alt={myShopData.name}
              className="w-full h-52 sm:h-64 object-cover"
            />

            {/* DETAILS */}
            <div className="p-6 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {myShopData.name}
              </h2>
              <p className="text-sm text-gray-500">
                {myShopData.city}, {myShopData.state}
              </p>
              <p className="text-sm text-gray-500">{myShopData.address}</p>
            </div>
          </div>

          {/* EMPTY MENU STATE */}
          {myShopData.items?.length === 0 && (
            <div className="flex justify-center items-center w-full">
              <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-orange-100 shadow-md hover:shadow-xl transition">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-orange-50 p-5 rounded-full mb-5">
                    <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Item
                  </h2>

                  <p className="text-gray-600 text-sm mb-6">
                    Start building your menu by adding delicious food items for
                    customers to explore.
                  </p>

                  <button
                    onClick={() => navigate("/add-item")}
                    className="w-full py-3 bg-[#ff4d2d] text-white rounded-xl font-semibold hover:bg-[#e04324] transition"
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ITEM LIST */}
          {myShopData.items?.length > 0 && (
            <div className="w-full max-w-3xl flex flex-col gap-4 items-center">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>

  )
}

export default OwnerDashboard