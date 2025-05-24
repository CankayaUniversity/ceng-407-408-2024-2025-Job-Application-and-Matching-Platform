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
        company: ''
    });

    const navigate = useNavigate();

    const [showToast, setShowToast] = useState(false);

    const handleCloseToast = () => {
        setShowToast(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('User not logged in');
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
            .catch(err => console.error("Unable to fetch job ads", err));

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
                job.jobPositions?.some(position => {
                    const posType = position.positionType || '';
                    const customPosName = position.customJobPosition?.positionName || '';
                    const filterValue = filters.position.toLowerCase();

                    if (posType.toLowerCase() === 'other') {
                        return customPosName.toLowerCase().includes(filterValue);
                    } else {
                        return posType.toLowerCase().includes(filterValue);
                    }
                })
            );
        }


        if (filters.workType) {
            filtered = filtered.filter(job =>
                job.workType
                    ?.replaceAll("_", " ")
                    .toLowerCase()
                    .includes(filters.workType.toLowerCase())
            );
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
                                className="text-blue-600"
                                style={{width: '20px', height: '20px'}}/> {job?.description || '-'}
                            </h3>
                            <div className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50 shadow-sm">
                                <p className="text-sm">
                                    <span
                                        className="font-medium text-gray-700"> <strong> Company: </strong> </span>{' '}
                                    <span
                                        className="text-gray-600">{job?.companyName || '-'}</span>
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

                <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    gap: '8px',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <button
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        style={buttonStyle}
                    >
                        {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
                    </button>

                    <span style={{
                        padding: '8px 12px',
                        backgroundColor: status === 'PENDING' ? '#ffc107' : (status === 'ACCEPTED' || status === 'INTERVIEW' ? '#28a745' : '#dc3545'),
                        color: status === 'PENDING' ? 'black' : 'white',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                                    {status ? status.replace("_", " ") : 'Not Applied'}
                                </span>
                </div>


                {isAccordionOpen && (
                    <div style={{marginTop: '10px', lineHeight: '1.4', fontSize: '14px'}}>
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


                            </div>
                        </div>

                        {status ? (
                            <p style={{marginTop: '8px', fontWeight: 'bold', color: '#cc304b'}}>
                                Application Status: {status}
                            </p>
                        ) : (
                            <button
                                onClick={() => handleApply(job.id)}
                                style={{...buttonStyle, marginTop: '12px'}}
                            >
                                🚀 Apply
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
                <h2 style={{textAlign: 'center', fontSize: '30px'}}>Job Listings</h2>
                {/*{message &&*/}
                {/*    <p style={{color: '#cc304b', textAlign: 'center', fontSize: '14px'}}>{message}</p>}*/}
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
                    <button onClick={filterJobs} style={{...buttonStyle, marginTop: '8px'}}>Filter</button>
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