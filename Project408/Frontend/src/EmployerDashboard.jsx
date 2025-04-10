import { useState } from 'react';
import { FaBell, FaSearch, FaPlus, FaClipboardList, FaUserTie, FaFileAlt, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function EmployerDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCreateJobForm, setShowCreateJobForm] = useState(false);
  const [myJobs, setMyJobs] = useState([]);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/login');
  };
  
  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/job-adv/my-jobadvs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyJobs(data);
      } else {
        console.error('Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">JobMatch</h1>
        </div>
        <nav className="mt-6">
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeSection === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => setActiveSection('dashboard')}
          >
            <FaChartLine className="mr-3" />
            <span>Dashboard</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeSection === 'postJob' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => setActiveSection('postJob')}
          >
            <FaPlus className="mr-3" />
            <span>Post Job</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeSection === 'myJobs' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => {
              setActiveSection('myJobs');
              fetchMyJobs();
            }}
          >
            <FaClipboardList className="mr-3" />
            <span>My Job Listings</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeSection === 'candidates' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => setActiveSection('candidates')}
          >
            <FaUserTie className="mr-3" />
            <span>Candidates</span>
          </div>
          <div
            className={`flex items-center px-6 py-3 cursor-pointer ${
              activeSection === 'offers' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
            }`}
            onClick={() => setActiveSection('offers')}
          >
            <FaFileAlt className="mr-3" />
            <span>Offers</span>
          </div>
          <div
            className="flex items-center px-6 py-3 text-gray-700 cursor-pointer mt-10"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3" />
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="flex items-center border rounded-lg px-3 py-2 w-64">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none w-full"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaBell className="text-gray-600 text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                3
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                EM
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">Employer</p>
                <p className="text-xs text-gray-500">Company Name</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Active Job Postings</h3>
                  <p className="text-3xl font-bold text-blue-600">{myJobs.length || 0}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Total Applications</h3>
                  <p className="text-3xl font-bold text-green-600">24</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium mb-2">Offers Sent</h3>
                  <p className="text-3xl font-bold text-purple-600">8</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'postJob' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Post a New Job</h2>
              <p className="mb-4 text-gray-600">Coming soon! This feature is under development.</p>
              <button 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowCreateJobForm(true)}
              >
                Create Job Posting
              </button>
            </div>
          )}

          {activeSection === 'myJobs' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">My Job Listings</h2>
              {myJobs.length > 0 ? (
                <div className="space-y-4">
                  {myJobs.map(job => (
                    <div key={job.id} className="bg-white p-4 rounded-lg shadow">
                      <h3 className="text-lg font-medium">{job.title || 'Job Title'}</h3>
                      <p className="text-gray-500 text-sm mb-2">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                      <p className="mb-3 text-gray-600">{job.description || 'No description available'}</p>
                      <div className="flex space-x-2">
                        <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm">
                          Edit
                        </button>
                        <button className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm">
                          Delete
                        </button>
                        <button className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm">
                          View Applications
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                    onClick={() => setActiveSection('postJob')}
                  >
                    Post Your First Job
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'candidates' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Candidates</h2>
              <p className="text-gray-600">View candidates who applied to your job postings.</p>
            </div>
          )}

          {activeSection === 'offers' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Offers</h2>
              <p className="text-gray-600">Manage offers sent to candidates.</p>
            </div>
          )}
        </main>
      </div>

      {/* Create Job Form Modal */}
      {showCreateJobForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Create New Job Posting</h2>
                <button 
                  onClick={() => setShowCreateJobForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form className="space-y-6">
                {/* Job details will go here */}
                <p className="text-gray-600">Form under development. Check back soon!</p>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateJobForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
