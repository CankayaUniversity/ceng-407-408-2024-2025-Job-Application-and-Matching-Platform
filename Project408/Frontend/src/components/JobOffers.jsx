// import { useState, useEffect } from 'react';
// import { FaCheck, FaTimes, FaBuilding, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt } from 'react-icons/fa';
//
// export default function JobOffers() {
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [respondingToOffer, setRespondingToOffer] = useState(null);
//   const [responseSuccess, setResponseSuccess] = useState(false);
//
//   useEffect(() => {
//     fetchOffers();
//   }, []);
//
//   const fetchOffers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:9090/api/job-offer/my-offers', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });
//
//       if (!response.ok) {
//         throw new Error('Failed to fetch offers');
//       }
//
//       const data = await response.json();
//       setOffers(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleRespondToOffer = async (offerId, accept) => {
//     try {
//       setRespondingToOffer(offerId);
//       const token = localStorage.getItem('token');
//
//       const response = await fetch(`http://localhost:9090/api/job-adv/offer/${offerId}/respond?accept=${accept}`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//
//       if (!response.ok) {
//         throw new Error('Failed to respond to offer');
//       }
//
//       // Update the offer status in the UI
//       setOffers(offers.map(offer =>
//         offer.id === offerId
//           ? { ...offer, status: accept ? 'ACCEPTED' : 'REJECTED' }
//           : offer
//       ));
//
//       setResponseSuccess(true);
//       setTimeout(() => {
//         setResponseSuccess(false);
//       }, 3000);
//
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setRespondingToOffer(null);
//     }
//   };
//
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not specified';
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };
//
//   const formatCurrency = (amount) => {
//     if (!amount) return 'Not specified';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };
//
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'PENDING':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'ACCEPTED':
//         return 'bg-green-100 text-green-800';
//       case 'REJECTED':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }
//
//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Job Offers</h2>
//
//         {error && (
//           <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-md">
//             {error}
//           </div>
//         )}
//
//         {responseSuccess && (
//           <div className="bg-green-50 text-green-600 p-4 mb-6 rounded-md">
//             Your response has been submitted successfully!
//           </div>
//         )}
//
//
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const JobOffers = () => {
  const [selectedStatus, setSelectedStatus] = useState('PENDING'); // Default selected
  const [message, setMessage] = useState('');
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/job-offer/my-offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }

      const data = await response.json();
      console.log('OFFER'+data);
      setOffers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOffer = async (offerId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
          `http://localhost:9090/api/job-adv/offer/${offerId}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Teklif gönderme hatası:", error);
    }
  };const handleDecline = async (offerId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.put(
          `http://localhost:9090/api/job-adv/declineOffer/${offerId}`,{},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Teklif gönderme hatası:", error);
    }
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

  const JobCard = ({ job }) => {
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const status = job?.jobOffer?.status;

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
              height: isAccordionOpen ? '550px' : '250px',
              overflowY: 'auto',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div>
                <h3 style={{margin: '0', fontSize: '20px', fontWeight: 'bold'}}>{job.company?.companyName}</h3>

                <p style={{fontSize: '16px',
                    color: '#383e3e',
                    marginBottom: '5px'}}>{job?.jobOffer?.location}</p>

                <p style={{
                    fontSize: '16px',
                    color: '#383e3e',
                    marginBottom: '5px'
                }}>🏢 {job?.jobOffer?.salaryOffer || "Unknown Company"}</p>
                <p style={{
                    fontSize: '16px',
                    color: '#383e3e',
                    marginBottom: '5px'
                }}>💼 {job?.jobOffer?.startDate || "Not Specified"}</p>
                <p style={{fontSize: '16px', color: '#383e3e', marginBottom: '5px'}}>💰 {job?.jobOffer?.minSalary} ₺
                    - {job?.jobOffer?.maxSalary} ₺</p>

                {/* Application Status */}
                {status && (
                    <p style={{marginTop: '8px', fontWeight: 'bold', color: '#cc304b'}}>
                        Offer Status: {status}
                    </p>
                )}
            </div>

            <div style={{marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center'}}>
            <button
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                style={buttonStyle}
            >
              {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
            </button>
          </div>

          {isAccordionOpen && (
              <div style={{marginTop: '10px', lineHeight: '1.4', fontSize: '14px'}}>

                  <p><strong>🎁 Benefits:</strong> {job?.jobOffer?.benefits}</p>
                  <p><strong>🗣️ Work Hours:</strong> {job?.jobOffer?.workHours}</p>
                  {/*<p><strong>🤝 Social Skills:</strong> {job.socialSkills?.join(', ')}</p>*/}
                  {/*<p><strong>🧠 Technical Skills:</strong> {job.technicalSkills?.join(', ')}</p>*/}

                  <div className="flex justify-between mt-6">
                      {status === 'PENDING' && (
                          <div className="flex w-full justify-between">
                              <button
                                  onClick={() => handleOffer(job?.jobOffer?.id)}
                                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                              >
                                  Accept Offer
                              </button>
                              <button
                                  onClick={() => handleDecline(job?.jobOffer?.id)}
                                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                  Decline
                              </button>
                          </div>
                      )}
                  </div>


              </div>
          )}
        </div>
    );
  };

    const filteredApplications = offers.filter(job => job?.jobOffer?.status === selectedStatus);


    return (
        <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            minHeight: '100vh',
            color: '#000000',
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '100vw',
            margin: '0 auto',

        }}>
            {/* Left Menu */}
            <div style={{
                width: '300px',  // Expanded sidebar
          marginRight: '20px',
          borderRight: '1px solid #ccc',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',


        }}>
          <h3>Offer Status</h3>
          {['PENDING', 'ACCEPTED', 'REJECTED', 'INTERVIEW'].map(status => (
              <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  style={{
                    padding: '10px',
                    backgroundColor: selectedStatus === status ? '#151717' : '#ecf0f1',
                    color: selectedStatus === status ? 'white' : '#2c3e50',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
              >
                {status}
              </button>
          ))}
        </div>

        {/* Right Content */}
        <div style={{
          flexGrow: 1,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}>
          {filteredApplications.length > 0 ? (
              filteredApplications.map(job => (
                  <JobCard key={job?.jobOffer?.id} job={job} />
              ))
          ) : (
              <p style={{ fontSize: '18px', color: '#cc304b' }}>No applications found for this status.</p>
          )}
        </div>
      </div>
  );
};

export default JobOffers;
