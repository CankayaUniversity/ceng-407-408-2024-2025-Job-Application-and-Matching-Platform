/* Güncellenen SignUp.jsx */

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from "react";
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


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const endpoint =
        formData.userType === "CANDIDATE"
            ? "http://localhost:9090/login/canRegister"
            : "http://localhost:9090/login/empRegister";

    try {
      const response = await axios.post(endpoint, formData,{  headers: {
          "Content-Type": "application/json"
        }});
      console.log("✅ Kayıt başarılı:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("❌ Kayıt hatası:", error.response?.data || error.message);
      setErrorMessage("An error occurred during registration. Please make sure all fields are filled.");

    }
  };


  return (
    <div className="flex min-h-screen">
      {/* Left */}
      <div className=" w-1/2 bg-white p-12 flex items-center justify-center">
        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-bold mb-4">Sign up</h2>
          <p className="text-sm text-gray-600 mb-6">
            If you already have an account register<br />
            You can <Link to="/login" className="text-blue-600 hover:underline">Login here !</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-1 font-medium text-sm">Name</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your Name" className="bg-white text-black  border border-gray-400 focus:border-[#0C21C1] focus:outline-none py-1 placeholder-gray-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-1 font-medium text-sm">Surname</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your Surname" className="bg-white text-black  border border-gray-400 focus:border-[#0C21C1] focus:outline-none py-1 placeholder-gray-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-medium text-sm">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" className="bg-white text-black  border border-gray-400 focus:border-[#0C21C1] focus:outline-none py-1 placeholder-gray-500" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 font-medium text-sm">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your Password"
                  className="bg-white text-black border border-gray-400 focus:border-[#0C21C1] focus:outline-none py-1 placeholder-gray-500 pr-10 w-full"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-[#0C21C1]"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>


            <div
            style={{backgroundColor: "#F8F8F8", borderRadius: "10px", padding: "10px"}}
            className="flex flex-col">
              <label
              style ={{color: "#0C21C1"}}
              className="mb-1 font-medium text-sm">I want to</label>
              <div
              className="flex gap-6 mt-1">
                <label className="flex items-center text-sm">
                  <input type="radio" name="userType" value="CANDIDATE" checked={formData.userType === "CANDIDATE"} onChange={handleChange} className="mr-2" />Find a job
                </label>
                <label
                style={{backgroundColor: "#F8F8F8", borderRadius: "10px", padding: "10px"}}
                className="flex items-center text-sm">
                  <input type="radio" name="userType" value="EMPLOYER" checked={formData.userType === "EMPLOYER"} onChange={handleChange} className="mr-2" />Hire talent
                </label>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Your password must be at least 8 characters and include a number and a special character.
            </p>

            <button type="submit" className="w-full bg-[#0C21C1] text-white py-3 rounded-full hover:bg-[#0a1ba6] transition">Sign Up</button>
          </form>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">or sign up with</p>
            <div className="flex justify-center gap-6">
              <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGithub size={24} className="text-black" />
              </button>
              <button className="p-2 bg-white hover:opacity-80 transition-opacity"><FaGoogle size={24} className="text-black" /></button>
            </div>
          </div>


        </div>

      </div>

      {/* Right */}
      {/*<div className="absolute top-8 right-8 text-red font-semibold">Logo</div>*/}
      <div
      style={{ background: "linear-gradient(180deg, #1849C6 0%, #000842 100%)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", borderRadius: "15px", padding: "20px", top: "0", right: "0", height: "100vh" }}
      className="w-[46%] bg-[#000842] rounded-l-3xl flex items-center justify-center relative">
        <img src={illustration} alt="Illustration" className="w-3/4 max-w-[400px]" />
      </div>

    </div>
  );
}
