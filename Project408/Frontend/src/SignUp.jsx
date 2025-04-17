import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useState } from "react";
import illustration from './assets/illustration.png';
import axios from "axios";


console.log('Illustration path:', illustration);

export default function SignUp() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "CANDIDATE" // Default olarak iş arayan
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:9090/login/canRegister", // backend endpoint'in
        formData
      );
      console.log("✅ Kayıt başarılı:", response.data);
      navigate("/login"); // Kayıt başarılı olduğunda login sayfasına yönlendir
    } catch (error) {
      console.error("❌ Kayıt hatası:", error.response?.data || error.message);

      // navigate("/login"); // şimdilik diğer sayfaya ulaşmak için eklendi, burası sonra silinecek!!!
    }
  };



  return (
    <div className="flex min-h-screen">

    {/* Left: Form */}
    <div className="w-1/2 bg-white p-10 flex items-center justify-center">
      <div className="w-full max-w-[400px]">
          <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
          <p className="text-sm text-gray-600 mb-8">
            <p className="text-sm text-gray-600 mb-8">
            If you already have an account register
            <br />
            You can{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
                Login here !
            </Link>
            </p>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
  {/* Name */}
  <div className="flex flex-col">
    <label htmlFor="firstName" className="text-sm font-semibold text-gray-800 mb-1">
      Name
    </label>
    <input
      type="text"
      id="firstName"
      name="firstName"
      placeholder="Enter your Name"
      value={formData.firstName}
      onChange={handleChange}
      className="border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none p-1 placeholder-gray-500"
    />
  </div>

  {/* Surname */}
  <div className="flex flex-col">
    <label htmlFor="surname" className="text-sm font-semibold text-gray-800 mb-1">
      Surname
    </label>
    <input
      type="text"
      id="lastName"
      name="lastName"
      placeholder="Enter your Surname"
      value={formData.lastName}
      onChange={handleChange}
      className="border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none p-1 placeholder-gray-500"
    />
  </div>

  {/* Email */}
  <div className="flex flex-col">
    <label htmlFor="email" className="text-sm font-semibold text-gray-800 mb-1">
      Email
    </label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="Enter your Email"
      value={formData.email}
      onChange={handleChange}
      className="border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none p-1 placeholder-gray-500"
    />
  </div>

  {/* Password */}
  <div className="flex flex-col">
    <label htmlFor="password" className="text-sm font-semibold text-gray-800 mb-1">
      Password
    </label>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Enter your Password"
      value={formData.password}
      onChange={handleChange}
      className="border-0 border-b border-gray-400 focus:border-blue-600 focus:outline-none p-1 placeholder-gray-500"
    />
  </div>
  
  {/* User Type */}
  <div className="flex flex-col">
    <label htmlFor="userType" className="text-sm font-semibold text-gray-800 mb-1">
      I want to
    </label>
    <div className="flex gap-4 mt-2">
      <label className="flex items-center">
        <input
          type="radio"
          name="userType"
          value="CANDIDATE"
          checked={formData.userType === "CANDIDATE"}
          onChange={handleChange}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Find a job</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          name="userType"
          value="EMPLOYER"
          checked={formData.userType === "EMPLOYER"}
          onChange={handleChange}
          className="mr-2"
        />
        <span className="text-sm text-gray-700">Hire talent</span>
      </label>
    </div>
  </div>

  <p className="text-xs text-gray-500">
    Your password must be at least 8 characters and include a number and a special character.
  </p>

  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors"
  >
    Sign Up
  </button>
</form>



          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">or sign up with</p>
            <div className="flex justify-center gap-6">
              <button className="p-2 hover:opacity-80 transition-opacity">
                <FaGithub size={24} className="text-gray-700" />
              </button>
              <button className="p-2 hover:opacity-80 transition-opacity">
                <FaGoogle size={24} className="text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="w-1/2 bg-[#1849C6] flex items-center justify-center relative">
        <div className="absolute top-8 right-8">
          <span className="text-white font-semibold">Logo</span>
        </div>
        <img
          src={illustration}
          alt="Illustration"
          className="w-3/4 max-w-[400px]"
          onError={(e) => {
            console.error('Image failed to load:', e);
            console.log('Image src:', e.target.src);
          }}
        />
      </div>
    </div>
  );
}