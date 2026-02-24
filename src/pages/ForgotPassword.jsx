import { useState } from "react"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App"
import ClipLoader from "react-spinners/ClipLoader"


function ForgotPassword() {
    const [step, setStep] = useState(1); //at 1st step
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!email) {
            setError("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/send-otp`, { email }, { withCredentials: true });
            console.log("OTP sent successfully", result.data);
            setStep(2); //move to next step to verify OTP
            setError('');
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Error sending OTP");
            console.error("Error sending OTP:", error);
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp }, { withCredentials: true });
            console.log("OTP verified successfully", result.data);
            setStep(3); //move to next step to reset password
            setError('');
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Error verifying OTP");
            console.error("Error verifying OTP:", error);
        }
    }

    const handleResetPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const result = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true });
            console.log("Password reset successfully", result.data);

            Navigate("/signin"); //navigate to sign in page after successful password reset
            setError('');
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || "Error resetting password");
            console.error("Error resetting password:", error);
        }
    }
    return (
        <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-[1px] border-[#ddd]">
                <div className="flex items-center gap-4 mb-4">
                    <IoIosArrowRoundBack onClick={() => Navigate("/signin")} size={30} className="cursor-pointer text-[#ff4d2d]" />
                    <h1 className="text-2xl font-bold mb-2 text-[#ff4d2d]">Forgot Password</h1>
                </div>

                {/* email */}
                {step == 1
                    &&
                    <div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                                placeholder="Enter your email address" />
                        </div>
                        <button onClick={handleSendOtp} className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg cursor-pointer hover:bg-[#ff3a1a] transition duration-300">
                        {loading ? <ClipLoader size={20}  /> : "Send Otp"}  </button>
                        {error !== "" && <p className="text-red-500 text-center">*{error}</p>}
                    </div>
                }

                {/* Enter Otp */}
                {step == 2
                    &&
                    <div>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700 mb-2">OTP</label>
                            <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                                placeholder="Enter your OTP" />
                        </div>
                        <button onClick={handleVerifyOtp} className="cursor-pointer w-full bg-[#ff4d2d] text-white py-2 rounded-lg hover:bg-[#ff3a1a] transition duration-300">
                        {loading ? <ClipLoader size={20}  /> : "Verify"}</button>
                        {error !== "" && <p className="text-red-500 text-center">*{error}</p>}

                    </div>
                }

                {/* Enter New Password */}
                {step == 3
                    &&
                    <div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
                            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                                placeholder="Enter your new password" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmNewPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
                            <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                                placeholder="Confirm your new password" />
                        </div>
                        <button onClick={handleResetPassword} className="cursor-pointer w-full bg-[#ff4d2d] text-white py-2 rounded-lg hover:bg-[#ff3a1a] transition duration-300">
                        {loading ? <ClipLoader size={20}  /> : "Reset Password"}</button>
                        {error !== "" && <p className="text-red-500 text-center">*{error}</p>}
                    </div>
                }
            </div>
        </div>
    )
}

export default ForgotPassword