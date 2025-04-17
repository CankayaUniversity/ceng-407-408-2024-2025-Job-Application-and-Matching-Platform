import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaEnvelope, FaFile, FaUserCircle, FaCheck, FaTimes, FaPhone, FaStar, FaArrowLeft, FaFilter, FaDownload, FaSearch } from 'react-icons/fa';

export default function JobApplicationsTable() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);
  const [offerData, setOfferData] = useState({
    applicationId: null,
    salaryOffer: '',
    startDate: '',
    message: '',
    status: 'pending'
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewApplicationDetails, setViewApplicationDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
    fetchJobDetails();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Fetching applications for job ID:", jobId);
      const response = await fetch(`http://localhost:9090/api/job-adv/${jobId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Başvurular getirilemedi');
      }

      const data = await response.json();
      console.log("Raw applications data:", data);
      
      // Map applications to a simpler structure that works with our UI
      const processedApplications = data.map(app => {
        // Extract candidate data safely
        let candidateData = app.candidate || {};
        
        return {
          ...app,
          // Create a simplified applicant object that matches what our UI expects
          applicant: {
            firstName: candidateData.firstName || "Not Available",
            lastName: candidateData.lastName || "",
            email: candidateData.email || "N/A",
            phone: candidateData.phone || "N/A",
            experience: candidateData.workExperiences ? candidateData.workExperiences.length : 0,
            education: candidateData.education ? 
              `${candidateData.education.school || ''} - ${candidateData.education.fieldOfStudy || ''}` : 
              'Not specified',
            skills: candidateData.skills ? 
              candidateData.skills.map(skill => skill.name || skill) : 
              []
          }
        };
      });
      
      console.log("Processed applications for UI:", processedApplications);
      setApplications(processedApplications);
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/job-adv/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('İş detayları getirilemedi');
      }

      const data = await response.json();
      setJobTitle(data.title);
    } catch (err) {
      console.error('Error fetching job details:', err);
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/job-adv/application/${offerData.applicationId}/offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          salaryOffer: parseFloat(offerData.salaryOffer),
          startDate: offerData.startDate ? new Date(offerData.startDate).toISOString().split('T')[0] : null,
          benefits: offerData.message,
          workHours: "Full-time",
          location: "",
          status: "PENDING"
        })
      });

      if (!response.ok) {
        throw new Error('İş teklifi gönderilemedi');
      }

      // Update application status in the UI
      setApplications(applications.map(app => 
        app.id === offerData.applicationId 
          ? { ...app, status: 'OFFERED' } 
          : app
      ));
      
      // Reset and close offer form
      setSendingOffer(false);
      setOfferData({
        applicationId: null,
        salaryOffer: '',
        startDate: '',
        message: '',
        status: 'pending'
      });
      
    } catch (err) {
      setError(err.message);
    }
  };

  const openOfferForm = (application) => {
    setOfferData({
      applicationId: application.id,
      salaryOffer: '',
      startDate: '',
      message: `${jobTitle} pozisyonu için size teklif vermekten memnuniyet duyarız.`,
      status: 'pending'
    });
    setSendingOffer(true);
  };

  const toggleApplicationDetails = (application) => {
    setSelectedApplication(application);
    setViewApplicationDetails(!viewApplicationDetails);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Belirtilmemiş';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'OFFERED':
        return 'bg-purple-100 text-purple-800';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'HIRED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'OFFERED':
        return 'Teklif Verildi';
      case 'ACCEPTED':
        return 'Kabul Edildi';
      case 'REJECTED':
        return 'Reddedildi';
      case 'HIRED':
        return 'İşe Alındı';
      default:
        return status;
    }
  };

  const filteredApplications = applications.filter(app => {
    // Filter by search term
    const searchMatch = 
      (app.applicant?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicant?.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.applicant?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const statusMatch = filterStatus === 'all' || app.status === filterStatus;
    
    return searchMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{jobTitle} için Başvurular</h2>
            <p className="text-gray-600">{applications.length} başvuru alındı</p>
          </div>
          <Link 
            to={`/employer/jobs`}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> İlanlara Dön
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}

        {/* Filter and search section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Aday ara..."
                className="pl-12 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tüm Durumlar</option>
                <option value="PENDING">Beklemede</option>
                <option value="OFFERED">Teklif Verildi</option>
                <option value="ACCEPTED">Kabul Edildi</option>
                <option value="REJECTED">Reddedildi</option>
                <option value="HIRED">İşe Alındı</option>
              </select>
            </div>

            <div>
              <button className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FaFilter className="mr-2" /> Filtrele
              </button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
              <FaDownload className="mr-2" /> Başvuranları İndir (CSV)
            </button>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz başvuru yok</h3>
            <p className="text-gray-500">Adaylar bu ilana başvuru yaptığında burada görünecekler</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Arama kriterlerinize uygun başvuru bulunamadı</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredApplications.map((application) => (
              <div 
                key={application.id} 
                className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
                  backgroundSize: 'cover'
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserCircle className="h-8 w-8 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.applicant?.firstName} {application.applicant?.lastName}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          {application.applicant?.email}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 h-fit text-xs font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Deneyim</div>
                      <div className="text-sm">{application.applicant?.experience || 0} yıl</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Başvuru Tarihi</div>
                      <div className="text-sm">{formatDate(application.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Eğitim</div>
                      <div className="text-sm">{application.applicant?.education || 'Belirtilmemiş'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-500 mb-1">Uyumluluk</div>
                      <div className="flex items-center">
                        <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm">%{Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {application.applicant?.skills && application.applicant.skills.length > 0 && (
                    <div className="mt-4">
                      <div className="text-xs font-medium text-gray-500 mb-2">Yetenekler</div>
                      <div className="flex flex-wrap gap-2">
                        {application.applicant.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                            {skill}
                          </span>
                        ))}
                        {application.applicant.skills.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                            +{application.applicant.skills.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button 
                      onClick={() => toggleApplicationDetails(application)}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800"
                    >
                      Detayları Görüntüle
                    </button>
                    
                    <div className="flex space-x-2">
                      {application.status === 'PENDING' && (
                        <button 
                          onClick={() => openOfferForm(application)}
                          className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                        >
                          <FaCheck className="mr-1" /> Teklif Ver
                        </button>
                      )}
                      <button 
                        className="inline-flex items-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium rounded-md transition-colors"
                      >
                        <FaTimes className="mr-1" /> Reddet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {sendingOffer && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSendOffer}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                      İş Teklifi Gönder
                    </h3>
                    <p className="text-sm text-gray-500">
                      Bu adaya göndermek istediğiniz teklif detaylarını doldurun.
                    </p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maaş Teklifi (₺)
                    </label>
                    <input
                      type="number"
                      required
                      value={offerData.salaryOffer}
                      onChange={(e) => setOfferData({...offerData, salaryOffer: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={offerData.startDate}
                      onChange={(e) => setOfferData({...offerData, startDate: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mesaj
                    </label>
                    <textarea
                      rows="4"
                      value={offerData.message}
                      onChange={(e) => setOfferData({...offerData, message: e.target.value})}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button 
                    type="submit" 
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Teklif Gönder
                  </button>
                  <button 
                    type="button" 
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setSendingOffer(false)}
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {viewApplicationDetails && selectedApplication && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Başvuru Detayları
                  </h3>
                  <button
                    onClick={() => setViewApplicationDetails(false)}
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <span className="sr-only">Kapat</span>
                    <FaTimes />
                  </button>
                </div>
                
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserCircle className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedApplication.applicant?.firstName} {selectedApplication.applicant?.lastName}
                      </h2>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1">
                        <div className="flex items-center mr-4">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          {selectedApplication.applicant?.email}
                        </div>
                        {selectedApplication.applicant?.phone && (
                          <div className="flex items-center">
                            <FaPhone className="mr-1 text-gray-400" />
                            {selectedApplication.applicant?.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Kişisel Bilgiler</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Deneyim</p>
                          <p className="font-medium">{selectedApplication.applicant?.experience || 0} yıl</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Eğitim</p>
                          <p className="font-medium">{selectedApplication.applicant?.education || 'Belirtilmemiş'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Başvuru Tarihi</p>
                          <p className="font-medium">{formatDate(selectedApplication.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Durum</p>
                          <p className="font-medium">{getStatusText(selectedApplication.status)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Yetenekler</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {selectedApplication.applicant?.skills && selectedApplication.applicant.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedApplication.applicant.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">Belirtilen yetenek bulunmamaktadır</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Başvuru Notu</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">
                      {selectedApplication.coverLetter || 'Başvuru notu bulunmamaktadır.'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">CV & Belgeler</h4>
                  <div className="bg-gray-50 p-4 rounded-md flex items-center">
                    <FaFile className="text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium">CV.pdf</p>
                      <p className="text-xs text-gray-500">Yükleme tarihi: {formatDate(selectedApplication.createdAt)}</p>
                    </div>
                    <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium">
                      İndir
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedApplication.status === 'PENDING' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setViewApplicationDetails(false);
                      openOfferForm(selectedApplication);
                    }}
                  >
                    Teklif Ver
                  </button>
                )}
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setViewApplicationDetails(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 