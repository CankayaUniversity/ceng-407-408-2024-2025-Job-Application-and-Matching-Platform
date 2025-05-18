/* Güncellenen SignUp.jsx */

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
import RightIllustration from "./components/RightIllustration";
import illustration from './assets/Saly-10.png';
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "CANDIDATE"
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const endpoint = formData.userType === "CANDIDATE"
      ? "http://localhost:9090/login/canRegister"
      : "http://localhost:9090/login/empRegister";

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("✅ Kayıt başarılı:", response.data);
      setVerificationStep(true);
      setEmailToVerify(formData.email);
    } catch (error) {
      console.error("❌ Kayıt hatası:", error.response?.data || error.message);
      setErrorMessage("An error occurred during registration. Please make sure all fields are filled.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post("http://localhost:9090/login/verify", {
        email: emailToVerify,
        verificationCode: verificationCode
      });
      console.log("✅ Doğrulama başarılı:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("❌ Doğrulama hatası:", err.response?.data || err.message);
      setError("Verification failed. Please check the code and try again.");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await axios.post("http://localhost:9090/login/resend", {
        email: emailToVerify
      });
      console.log("🔁 Kod tekrar gönderildi:", response.data);
      setResendMessage("Verification code has been resent to your email.");
    } catch (err) {
      console.error("❌ Kod gönderme hatası:", err.response?.data || err.message);
      setResendMessage("Failed to resend verification code.");
    }
  };

  if (verificationStep) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mx-auto flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4 text-center">Verify Your Email</h2>
          <p className="text-sm text-gray-600 mb-4 text-center">
            A verification code has been sent to <strong>{emailToVerify}</strong>.
          </p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-1/4 border border-gray-300 p-2 rounded mb-4 bg-white text-black"
          />

          <button
            onClick={handleVerifyCode}
            className="w-64 bg-[#0C21C1] text-white py-2 rounded hover:bg-[#0a1ba6] mb-2"
          >
            Verify
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {resendMessage && <p className="text-green-600 mt-2">{resendMessage}</p>}

          <button
            onClick={handleResendCode}
            className="text-sm text-blue-600 mt-4 hover:underline"
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className="w-1/2 bg-white flex items-center justify-center p-10">

        <div
          className="w-full max-w-[400px]"
          style={{
            maxHeight: 'calc(100vh - 80px)',
            overflowY: 'auto',
            paddingRight: '8px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(226, 219, 219, 0.42) transparent',
          }}
        >

          <div style={{ padding: '0 0.25rem' }}>

            <h2 className="text-3xl font-bold mb-4">Sign up</h2>
            <p className="text-sm text-gray-600 mb-6">
              If you already have an account register<br />
              You can <Link to="/login" className="text-blue-600 hover:underline">Login here !</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                <label htmlFor="firstName" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                  Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '2px solid #ccc',
                    padding: '8px 0',
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    color: '#000'
                  }}
                  onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                  onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                />
              </div>

              {/* Surname */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                <label htmlFor="lastName" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                  Surname
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your Surname"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '2px solid #ccc',
                    padding: '8px 0',
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    color: '#000'
                  }}
                  onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                  onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                />
              </div>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
                <label htmlFor="email" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your Email"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '2px solid #ccc',
                    padding: '8px 0',
                    outline: 'none',
                    fontSize: '16px',
                    backgroundColor: 'transparent',
                    color: '#000'
                  }}
                  onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                  onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                <label htmlFor="password" style={{ marginBottom: '6px', fontWeight: '500', fontSize: '16px', color: '#333' }}>
                  Password
                </label>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your Password"
                    style={{
                      width: '100%',
                      border: 'none',
                      borderBottom: '2px solid #ccc',
                      padding: '8px 36px 8px 0',
                      outline: 'none',
                      fontSize: '16px',
                      backgroundColor: 'transparent',
                      color: '#000'
                    }}
                    onFocus={(e) => e.target.style.borderBottom = '2px solid #0C21C1'}
                    onBlur={(e) => e.target.style.borderBottom = '2px solid #ccc'}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#666'
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>

                {/* Açıklama metni */}
                <p style={{
                  fontSize: '12px',
                  color: '#888',
                  margin: '4px 0 8px 0', // üst boşluğu azalttık
                  lineHeight: '1.4'
                }}>
                  Your password must be at least 8 characters and include a number and a special character.
                </p>

              </div>


              {/* backgroundColor: "#F8F8F8" */}
              <div
                style={{ backgroundColor: "#F8F8F8", borderRadius: "10px", marginBottom: '16px', padding: '5px' }}
              >
                <label
                  style={{ color: "#0C21C1" }}
                  className="mb-1 font-medium text-sm">I want to</label>
                <div className="flex gap-6 mt-1">
                  <label
                    style={{ marginRight: "20px" }}
                    className="flex items-center text-sm">
                    <input
                      style={{ marginRight: "4px" }}
                      type="radio" name="userType" value="CANDIDATE" checked={formData.userType === "CANDIDATE"} onChange={handleChange} className="mr-2" />Find a job
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      style={{ marginRight: "4px" }}
                      type="radio" name="userType" value="EMPLOYER" checked={formData.userType === "EMPLOYER"} onChange={handleChange} className="mr-2" />Hire talent
                  </label>
                </div>
              </div>

              <button style={{ marginTop: '10px', marginBottom: '20px' }} type="submit" className="w-full bg-[#0C21C1] text-white py-3 rounded-full hover:bg-[#0a1ba6] transition">Sign Up</button>
            </form>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="mt-8 text-center">
              {/* or sign up with */}
              <div className="flex items-center mb-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-sm text-gray-500">or sign up with</span>
                <hr className="flex-grow border-gray-300" />
              </div>
              <div className="flex justify-center gap-6">
                <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGithub size={24}
                  className="text-black" />
                </button>
                <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGoogle size={24}
                  className="text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Illustration */}
      <RightIllustration illustration={illustration} />
    </div>
  );
}
