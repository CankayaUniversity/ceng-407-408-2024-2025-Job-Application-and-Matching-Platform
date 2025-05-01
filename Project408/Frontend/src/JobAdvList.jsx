import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                } else {
                    const errorText = await res.text();
                    setMessage("Application failed! " + errorText);
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
                    height: isAccordionOpen ? '550px' : '250px',
                    overflowY: 'auto',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div>
                    <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>{job.description}</h3>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>🏢 {job.companyName || "Unknown Company"}</p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💼 {job.workType || "Unknown"}</p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>💰 {job.minSalary} ₺ - {job.maxSalary} ₺</p>
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
                        <p><strong>🕒 Duration:</strong> {job.minWorkHours} - {job.maxWorkHours} hours/week</p>
                        <p><strong>📅 Last Application:</strong> {new Date(job.lastDate).toLocaleDateString()}</p>
                        <p><strong>🧳 Travel Allowance:</strong> {job.travelRest ? "Yes" : "No"}</p>
                        <p><strong>🎁 Benefits:</strong> {job.benefitTypes?.join(', ') || "None"}</p>
                        <p><strong>🗣️ Languages:</strong> {job.languageProficiencies?.join(', ')}</p>
                        <p><strong>🤝 Social Skills:</strong> {job.socialSkills?.join(', ')}</p>
                        <p><strong>🧠 Technical Skills:</strong> {job.technicalSkills?.join(', ')}</p>
                        <p><strong>📌 Position Types:</strong> {job.positionTypes?.join(', ')}</p>
                        <p><strong>🌟 Special Positions:</strong> {job.customJobPositions?.join(', ')}</p>

                        {status ? (
                            <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#cc304b' }}>
                                Application Status: {status}
                            </p>
                        ) : (
                            <button
                                onClick={() => handleApply(job.id)}
                                style={{ ...buttonStyle, marginTop: '8px' }}
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
                <h2 style={{ textAlign: 'center', fontSize: '30px' }}>Job Listings</h2>
                {message && <p style={{ color: '#cc304b', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                }}>
                    <input type="text" name="position" value={filters.position} onChange={handleFilterChange} placeholder="Position" style={inputStyle} />
                    <input type="text" name="workType" value={filters.workType} onChange={handleFilterChange} placeholder="Work Type" style={inputStyle} />
                    <input type="number" name="minSalary" value={filters.minSalary} onChange={handleFilterChange} placeholder="Min Salary" style={inputStyle} />
                    <input type="number" name="maxSalary" value={filters.maxSalary} onChange={handleFilterChange} placeholder="Max Salary" style={inputStyle} />
                    <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Location (City)" style={inputStyle} />
                    <input type="text" name="company" value={filters.company} onChange={handleFilterChange} placeholder="Company" style={inputStyle} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button onClick={filterJobs} style={{ ...buttonStyle, marginTop: '8px' }}>Filter</button>
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

export default JobAdvList;
