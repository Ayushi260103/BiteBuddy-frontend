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
        if (!fullName || !email || !mobile || !password) {
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
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">

            {/* LEFT IMAGE (DESKTOP ONLY) */}
            <div
                className="relative hidden md:block"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 flex items-center justify-center h-full text-white text-center px-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-3">Join Bite Buddy</h1>
                        <p className="text-lg opacity-90">
                            Create an account and start enjoying delicious food
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT / FORM */}
            <div
                className="relative flex items-center justify-center p-6"
                style={{ backgroundColor: bgColor }}
            >

                {/* MOBILE IMAGE BACKGROUND */}
                <div
                    className="absolute inset-0 md:hidden"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* FORM CARD */}
                <div
                    className="relative z-10 bg-white/95 backdrop-blur rounded-2xl shadow-xl w-full max-w-md p-8 border"
                    style={{ border: `1px solid ${borderColor}` }}
                >
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{ color: primaryColor }}
                    >
                        Bite Buddy
                    </h1>

                    <p className="text-gray-600 mb-8">
                        Create your account to get started with delicious food deliveries
                    </p>

                    {/* FULL NAME */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                            required
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="Enter your full name"
                        />
                    </div>

                    {/* EMAIL */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* MOBILE */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Mobile Number</label>
                        <input
                            required
                            type="text"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="Enter your mobile number"
                        />
                    </div>

                    {/* ROLE */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                        >
                            <option value="user">User</option>
                            <option value="owner">Owner</option>
                            <option value="deliveryBoy">Delivery Boy</option>
                        </select>
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </button>
                        </div>
                    </div>

                    {/* SIGN UP */}
                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {loading ? <ClipLoader size={20} /> : "Sign Up"}
                    </button>

                    {error && (
                        <p className="text-red-500 text-center mt-3">*{error}</p>
                    )}

                    {/* GOOGLE */}
                    <button
                        onClick={handleGoogleAuth}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
                    >
                        <FcGoogle size={20} />
                        Sign Up with Google
                    </button>

                    {/* REDIRECT */}
                    <p
                        className="cursor-pointer text-center text-gray-600 mt-6"
                        onClick={() => navigate("/signin")}
                    >
                        Already have an account?{" "}
                        <span
                            className="font-semibold"
                            style={{ color: primaryColor }}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default SignUp