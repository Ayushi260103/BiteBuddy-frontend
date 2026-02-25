import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { FaUtensils } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice.js';
import ClipLoader from "react-spinners/ClipLoader";

function CreateEditShop() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { myShopData } = useSelector((state) => state.owner); // Access shop data from Redux store for shop owners
    const { currentCity, currentState, currentAddress } = useSelector((state) => state.user); // Access current city and state from Redux store for user

    const [name, setName] = React.useState(myShopData?.name || "");
    const [frontendImage, setFrontendImage] = React.useState(myShopData?.image || null);
    const [backendImage, setBackendImage] = React.useState(null);
    const [city, setCity] = React.useState(myShopData?.city || currentCity);
    const [state, setState] = React.useState(myShopData?.state || currentState);
    const [address, setAddress] = React.useState(myShopData?.address || currentAddress);
    const [loading, setLoading] = React.useState(false);
    const ImageRef = React.useRef();


    const handleImage = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("city", city);
            formData.append("state", state);
            formData.append("address", address);
            if (backendImage) {
                formData.append("image", backendImage);
            }
            const result = await axios.post(`${serverUrl}/api/shop/create-edit-shop`, formData, {
                withCredentials: true,
            })
            dispatch(setMyShopData(result.data)); // Update shop data in Redux store after creation or editing
            setLoading(false);
            navigate("/"); // Navigate back to home page after successful shop creation or editing
        } catch (err) {
            setLoading(false);
            console.error(err.response?.data);
        }
    }
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 px-4">

  {/* BACK BUTTON */}
  <button
    onClick={() => navigate("/")}
    className="absolute top-6 left-6 p-2 rounded-full hover:bg-orange-100 transition"
  >
    <IoIosArrowRoundBack size={36} className="text-[#ff4d2d]" />
  </button>

  {/* CARD */}
  <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 border border-orange-100 mt-10">

    {/* HEADER */}
    <div className="flex flex-col items-center mb-8">
      <div className="bg-orange-100 p-4 rounded-full mb-4 shadow-sm">
        <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        {myShopData ? "Edit Restaurant" : "Add Restaurant"}
      </h1>
      <p className="text-sm text-gray-500 mt-1">
        Manage your restaurant details
      </p>
    </div>

    {/* FORM */}
    <form className="space-y-6" onSubmit={handleSubmit}>

      {/* SHOP NAME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop Name
        </label>
        <input
          type="text"
          placeholder="Enter your shop name"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>

      {/* IMAGE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop Image
        </label>

        <input
          type="file"
          accept="image/*"
          className="w-full text-sm px-4 py-2 border border-gray-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-200"
          onChange={handleImage}
        />

        {frontendImage && (
          <div className="mt-4 relative group">
            <img
              src={frontendImage}
              alt="Shop"
              className="w-full h-[220px] object-cover rounded-xl border cursor-pointer"
              onClick={() => ImageRef.current.click()}
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-sm font-medium">
              Click to change image
            </div>
          </div>
        )}
      </div>

      {/* CITY & STATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="Enter your shop city"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
            onChange={(e) => setCity(e.target.value)}
            value={city}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            placeholder="Enter your shop state"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
            onChange={(e) => setState(e.target.value)}
            value={state}
          />
        </div>
      </div>

      {/* ADDRESS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          type="text"
          placeholder="Enter your shop address"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full flex justify-center items-center gap-2 bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <ClipLoader size={22} color="#fff" /> : "Save"}
      </button>
    </form>
  </div>
</div>

    )
}

export default CreateEditShop