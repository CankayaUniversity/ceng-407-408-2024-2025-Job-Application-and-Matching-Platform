import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {BriefcaseIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline/index.js";
import Toast from "./Toast.jsx";
import axios from "axios";

const JobSeekerMyJobs = () => {
    const [applications, setApplications] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('PENDING'); // Default selected
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        if (!token) {
            console.log('User is not logged in');
            return;
        }

        // Fetch job application details
        fetch(`http://localhost:9090/candidate/getMyApplicationsDetails/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setApplications(data);
                console.log(JSON.stringify(data))

            })
            .catch(err => {
                console.error("Failed to fetch applications", err);
                setMessage("An error occurred while fetching applications.");
            });

        // Fetch application statuses
        fetch(`http://localhost:9090/candidate/myApplications`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setStatuses(data);
            })
            .catch(err => {
                console.error("Failed to fetch application statuses", err);
            });

    }, []);

    const buttonStyle = {
        padding: '8px 12px',
        backgroundColor: '#151717',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    const findStatusByJobAdvId = (jobAdvId) => {
        const statusObj = statuses.find(status => status.jobAdvId === jobAdvId);
        return statusObj ? statusObj.status : null;
    };

    const handleInterview = async (jobAdvId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                `http://localhost:9090/api/job-adv/acceptInterview/${jobAdvId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(response.data);
            setMessage(response.data);
            setShowToast(true);
        } catch (error) {
            console.error("Offer sending error:", error);
            setMessage(error.response?.data || "An error occurred while accepting the offer.");
            setShowToast(true);
        }
    };

    const handleDecline = async (jobAdvId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(
                `http://localhost:9090/api/job-adv/declineInterview/${jobAdvId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(response.data);
            setMessage(response.data);
            setShowToast(true);
        } catch (error) {
            console.error("Offer decline error:", error);
            setMessage(error.response?.data || "An error occurred while declining the offer.");
            setShowToast(true);
        }
    };
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };
    const JobCard = ({ job }) => {
        const [isAccordionOpen, setIsAccordionOpen] = useState(false);

        const status = findStatusByJobAdvId(job.id);

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
                                    className="font-medium text-gray-700"> <strong> Company Name: </strong> </span>{' '}<span
                                    className="text-gray-600">{job?.companyName || '-'}</span>
                                </p>
                                <p className="text-sm">
                                <span
                                    className="font-medium text-gray-700"> <strong> Job Description: </strong> </span>{' '}<span
                                    className="text-gray-600">{job?.description || '-'}</span>
                                </p>

                                <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong>Job Position: </strong> </span>{' '}<span
                                    className="text-gray-600">{
                                    job.jobPositions?.[0]?.positionType === 'OTHER'
                                        ? job.jobPositions?.[0]?.customJobPosition?.positionName || '-'
                                        : job.jobPositions?.[0]?.positionType
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
                                        className="text-gray-600">{job?.minSalary} - {job?.maxSalary}</span>
                                </p>
                                <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Last Date: </strong> </span>{' '}
                                    <span
                                        className="text-gray-600">{job?.lastDate || '-'}</span>
                                </p>

                                <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"><strong> Travel Rest: </strong> </span>{' '}
                                    <span
                                        className="text-gray-600">{job.travelRest ? 'Yes' : 'No'}</span>
                                </p>
                                <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>License: </strong></span>{' '}
                                    <span
                                        className="text-gray-600">{job.license ? 'Yes' : 'No'}</span>
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
                                            job.workType
                                                ?.replaceAll("_", " ")
                                                ?.toLowerCase()
                                                ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                    </p>
                                    <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Employment Type: </strong></span>{' '}
                                        <span
                                            className="text-gray-600">{job.employmentType?.replaceAll("_", " ")
                                            ?.toLowerCase()
                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                    </p>

                                    <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>Country: </strong></span>{' '}
                                        <span className="text-gray-600">{job?.country || '-'}</span>
                                    </p>
                                    <p className="text-sm">
                                            <span
                                                className="font-medium text-gray-700"><strong>City: </strong></span>{' '}
                                        <span className="text-gray-600">{job?.city || '-'}</span>
                                    </p>


                                    <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Work Hours: </strong></span>{' '}
                                        <span
                                            className="text-gray-600">{job.minWorkHours} - {job.maxWorkHours}</span>
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
                                            className="text-gray-600">{job.degreeType?.replaceAll("_", " ")
                                            ?.toLowerCase()
                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                    </p>
                                    <p className="text-sm">
                           <span
                               className="font-medium text-gray-700"><strong>Job Experience: </strong></span>{' '}
                                        <span
                                            className="text-gray-600">{job.jobExperience?.replaceAll("_", " ")
                                            ?.toLowerCase()
                                            ?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</span>
                                    </p>
                                    <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Experience Years: </strong></span>{' '}
                                        <span
                                            className="text-gray-600">{job.experienceYears || '-'}</span>
                                    </p>
                                    <p className="text-sm">
                          <span
                              className="font-medium text-gray-700"><strong>Military Status: </strong></span>{' '}
                                        <span
                                            className="text-gray-600">{job.militaryStatus?.replaceAll("_", " ")
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

                                    {job.benefitTypes && job.benefitTypes?.length > 0 ? (
                                        job.benefitTypes?.map((benefit, idx) => (
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

                                    {job.technicalSkills && job.technicalSkills.length > 0 ? (
                                        job.technicalSkills.map((technicalSkills, idx) => (
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

                                    {job.socialSkills && job.socialSkills.length > 0 ? (
                                        job.socialSkills.map((socialSkills, idx) => (
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

                                    {job.languageProficiencies && job.languageProficiencies.length > 0 ? (
                                        job.languageProficiencies.map((languageProficiency, idx) => (
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
                            <div className="flex justify-between mt-6">
                                {status === 'INTERVIEW' && (
                                    <div className="flex w-full justify-between">
                                        <button
                                            onClick={() => handleInterview(job?.id)}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Confirm Interview
                                        </button>
                                        <button
                                            onClick={() => handleDecline(job?.id)}
                                            className="bg-black text-white px-4 py-2 rounded"
                                        >
                                            Decline
                                        </button>

                                    </div>
                                )}
                            </div>


                        </div>
                    </div>
                )}

            </div>

        );
    };

    const filteredApplications = applications.filter(job => {
        const status = findStatusByJobAdvId(job.id);
        return status === selectedStatus;
    });

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
                <h3>Application Status</h3>
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
                <Toast message={message} show={showToast}
                       onClose={handleCloseToast}/>
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
                        <JobCard key={job.id} job={job}/>
                    ))
                ) : (
                    <p style={{fontSize: '18px', color: '#cc304b'}}>No applications found for this status.</p>
                )}
            </div>
        </div>


    );
};

export default JobSeekerMyJobs;
