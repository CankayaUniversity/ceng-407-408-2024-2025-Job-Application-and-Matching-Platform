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
import {BriefcaseIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline/index.js";

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
      console.log('OFFER'+JSON.stringify(data));
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
              height: isAccordionOpen ? '700px' : '500px',
              overflowY: 'auto',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div
                style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                className="w-full bg-gray-100 p-4 rounded-lg">
                {/* İç Beyaz Kutu */}
                <div style={{borderRadius: "15px", padding: "10px"}}
                     className="bg-white p-8 rounded-lg space-y-6 shadow-md">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><BriefcaseIcon
                            className="text-blue-600" style={{width: '20px', height: '20px'}}/> Job
                            Advertisement
                        </h3>
                        <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                            <p className="text-sm">
                                <span
                                    className="font-medium text-gray-700"> <strong> Job Description: </strong> </span>{' '}<span
                                className="text-gray-600">{job?.jobAdv?.description || '-'}</span>
                            </p>

                            <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong>Job Position: </strong> </span>{' '}<span
                                className="text-gray-600">{
                                job.jobAdv?.positionType === 'OTHER'
                                    ? job.jobAdv?.customJobPosition?.positionName || '-'
                                    : job.jobAdv?.positionType
                                    ?.replaceAll("_", " ")
                                    ?.toLowerCase()
                                    ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'
                            }
                              </span>
                            </p>


                            <p className="text-sm">
                                <span
                                    className="font-medium text-gray-700"> <strong> Salary Range: </strong> </span>{' '}
                                <span
                                    className="text-gray-600">{job?.jobAdv?.minSalary} - {job?.jobAdv?.maxSalary}</span>
                            </p>
                            <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Last Date: </strong> </span>{' '}
                                <span
                                    className="text-gray-600">{job?.jobAdv?.lastDate || '-'}</span>
                            </p>

                            <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"><strong> Travel Rest: </strong> </span>{' '}
                                <span
                                    className="text-gray-600">{job.jobAdv?.travelRest ? 'Yes' : 'No'}</span>
                            </p>
                            <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>License: </strong></span>{' '}
                                <span
                                    className="text-gray-600">{job.jobAdv?.license ? 'Yes' : 'No'}</span>
                            </p>

                        </div>
                    </div>
                </div>
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
                <div
                    style={{backgroundColor: "#f8f9f9", borderRadius: "15px", padding: "10px"}}
                    className="w-full bg-gray-100 p-4 rounded-lg">
                    {/* İç Beyaz Kutu */}
                    <div style={{borderRadius: "15px", padding: "10px"}}
                         className="bg-white p-8 rounded-lg space-y-6 shadow-md">

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{width: '20px', height: '20px'}}/>Job
                                Conditions</h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Work Type: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{
                                        job.jobAdv?.workType
                                            ?.replaceAll("_", " ")
                                            ?.toLowerCase()
                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                </p>
                                <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Employment Type: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.employmentType?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                </p>

                                <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Country: </strong></span>{' '}
                                    <span className="text-gray-600">{job?.jobAdv?.country || '-'}</span>
                                </p>
                                <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>City: </strong></span>{' '}
                                    <span className="text-gray-600">{job?.jobAdv?.city || '-'}</span>
                                </p>


                                <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Work Hours: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.minWorkHours} - {job.jobAdv?.maxWorkHours}</span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClipboardDocumentCheckIcon className="text-blue-600"
                                                            style={{width: '20px', height: '20px'}}/>Job
                                Qualification
                            </h3>
                            <div
                                className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Degree Type: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.degreeType?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                </p>
                                <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Job Experience: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.jobExperience?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                </p>
                                <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Experience Years: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.experienceYears || '-'}</span>
                                </p>
                                <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Military Status: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.jobAdv?.militaryStatus?.replaceAll("_", " ")
                                        ?.toLowerCase()
                                        ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                </p>

                            </div>
                        </div>


                        <div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="text-purple-600"
                                                   style={{width: '20px', height: '20px'}}
                                    />
                                    Benefits
                                </h3>

                                {job.jobAdv?.benefitTypes && job.jobAdv?.benefitTypes?.length > 0 ? (
                                    job.jobAdv?.benefitTypes?.map((benefit, idx) => (
                                        <div key={idx}
                                             className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                            <p><strong>Benefit
                                                Type: </strong> {benefit.benefitType || '-'}
                                            </p>
                                            <p>
                                                <strong>Description: </strong> {benefit.description || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No Benefits added.</p>
                                )}
                            </div>


                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="text-purple-600"
                                                   style={{width: '20px', height: '20px'}}
                                    />
                                    Technical Skills
                                </h3>

                                {job.jobAdv?.technicalSkills && job.jobAdv?.technicalSkills.length > 0 ? (
                                    job.jobAdv?.technicalSkills.map((technicalSkills, idx) => (
                                        <div key={idx}
                                             className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                            <p><strong>Position
                                                Name: </strong> {technicalSkills.positionName || '-'}
                                            </p>
                                            <p>
                                                <strong>Skill
                                                    Level: </strong> {technicalSkills.skillLevel || '-'}
                                            </p>
                                            <p>
                                                <strong>Description: </strong> {technicalSkills.description || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No Technical Skills added.</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="text-purple-600"
                                                   style={{width: '20px', height: '20px'}}
                                    />
                                    Social Skills
                                </h3>

                                {job.jobAdv?.socialSkills && job.jobAdv?.socialSkills.length > 0 ? (
                                    job.jobAdv?.socialSkills.map((socialSkills, idx) => (
                                        <div key={idx}
                                             className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                            <p><strong>Position
                                                Name: </strong> {socialSkills.positionName || '-'}
                                            </p>
                                            <p>
                                                <strong>Skill
                                                    Level: </strong> {socialSkills.skillLevel || '-'}
                                            </p>
                                            <p>
                                                <strong>Description: </strong> {socialSkills.description || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No Social Skills added.</p>
                                )}
                            </div>

                            {/* Languages */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BriefcaseIcon className="text-purple-600"
                                                   style={{width: '20px', height: '20px'}}
                                    />
                                    Language Proficiency
                                </h3>

                                {job.jobAdv?.languageProficiencies && job.jobAdv?.languageProficiencies.length > 0 ? (
                                    job.jobAdv?.languageProficiencies.map((languageProficiency, idx) => (
                                        <div key={idx}
                                             className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                            <p><strong>Reading
                                                Level: </strong> {languageProficiency.readingLevel || '-'}
                                            </p>
                                            <p><strong>Writing
                                                Level: </strong> {languageProficiency.writingLevel || '-'}
                                            </p>
                                            <p><strong>Speaking
                                                Level: </strong> {languageProficiency.speakingLevel || '-'}
                                            </p>
                                            <p><strong>Listening
                                                Level: </strong> {languageProficiency.listeningLevel || '-'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No Language added.</p>
                                )}
                            </div>


                        </div>


                    </div>
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
                        <JobCard key={job?.jobOffer?.id} job={job}/>
                    ))
                ) : (
                    <p style={{fontSize: '18px', color: '#cc304b'}}>No applications found for this status.</p>
                )}
            </div>
        </div>
    );
};

export default JobOffers;
