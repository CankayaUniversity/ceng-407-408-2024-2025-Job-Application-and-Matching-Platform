// import { useState } from 'react';
// import { FaBell, FaSearch, FaPlus, FaClipboardList, FaUserTie, FaFileAlt, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
//
//
// export default function EmployerDashboard() {
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [showCreateJobForm, setShowCreateJobForm] = useState(false);
//   const [myJobs, setMyJobs] = useState([]);
//   const navigate = useNavigate();
//
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userType');
//     navigate('/login');
//   };
//
//   const fetchMyJobs = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:9090/api/job-adv/my-jobadvs', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//
//       if (response.ok) {
//         const data = await response.json();
//         setMyJobs(data);
//       } else {
//         console.error('Failed to fetch jobs');
//       }
//     } catch (error) {
//       console.error('Error fetching jobs:', error);
//     }
//   };
//
//   return (
//
//     <>
//
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white shadow-md">
//         <div className="p-6">
//           <h1 className="text-2xl font-bold text-blue-600">JobMatch</h1>
//         </div>
//         {/*<nav className="mt-6">*/}
//         {/*  <div*/}
//         {/*    className={`flex items-center px-6 py-3 cursor-pointer ${*/}
//         {/*      activeSection === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'*/}
//         {/*    }`}*/}
//         {/*    onClick={() => setActiveSection('dashboard')}*/}
//         {/*  >*/}
//         {/*    <FaChartLine className="mr-3" />*/}
//         {/*    <span>Dashboard</span>*/}
//         {/*  </div>*/}
//         {/*  <div*/}
//         {/*    className={`flex items-center px-6 py-3 cursor-pointer ${*/}
//         {/*      activeSection === 'postJob' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'*/}
//         {/*    }`}*/}
//         {/*    onClick={() => setActiveSection('postJob')}*/}
//         {/*  >*/}
//         {/*    <FaPlus className="mr-3" />*/}
//         {/*    <span>Post Job</span>*/}
//         {/*  </div>*/}
//         {/*  <div*/}
//         {/*    className={`flex items-center px-6 py-3 cursor-pointer ${*/}
//         {/*      activeSection === 'myJobs' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'*/}
//         {/*    }`}*/}
//         {/*    onClick={() => {*/}
//         {/*      setActiveSection('myJobs');*/}
//         {/*      fetchMyJobs();*/}
//         {/*    }}*/}
//         {/*  >*/}
//         {/*    <FaClipboardList className="mr-3" />*/}
//         {/*    <span>My Job Listings</span>*/}
//         {/*  </div>*/}
//         {/*  <div*/}
//         {/*    className={`flex items-center px-6 py-3 cursor-pointer ${*/}
//         {/*      activeSection === 'candidates' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'*/}
//         {/*    }`}*/}
//         {/*    onClick={() => setActiveSection('candidates')}*/}
//         {/*  >*/}
//         {/*    <FaUserTie className="mr-3" />*/}
//         {/*    <span>Candidates</span>*/}
//         {/*  </div>*/}
//         {/*  <div*/}
//         {/*    className={`flex items-center px-6 py-3 cursor-pointer ${*/}
//         {/*      activeSection === 'offers' ? 'bg-blue-100 text-blue-600' : 'text-gray-700'*/}
//         {/*    }`}*/}
//         {/*    onClick={() => setActiveSection('offers')}*/}
//         {/*  >*/}
//         {/*    <FaFileAlt className="mr-3" />*/}
//         {/*    <span>Offers</span>*/}
//         {/*  </div>*/}
//         {/*  <div*/}
//         {/*    className="flex items-center px-6 py-3 text-gray-700 cursor-pointer mt-10"*/}
//         {/*    onClick={handleLogout}*/}
//         {/*  >*/}
//         {/*    <FaSignOutAlt className="mr-3" />*/}
//         {/*    <span>Logout</span>*/}
//         {/*  </div>*/}
//         {/*</nav>*/}
//       </div>
//
//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
//           <div className="flex items-center border rounded-lg px-3 py-2 w-64">
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative">
//             </div>
//             <div className="flex items-center">
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
//                 EM
//               </div>
//               <div className="ml-2">
//                 <p className="text-sm font-medium">Employer</p>
//                 <p className="text-xs text-gray-500">Company Name</p>
//               </div>
//             </div>
//           </div>
//         </header>
//
//         {/* Dashboard Content */}
//         <main className="p-6">
//           {activeSection === 'dashboard' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
//               <div className="grid grid-cols-3 gap-6">
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Active Job Postings</h3>
//                   <p className="text-3xl font-bold text-blue-600">{myJobs.length || 0}</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Total Applications</h3>
//                   <p className="text-3xl font-bold text-green-600">24</p>
//                 </div>
//                 <div className="bg-white p-6 rounded-lg shadow">
//                   <h3 className="text-lg font-medium mb-2">Offers Sent</h3>
//                   <p className="text-3xl font-bold text-purple-600">8</p>
//                 </div>
//               </div>
//             </div>
//           )}
//
//           {activeSection === 'postJob' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Post a New Job</h2>
//               <p className="mb-4 text-gray-600">Create a new job posting to find qualified candidates.</p>
//               <button
//                 className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
//                 onClick={() => navigate('/create-job')}
//               >
//                 <FaPlus className="mr-2" /> Create Job Posting
//               </button>
//             </div>
//           )}
//
//           {activeSection === 'myJobs' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">My Job Listings</h2>
//               {myJobs.length > 0 ? (
//                 <div className="space-y-4">
//                   {myJobs.map(job => (
//                     <div key={job.id} className="bg-white p-4 rounded-lg shadow">
//                       <h3 className="text-lg font-medium">{job.title || 'Job Title'}</h3>
//                       <p className="text-gray-500 text-sm mb-2">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
//                       <p className="mb-3 text-gray-600">{job.description || 'No description available'}</p>
//                       <div className="flex space-x-2">
//                         <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm">
//                           Edit
//                         </button>
//                         <button className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm">
//                           Delete
//                         </button>
//                         <button className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm">
//                           View Applications
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-white p-6 rounded-lg shadow text-center">
//                   <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
//                   <button
//                     className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
//                     onClick={() => setActiveSection('postJob')}
//                   >
//                     Post Your First Job
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//
//           {activeSection === 'candidates' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Candidates</h2>
//               <p className="text-gray-600">View candidates who applied to your job postings.</p>
//             </div>
//           )}
//
//           {activeSection === 'offers' && (
//             <div>
//               <h2 className="text-2xl font-semibold mb-6">Offers</h2>
//               <p className="text-gray-600">Manage offers sent to candidates.</p>
//             </div>
//           )}
//         </main>
//       </div>
//
//       {/* Create Job Form Modal */}
//       {showCreateJobForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold">Create New Job Posting</h2>
//                 <button
//                   onClick={() => setShowCreateJobForm(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//
//               <form className="space-y-6">
//                 {/* Job details will go here */}
//                 <p className="text-gray-600">Form under development. Check back soon!</p>
//
//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowCreateJobForm(false)}
//                     className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Create Job
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//
//       )}
//     </div>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    position: '',
    workType: '',
    minSalary: '',
    maxSalary: '',
    city: '',
    company: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Kullanıcı giriş yapmamış');
      return;
    }

    fetch('http://localhost:9090/candidate/getAllJobAdv', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setJobs(data);
          setFilteredJobs(data);
        })
        .catch(err => console.error("İlanlar alınamadı", err));

    fetch('http://localhost:9090/candidate/myApplications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
        .then(res => res.json())
        .then(data => setApplications(data));
  }, []);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const filterJobs = () => {
    let filtered = jobs;
    if (filters.position) {
      filtered = filtered.filter(job =>
          job.positionTypes?.some(position => position.toLowerCase().includes(filters.position.toLowerCase()))
      );
    }
    if (filters.workType) {
      filtered = filtered.filter(job => job.workType?.toLowerCase().includes(filters.workType.toLowerCase()));
    }
    if (filters.minSalary) {
      filtered = filtered.filter(job => job.minSalary >= parseInt(filters.minSalary));
    }
    if (filters.maxSalary) {
      filtered = filtered.filter(job => job.maxSalary <= parseInt(filters.maxSalary));
    }
    if (filters.city) {
      filtered = filtered.filter(job => job.city?.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.company) {
      filtered = filtered.filter(job => job.companyName?.toLowerCase().includes(filters.company.toLowerCase()));
    }
    setFilteredJobs(filtered);
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#151717',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '8px',
    fontSize: '12px',
    width: '180px',
    backgroundColor: '#fdfdfd',
    color: '#100e0e',
  };

  const JobCard = ({ job, applications }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    const application = applications.find(app => app.jobAdvId === job.id);
    const status = application ? application.status : null;

    const handleApply = async (jobId) => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage("Lütfen giriş yapın.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:9090/candidate/applyJobAdv/${jobId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const statusResponse = await fetch('http://localhost:9090/candidate/myApplications', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const statusData = await statusResponse.json();
          setApplications(statusData);

          setMessage("Başvuru başarılı!");
        } else {
          const errorText = await res.text();
          setMessage("Başvuru başarısız! " + errorText);
        }
      } catch (error) {
        setMessage("Bir hata oluştu.");
      }
    };

    return (
        <div
            style={{
              border: '1px solid #bdc3c7',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#ffffff',
              color: '#000000',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              textAlign: 'center',
              transform: 'scale(1)',
              width: 'calc(33.33% - 16px)',
              marginBottom: '16px',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div>
            <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>{job.description}</h3>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>🏢 {job.companyName || "Bilinmeyen Şirket"}</p>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💼 {job.workType || "Bilinmiyor"}</p>
            <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💰 {job.minSalary} ₺ - {job.maxSalary} ₺</p>
          </div>

          <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                style={buttonStyle}
            >
              {isAccordionOpen ? '🔽 Gizle' : '🔼 Detayları Göster'}
            </button>
          </div>

          {isAccordionOpen && (
              <div style={{ marginTop: '10px', lineHeight: '1.4', fontSize: '14px' }}>
                <p><strong>🕒 Süre:</strong> {job.minWorkHours} - {job.maxWorkHours} saat/hafta</p>
                <p><strong>📅 Son Başvuru:</strong> {new Date(job.lastDate).toLocaleDateString()}</p>
                <p><strong>🧳 Gezi İzni:</strong> {job.travelRest ? "Evet" : "Hayır"}</p>
                <p><strong>🎁 İzinler:</strong> {job.benefitTypes?.join(', ') || "Yok"}</p>
                <p><strong>🗣️ Diller:</strong> {job.languageProficiencies?.join(', ')}</p>
                <p><strong>🤝 Sosyal Beceriler:</strong> {job.socialSkills?.join(', ')}</p>
                <p><strong>🧠 Teknik Beceriler:</strong> {job.technicalSkills?.join(', ')}</p>
                <p><strong>📌 Pozisyon Türleri:</strong> {job.positionTypes?.join(', ')}</p>
                <p><strong>🌟 Özel Pozisyonlar:</strong> {job.customJobPositions?.join(', ')}</p>

                {status ? (
                    <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#cc304b' }}>
                      Başvuru Durumu: {status}
                    </p>
                ) : (
                    <button
                        onClick={() => handleApply(job.id)}
                        style={{ ...buttonStyle, marginTop: '8px' }}
                    >
                      🚀 Başvur
                    </button>
                )}
              </div>
          )}
        </div>
    );
  };

  return (
      <div style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        minHeight: '100vh',
        color: '#000000',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '100vw',
        margin: '0 auto',
      }}>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <h2 style={{ textAlign: 'center', fontSize: '30px' }}>İş İlanları</h2>
          {message && <p style={{ color: '#cc304b', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <input type="text" name="position" value={filters.position} onChange={handleFilterChange} placeholder="Pozisyon" style={inputStyle} />
            <input type="text" name="workType" value={filters.workType} onChange={handleFilterChange} placeholder="İş Tipi" style={inputStyle} />
            <input type="number" name="minSalary" value={filters.minSalary} onChange={handleFilterChange} placeholder="Min Maaş" style={inputStyle} />
            <input type="number" name="maxSalary" value={filters.maxSalary} onChange={handleFilterChange} placeholder="Max Maaş" style={inputStyle} />
            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Konum (Şehir)" style={inputStyle} />
            <input type="text" name="company" value={filters.company} onChange={handleFilterChange} placeholder="Şirket" style={inputStyle} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <button onClick={filterJobs} style={{ ...buttonStyle, marginTop: '8px' }}>Filtrele</button>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          width: '100%',
          justifyContent: 'center',
        }}>
          {filteredJobs.map(job => {
            return (
                <JobCard key={job.id} job={job} applications={applications} />
            );
          })}
        </div>
      </div>
  );
};

export default EmployerDashboard;
