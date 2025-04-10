import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaEnvelope, FaFile, FaUserCircle, FaCheck, FaTimes, FaPhone, FaStar } from 'react-icons/fa';

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

  useEffect(() => {
    fetchApplications();
    fetchJobDetails();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/api/job-adv/${jobId}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();
      setApplications(data);
    } catch (err) {
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
        throw new Error('Failed to fetch job details');
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
        throw new Error('Failed to send job offer');
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
      message: `We are pleased to offer you the position of ${jobTitle}.`,
      status: 'pending'
    });
    setSendingOffer(true);
  };

  const toggleApplicationDetails = (application) => {
    setSelectedApplication(application);
    setViewApplicationDetails(!viewApplicationDetails);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Applications for {jobTitle}</h2>
            <p className="text-gray-600">{applications.length} applications received</p>
          </div>
          <Link 
            to={`/employer/jobs`}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Back to Jobs
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500">When candidates apply to this job, they'll appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <FaUserCircle className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.applicant.firstName} {application.applicant.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.applicant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {application.applicant.experience || 'Not specified'} years
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleApplicationDetails(application)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        View Details
                      </button>
                      {application.status === 'PENDING' && (
                        <button
                          onClick={() => openOfferForm(application)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Send Offer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {viewApplicationDetails && selectedApplication && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Application Details
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <FaUserCircle className="h-12 w-12 text-gray-400 mr-4" />
                        <div>
                          <h4 className="text-xl font-semibold">
                            {selectedApplication.applicant.firstName} {selectedApplication.applicant.lastName}
                          </h4>
                          <div className="flex items-center mt-1">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <span className="text-gray-600">{selectedApplication.applicant.email}</span>
                          </div>
                          {selectedApplication.applicant.phone && (
                            <div className="flex items-center mt-1">
                              <FaPhone className="text-gray-400 mr-2" />
                              <span className="text-gray-600">{selectedApplication.applicant.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Cover Letter</h5>
                        <div className="bg-gray-50 p-3 rounded text-gray-700 text-sm h-40 overflow-y-auto">
                          {selectedApplication.coverLetter || "No cover letter provided."}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">Skills</h5>
                        <div className="bg-gray-50 p-3 rounded h-40 overflow-y-auto">
                          {selectedApplication.applicant.skills && selectedApplication.applicant.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedApplication.applicant.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm">No skills listed.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h5 className="font-medium text-gray-700 mb-2">Experience</h5>
                      {selectedApplication.applicant.experience ? (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-700">
                            {selectedApplication.applicant.experience} years of experience
                          </p>
                          {selectedApplication.applicant.experienceDetails && (
                            <p className="text-gray-600 mt-2">
                              {selectedApplication.applicant.experienceDetails}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500">No experience details provided.</p>
                      )}
                    </div>
                    
                    {selectedApplication.resume && (
                      <div className="mb-6">
                        <h5 className="font-medium text-gray-700 mb-2">Resume</h5>
                        <a 
                          href={selectedApplication.resume} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaFile className="mr-2" />
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedApplication.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleApplicationDetails(null);
                      openOfferForm(selectedApplication);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <FaCheck className="mr-2" /> Send Offer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewApplicationDetails(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
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
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FaStar className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Send Job Offer
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="salaryOffer" className="block text-sm font-medium text-gray-700">
                            Salary Offer (yearly)
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="salaryOffer"
                              id="salaryOffer"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              value={offerData.salaryOffer}
                              onChange={(e) => setOfferData({...offerData, salaryOffer: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Starting Date
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={offerData.startDate}
                            onChange={(e) => setOfferData({...offerData, startDate: e.target.value})}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                            Offer Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            rows={4}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={offerData.message}
                            onChange={(e) => setOfferData({...offerData, message: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Send Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendingOffer(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
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