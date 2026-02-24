import React from 'react'
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { auth } from '../../firebase.js';
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from 'react-redux';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setUserData } from '../redux/userSlice.js';


function SignUp() {
    const primaryColor = '#ff4d2d';
    const hoverColor = '#e64323';
    const bgColor = '#fff9f6';
    const borderColor = '#ddd';
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Default role is 'user'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if(!fullName || !email || !mobile || !password){
            setError("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {

            //ya fetch ya own pkg axios
            const result = await axios.post(`${serverUrl}/api/auth/signup`, {
                fullName,
                email,
                mobile,
                password,
                role
            }, { withCredentials: true });//withCredentials:true is used to send cookies from frontend to backend and vice versa
            dispatch(setUserData(result.data)); // Store user data in Redux store
            setError('');
            setLoading(false);
            console.log("Signup successful", result.data);
        } catch (error) {
            setError(error.response?.data?.message || "Error signing up");
            console.log("Error signing up", error.response?.data);

        }

    }

    const handleGoogleAuth = async () => {
        if (!mobile) {
            setError("Please enter mobile number before signing up with Google");
            alert("Please enter mobile number before signing up with Google");
            return;
        }
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google sign up Result", result);
        console.log("Google sign up Result.user", user);
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: user.email,
                fullName: user.displayName,
                mobile,
                role
            }, { withCredentials: true });
            dispatch(setUserData(data)); // Store user data in Redux store
            setError('');
            console.log("Google sign up successful Result", data);
        } catch (error) {
            setError(error.response?.data?.message || "Error signing up with Google");
            console.log("Error signing up with Google", error);
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4' style={{ backgroundColor: bgColor }}>
            <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `} style={{ border: `1px solid ${borderColor}` }}>
                <h1 className={`text-3xl font-bold mb-2 `} style={{ color: primaryColor }}>Bite Buddy</h1>
                <p className="text-gray-600 mb-8">Create your account to get started with delicious food deliveries</p>

                {/* fullname */}
                <div className="mb-4">
                    <label htmlFor="fullname" className="block text-gray-700 mb-2">Full Name</label>
                    <input required type="text" id="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-orange-500`} placeholder="Enter your full name" />
                </div>
                {/* email */}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-orange-500`} placeholder="Enter your email address" />
                </div>
                {/* mobile */}
                <div className="mb-4">
                    <label htmlFor="mobile" className="block text-gray-700 mb-2">Mobile Number</label>
                    <input required type="text" id="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-orange-500`} placeholder="Enter your mobile number" />
                </div>
                {/* role */}
                <div className="mb-4">
                    <label htmlFor="role" className="block text-gray-700 mb-2">Role</label>
                    <select id="role" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-orange-500`} value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="deliveryBoy">Delivery Boy</option>
                    </select>
                </div>
                {/* password */}
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
                    <div className='relative'>
                        <input required type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-${primaryColor} focus:border-orange-500`} placeholder="Enter your password" />
                        <button type="button" className="absolute cursor-pointer right-3 top-3 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(prev => !prev)}>
                            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                        </button>
                    </div>
                </div>

                <button className={`cursor-pointer mt-6 w-full max-w-md bg-${primaryColor} text-white py-2 rounded-lg hover:bg-${hoverColor} transition-colors duration-300`} style={{ backgroundColor: primaryColor }} onClick={handleSignUp} disabled={loading}>
                {loading ? <ClipLoader size={20}  /> : "Sign Up"}</button>

                {error!=="" && <p className="text-red-500 text-center">*{error}</p>}
                <button className={`cursor-pointer mt-4 w-full max-w-md flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-300`} onClick={handleGoogleAuth}><FcGoogle size={20} /><span>Sign Up with Google</span></button>
                <p className="cursor-pointer text-center text-gray-600 mt-6" onClick={() => navigate("/signin")}>Already have an account? <a href="/signin" className={`text-${primaryColor} hover:text-${hoverColor} font-semibold`} style={{ color: primaryColor }}>Sign In</a></p>
            </div>
        </div>
    )
}

export default SignUp