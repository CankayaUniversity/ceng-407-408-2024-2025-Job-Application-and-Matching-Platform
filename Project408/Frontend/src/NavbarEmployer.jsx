// src/Navbar.jsx
import { Link } from 'react-router-dom';
import { FaBell, FaSearch } from 'react-icons/fa';

export default function Navbar() {
  return (

    <nav className="w-full bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between w-full h-16 px-8">
              {/* Sol: Logo + Menü */}
              <div className="flex items-center gap-12">
                <Link to="/" className="text-blue-600 font-semibold text-lg">Logo</Link>
    
                <div className="flex items-center gap-8">
                  <Link to="/profile" className="text-[15px] text-gray-700 hover:text-gray-900">Profile</Link>
                  <Link to="/chat" className="text-[15px] text-gray-700 hover:text-gray-900">Chat</Link>
                  <Link to="/blog" className="text-[15px] text-gray-700 hover:text-gray-900">Blog</Link>
                  <Link to="/interviews" className="text-[15px] text-gray-700 hover:text-gray-900">Interviews</Link>
                  <Link to="/my-jobs" className="text-[15px] text-gray-700 hover:text-gray-900">My Jobs</Link>
                  <Link to="/job-offers" className="text-[15px] text-gray-700 hover:text-gray-900">Job Offersss</Link>
                </div>
              </div>
    
              {/* Sağ: Search + Bildirim + User */}
              <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-[260px] h-9 pl-9 pr-4 text-sm rounded-full bg-gray-100 border border-gray-200 focus:outline-none"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                </div>
    
                {/* Notification */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                  <FaBell className="text-gray-600 text-lg" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
                </button>
    
                {/* User */}
                <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-full hover:bg-blue-700 transition">
                  İrem
                </button>
              </div>
            </div>
          </nav>

    // <nav className="bg-gray-800 text-white p-4 flex justify-between">
    //   <div className="font-bold text-xl">JobMatch</div>
    //   <div className="space-x-4">
    //     <Link to="/dashboard">Dashboard</Link>
    //     <Link to="/profile">Profile</Link>
    //     <Link to="/jobs">Jobs</Link>
    //     <Link to="/messages">Messages</Link>
    //   </div>
    // </nav>
  );
}
