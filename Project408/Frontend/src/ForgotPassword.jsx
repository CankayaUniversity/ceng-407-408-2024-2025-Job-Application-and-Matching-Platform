import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Toast from "./components/Toast.jsx";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };

    const sendResetCode = async () => {
        try {
            await axios.post("http://localhost:9090/login/send-reset-code", { email });
            setStep(2);
            console.log("Verification code sent to your email.");
            // setMessage('Verification code sent to your email.');
            // setShowToast(true);
        } catch (error) {
            setMessage('Error sending reset code.');
            setShowToast(true);
        }
    };

    const resetPassword = async () => {
        try {
            await axios.post("http://localhost:9090/login/reset-password", { email, code, newPassword });
            console.log("Password reset successful!");
            setStep(1);
            setEmail(""); setCode(""); setNewPassword("");
            navigate("/login");  // burası yönlendirme kısmı

        } catch (error) {
            setMessage('Error resetting password.');
            setShowToast(true);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mx-auto flex flex-col items-center">

                {step === 1 ? (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-4">Did you forget your password?</h2>

                        <p className="text-xl text-gray-600 mb-6 text-center">
                            Enter your email address and we'll send you a verification code to reset your password.
                        </p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-1/4 border border-gray-300 p-2 rounded  bg-white text-black mb-4"
                        />
                        <button
                            onClick={sendResetCode}
                            className="w-64 bg-[#0C21C1] text-white py-2 rounded hover:bg-[#0a1ba6] mb-4"
                        >
                            Send Reset Code
                        </button>

                        {/* Login sayfasına dön butonu */}
                        <button
                            onClick={() => {
                                setEmail("");
                                setCode("");
                                setNewPassword("");
                                navigate('/login'); // en son yönlendirme
                            }}
                            className="text-blue-600 hover:underline mt-2 "
                        >
                            &larr; Back to Login
                        </button>


                        <Toast message={message} show={showToast} onClose={handleCloseToast}/>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-4">Reset your password</h2>
                        <p className="text-sm text-gray-600 mb-6 text-center ">
                            Enter the verification code sent to your email and choose a new password.
                        </p>

                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="w-1/4 border border-gray-300 p-2 rounded mb-4 bg-white text-black"
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-1/4 border border-gray-300 p-2 rounded mb-4 bg-white text-black"
                        />
                        <button
                            onClick={resetPassword}
                            className="w-64 bg-[#0C21C1] text-white py-2 rounded hover:bg-[#0a1ba6] mb-4"
                        >
                            Reset Password
                        </button>

                        <button
                            onClick={() => setStep(1)}
                            className="ttext-blue-600 hover:underline mt-2"
                        >
                            &larr; Go Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
