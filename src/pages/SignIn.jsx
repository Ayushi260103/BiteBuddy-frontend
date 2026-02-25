import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import { auth } from '../../firebase.js';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

function SignIn() {
    const primaryColor = '#ff4d2d';
    const hoverColor = '#e64323';
    const bgColor = '#fff9f6';
    const borderColor = '#ddd';
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Please fill all the fields");
            return;
        }
        setLoading(true);
        try {

            //ya fetch ya own pkg axios
            const result = await axios.post(`${serverUrl}/api/auth/signin`, {
                email,
                password
            }, { withCredentials: true });//withCredentials:true is used to send cookies from frontend to backend and vice versa
            dispatch(setUserData(result.data)); // Store user data in Redux store
            setError('');
            setLoading(false);
            console.log("Signin successful", result.data);
        } catch (error) {
            setLoading(false);
            setError(error.response?.data?.message || "Error signing in");
            console.log("Error signing in", error.response?.data);

        }

    }

    const handleGoogleAuth = async () => {

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google sign in Result", result);
        console.log("Google sign in Result.user", user);
        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                email: user.email,
            }, { withCredentials: true });
            dispatch(setUserData(data)); // Store user data in Redux store
            setError('');
            console.log("Google sign in successful Result", data);
        } catch (error) {
            setError(error.response?.data?.message || "Error signing in with Google");
            console.log("Error signing in with Google", error);
        }
    }
    return (
        <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2">

            {/* LEFT IMAGE */}
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
                        <h1 className="text-4xl font-bold mb-3">Welcome to Bite Buddy</h1>
                        <p className="text-lg opacity-90">
                            Delicious food delivered right to your door
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT / FORM */}
            <div
                className="relative flex items-center justify-center p-6"
                style={{ backgroundColor: bgColor }}
            >

                {/* MOBILE BACKGROUND IMAGE */}
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
                        Sign in to your account to get started with delicious food deliveries
                    </p>

                    {/* EMAIL */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                                placeholder="Enter your password"
                                required
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

                    <div
                        className="cursor-pointer text-right mb-4 text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </div>

                    {/* SIGN IN */}
                    <button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {loading ? <ClipLoader size={20} /> : "Sign In"}
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
                        Sign In with Google
                    </button>

                    <p
                        className="cursor-pointer text-center text-gray-600 mt-6"
                        onClick={() => navigate("/signup")}
                    >
                        New user?{" "}
                        <span
                            className="font-semibold"
                            style={{ color: primaryColor }}
                        >
                            Create an account
                        </span>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default SignIn