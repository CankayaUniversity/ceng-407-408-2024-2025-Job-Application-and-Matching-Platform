import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {BriefcaseIcon, ClipboardDocumentCheckIcon} from "@heroicons/react/24/outline/index.js";
import Toast from "./components/Toast.jsx";


const JobAdvList = () => {
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
        country: '',
        company: ''
    });

    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const applyFilters = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User not logged in');
            setMessage("Please log in to filter jobs.");
            setShowToast(true);
            return;
        }

        const filterPayload = {
            jobPositionIds: [],
            workTypes: filters.workType ? [filters.workType] : [],
            minSalary: filters.minSalary ? parseFloat(filters.minSalary) : null,
            maxSalary: filters.maxSalary ? parseFloat(filters.maxSalary) : null,
            cities: filters.city ? [filters.city] : [],
            countries: filters.country ? [filters.country] : [],
            companyIds: [],
        };

        if (filters.position) {
            console.warn("Position filter by name is not fully implemented. Please use ID-based filtering if available or enhance backend.");
        }
        if (filters.company) {
            console.warn("Company filter by name is not fully implemented. Please use ID-based filtering if available or enhance backend.");
        }

        try {
            const response = await fetch('http://localhost:9090/candidate/filterJobAdv', {
                method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(filterPayload)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch filtered jobs: ${errorText}`);
            }
            const data = await response.json();
                setFilteredJobs(data);
            if (data.length === 0) {
                setMessage("No jobs found matching your criteria.");
                setShowToast(true);
            }
        } catch (err) {
            console.error("Unable to fetch filtered job ads", err);
            setMessage(err.message || "Error fetching filtered jobs.");
            setShowToast(true);
            setFilteredJobs([]);
        }
    };

    useEffect(() => {

        const token = localStorage.getItem('token');
        if (token) {
        fetch('http://localhost:9090/candidate/myApplications', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch applications');
                return res.json();
            })
            .then(data => setApplications(data))
            .catch(err => {
                console.error("Error fetching applications:", err);
            });
        }
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
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
                setMessage("Please log in.");
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

                    setMessage("Application successful!");
                    setShowToast(true);

                } else {
                    const errorText = await res.text();
                    setMessage("Application failed! " + errorText);
                    setShowToast(true);
                }
            } catch (error) {
                setMessage("An error occurred.");
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
                                className="text-blue-600" style={{width: '20px', height: '20px'}}/> {job?.description || '-'}
                            </h3>
                            <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">


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
                                {isAccordionOpen ? '🔽 Hide Details' : '🔼 Show Details'}
                            </button>
                            {!application && (
                                <button
                                    onClick={() => handleApply(job.id)}
                                    style={{...buttonStyle, backgroundColor: '#28a745'}}
                                >
                                    Apply
                                </button>
                            )}
                            {application && (
                                <span style={{
                                    padding: '8px 12px',
                                    backgroundColor: status === 'PENDING' ? '#ffc107' : (status === 'ACCEPTED' || status === 'INTERVIEW' ? '#28a745' : '#dc3545'),
                                    color: status === 'PENDING' ? 'black' : 'white',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {status ? status.replace("_", " ") : 'APPLIED'}
                                </span>
                            )}
                        </div>

                        {isAccordionOpen && (
                            <div style={{textAlign: 'left', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px'}}>
                                <h4 className="text-md font-semibold mb-2">Job Qualifications:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                                    <li>Degree: {job.degreeType || '-'}</li>
                                    <li>Experience: {job.jobExperience || '-'} ({job.experienceYears || 0} years)</li>
                                    <li>Military Status: {job.militaryStatus || '-'}</li>
                                </ul>

                                {job.technicalSkills?.length > 0 && (
                                    <>
                                        <h5 className="text-sm font-semibold">Technical Skills:</h5>
                                        <ul className="list-disc list-inside text-xs text-gray-500 mb-2">
                                            {job.technicalSkills.map(skill => (
                                                <li key={skill.positionName}>{skill.positionName} ({skill.skillLevel || 'Any'})</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {job.socialSkills?.length > 0 && (
                                    <>
                                        <h5 className="text-sm font-semibold">Social Skills:</h5>
                                        <ul className="list-disc list-inside text-xs text-gray-500 mb-2">
                                            {job.socialSkills.map(skill => (
                                                <li key={skill.positionName}>{skill.positionName} ({skill.skillLevel || 'Any'})</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {job.languageProficiencies?.length > 0 && (
                                    <>
                                        <h5 className="text-sm font-semibold">Languages:</h5>
                                        <ul className="list-disc list-inside text-xs text-gray-500 mb-2">
                                            {job.languageProficiencies.map(lang => (
                                                <li key={lang.language}>{lang.language} (R:{lang.readingLevel} W:{lang.writingLevel} S:{lang.speakingLevel})</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                <h4 className="text-md font-semibold mb-2 mt-3">Job Conditions:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                                   <li>Work Type: {job.workType?.replaceAll("_", " ")?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</li>
                                    <li>Employment Type: {job.employmentType?.replaceAll("_", " ")?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase()) || '-'}</li>
                                    <li>Location: {job.city || '-'}, {job.country || '-'}</li>
                                    <li>Work Hours: {job.minWorkHours || 'N/A'} - {job.maxWorkHours || 'N/A'} per week</li>
                                </ul>

                                {job.benefitTypes?.length > 0 && (
                                    <>
                                        <h4 className="text-md font-semibold mb-2 mt-3">Benefits:</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-600">
                                            {job.benefitTypes.map(benefit => (
                                                 <li key={benefit.benefitType}>{benefit.benefitType?.replaceAll("_", " ")?.toLowerCase()?.replace(/\b\w/g, c => c.toUpperCase())}{benefit.description ? `: ${benefit.description}` : ''}</li>
                                            ))}
                                        </ul>
                                    </>
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
                            <h2 style={{textAlign: 'center', fontSize: '30px'}}>Job Listings</h2>
                            <Toast message={message} show={showToast} onClose={handleCloseToast} />

                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center',
                                marginBottom: '16px',
                                flexWrap: 'wrap'
                            }}>
                                <input type="text" name="position" value={filters.position}
                                       onChange={handleFilterChange}
                                       placeholder="Position" style={inputStyle}/>
                                <input type="text" name="workType" value={filters.workType}
                                       onChange={handleFilterChange}
                                       placeholder="Work Type" style={inputStyle}/>
                                <input type="number" name="minSalary" value={filters.minSalary}
                                       onChange={handleFilterChange}
                                       placeholder="Min Salary" style={inputStyle}/>
                                <input type="number" name="maxSalary" value={filters.maxSalary}
                                       onChange={handleFilterChange}
                                       placeholder="Max Salary" style={inputStyle}/>
                                <input type="text" name="city" value={filters.city} onChange={handleFilterChange}
                                       placeholder="Location (City)" style={inputStyle}/>
                                <input type="text" name="company" value={filters.company} onChange={handleFilterChange}
                                       placeholder="Company" style={inputStyle}/>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <button onClick={applyFilters} style={{...buttonStyle, marginTop: '8px'}}>Filter</button>
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
                                    <JobCard key={job.id} job={job} applications={applications}/>
                                );
                            })}
                        </div>
                    </div>
                    );
                    };

                    export default JobAdvList;
