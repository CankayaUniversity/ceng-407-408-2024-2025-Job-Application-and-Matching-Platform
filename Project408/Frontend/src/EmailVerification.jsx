import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RightIllustration from "./components/RightIllustration";
import illustration from "./assets/Saly-10.png";

const EmailVerification = () => {
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [message, setMessage] = useState("");
    const [resendMsg, setResendMsg] = useState("");
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const updated = [...digits];
        updated[index] = value;
        setDigits(updated);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = digits.join("");

        try {
            const response = await axios.post("http://localhost:8080/api/verify-email", { code });

            if (response.data.success) {
                setMessage("✅ Email verified! Redirecting...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage("❌ Invalid or expired code.");
            }
        } catch (err) {
            setMessage("🚫 An error occurred. Please try again.");
        }
    };

    const handleResend = async () => {
        try {
            await axios.post("http://localhost:8080/api/resend-code", {
                email: localStorage.getItem("email"),
            });
            setResendMsg("✅ Verification code resent to your email.");
        } catch {
            setResendMsg("🚫 Failed to resend code.");
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side */}
            <div className="w-1/2 bg-white p-10 flex items-center justify-center">
                <div className="w-full max-w-[360px]">
                    <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        We have sent a verification link/code to your email. <br />
                        Please check your inbox and enter the code below.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "8px",
                                marginBottom: "24px",
                                flexWrap: "wrap", // küçük ekranlarda kaymaması için
                            }}
                        >
                            {digits.map((digit, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    ref={(el) => (inputsRef.current[i] = el)}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    style={{
                                        width: "40px",
                                        height: "40px", // kare görünüm
                                        textAlign: "center",
                                        fontSize: "18px",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        outline: "none",
                                        transition: "border 0.2s ease-in-out",
                                        backgroundColor: "#fff",
                                    }}
                                    onFocus={(e) => (e.target.style.border = "1px solid #0C21C1")}
                                    onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
                                />
                            ))}
                        </div>


                        <button
                            type="submit"
                            className="w-full bg-[#0C21C1] text-white py-3 rounded-full hover:bg-[#0a1ba6] transition mb-4"
                        >
                            Verify
                        </button>
                    </form>

                    {/* Ortalanmış yeniden gönder butonu */}
                    <div className="flex justify-center">
                        <button
                            onClick={handleResend}
                            className="bg-gray-100 hover:bg-gray-200 text-sm px-6 py-2 rounded transition"
                        >
                            Send Again
                        </button>
                    </div>

                    {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
                    {resendMsg && <p className="mt-2 text-green-600 text-sm">{resendMsg}</p>}
                </div>
            </div>


            {/* Right Side */}
            <RightIllustration illustration={illustration} />
        </div>
    );
};

export default EmailVerification;
