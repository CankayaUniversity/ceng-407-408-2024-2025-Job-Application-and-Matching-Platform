import { FaBell, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function JobSeekerDashboard() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
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

      {/* İçerik */}
      <div className="w-full px-4 py-6">
        <div className="max-w-[1200px] mx-auto flex gap-6">
          {/* Sol Panel - Profil */}
          <div className="w-[280px] bg-[#061A40] text-white rounded-lg p-6">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-lg font-semibold mb-1">Name Surname</h2>
              <p className="text-sm text-gray-300 mb-6">Job</p>

              <ul className="text-left space-y-2.5 text-sm text-gray-300">
                <li>Nationality</li>
                <li>Currently Working</li>
                <li>Phone Number</li>
                <li>Country, City</li>
                <li>Gender</li>
                <li>Military Status</li>
                <li>Disability Status</li>
                <li>Marital Status</li>
                <li>Driving License</li>
                <li>Profile Privacy: Visible to everyone</li>
                <li>Github:</li>
                <li>Portfolio:</li>
                <li>Job Preferences:</li>
                <li>References:</li>
                <li>Hobbies:</li>
              </ul>
            </div>
          </div>

          {/* Sağ Panel - Bilgiler */}
          <div className="flex-1 bg-white rounded-lg p-6 space-y-6">
            <p className="text-gray-600 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the. Simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Work experiences</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  company name, industry, job title, job description, employment type...
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Education</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  Degree type, department, start-end date, isOngoing
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Skills</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  English, Spanish
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Languages</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  English, Spanish
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Certificates</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  Name, url
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Exams and Achievements</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  (name, year, score, rank)
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Uploaded Documents</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  lorem ipsum
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Projects</h3>
                <p className="text-sm text-gray-600 border-b pb-2">
                  (name, description, start-end date, status)
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg transition">
                Update Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
