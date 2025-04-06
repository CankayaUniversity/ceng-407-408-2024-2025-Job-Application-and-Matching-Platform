import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import illustration from './assets/illustration.png';


console.log('Illustration path:', illustration);

export default function SignUp() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-12 bg-white">
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

          <form className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Enter your Name"
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Enter your Surname"
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Enter your Password"
                className="w-full border-b border-gray-300 pb-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:border-gray-400"
              />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Your password must be at least 8 characters and include a number and a special character.
            </p>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition-colors mt-8"
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
      <div className="block md:flex w-1/2 bg-[#1849C6] items-center justify-center relative">
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