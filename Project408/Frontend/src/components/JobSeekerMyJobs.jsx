import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    };

    const findStatusByJobAdvId = (jobAdvId) => {
        const statusObj = statuses.find(status => status.jobAdvId === jobAdvId);
        return statusObj ? statusObj.status : null;
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
                    height: isAccordionOpen ? '550px' : '250px',
                    overflowY: 'auto',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div>
                    <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>{job.description}</h3>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>🏢 {job.companyName || "Unknown Company"}</p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💼 {job.workType || "Not Specified"}</p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💰 {job.minSalary} ₺ - {job.maxSalary} ₺</p>

                    {/* Application Status */}
                    {status && (
                        <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#cc304b' }}>
                            Application Status: {status}
                        </p>
                    )}
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        style={buttonStyle}
                    >
                        {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
                    </button>
                </div>

                {isAccordionOpen && (
                    <div style={{ marginTop: '10px', lineHeight: '1.4', fontSize: '14px' }}>
                        <p><strong>🕒 Hours:</strong> {job.minWorkHours} - {job.maxWorkHours} hours/week</p>
                        <p><strong>📅 Deadline:</strong> {new Date(job.lastDate).toLocaleDateString()}</p>
                        <p><strong>🧳 Travel Permission:</strong> {job.travelRest ? "Yes" : "No"}</p>
                        <p><strong>🎁 Benefits:</strong> {job.benefitTypes?.join(', ') || "None"}</p>
                        <p><strong>🗣️ Languages:</strong> {job.languageProficiencies?.join(', ')}</p>
                        <p><strong>🤝 Social Skills:</strong> {job.socialSkills?.join(', ')}</p>
                        <p><strong>🧠 Technical Skills:</strong> {job.technicalSkills?.join(', ')}</p>
                        <p><strong>📌 Position Types:</strong> {job.positionTypes?.join(', ')}</p>
                        <p><strong>🌟 Special Positions:</strong> {job.customJobPositions?.join(', ')}</p>
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
                        <JobCard key={job.id} job={job} />
                    ))
                ) : (
                    <p style={{ fontSize: '18px', color: '#cc304b' }}>No applications found for this status.</p>
                )}
            </div>
        </div>
    );
};

export default JobSeekerMyJobs;
