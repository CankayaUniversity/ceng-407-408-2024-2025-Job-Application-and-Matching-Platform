import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const JobOffersEmployer = () => {
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
            const response = await fetch('http://localhost:9090/api/job-offer/empOffers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch offers');
            }

            const data = await response.json();
            console.log(data);
            setOffers(data);
        } catch (err) {
            setMessage('Error: ' + err.message);
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
            console.error("Offer handling error:", error);
        }
    };

    const handleDecline = async (offerId) => {
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
            console.error("Decline offer error:", error);
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
        const { candidate } = job; // Assuming candidate is part of the job object
        const {status} = job;


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
                    <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>
                        {candidate?.firstName} {candidate?.lastName}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
                        🏢 {candidate?.profileDetails?.aboutMe || 'N/A'}
                    </p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
                        💼 {candidate?.jobPreferences?.preferredWorkType || "Unknown"}
                    </p>
                    <p style={{ fontSize: '16px', color: '#383e3e', marginBottom: '5px' }}>
                        💰 {candidate?.jobPreferences?.expectedSalary} ₺
                    </p>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} style={buttonStyle}>
                        {isAccordionOpen ? '🔽 Hide' : '🔼 Show Details'}
                    </button>
                </div>

                {isAccordionOpen && (
                    <div style={{ marginTop: '10px', lineHeight: '1.4', fontSize: '14px' }}>
                        <p><strong>🕒 Duration:</strong> {candidate?.jobPreferences?.minWorkHour} - {candidate?.jobPreferences?.maxWorkHour} hours/week</p>
                        <p><strong>🧳 Travel Permission:</strong> {candidate?.jobPreferences?.canTravel ? "Yes" : "No"}</p>
                        <p><strong>🗣️ Languages:</strong> {candidate?.languageProficiency?.map(lang => lang.language).join(', ')}</p>
                        <p><strong>🤝 Social Skills:</strong> {candidate?.socialSkills?.map(skill => skill.skillName).join(', ')}</p>
                        <p><strong>🧠 Technical Skills:</strong> {candidate?.skills?.map(skill => skill.skillName).join(', ')}</p>
                        <p><strong>📌 Position Types:</strong> {candidate?.jobPreferences?.preferredPositions?.map(pos => pos.positionType).filter(Boolean).join(', ')}</p>
                        <p><strong>🌟 Custom Positions:</strong> {candidate?.jobPreferences?.preferredPositions?.map(pos => pos.customJobPosition?.positionName).filter(name => name).join(', ')}</p>
                        <p><strong>🎓 Education Type:</strong> {candidate?.education?.educationType || "Not specified"}</p>
                        {status=== "ACCEPTED" && (
                            <>
                                <div>
                                    <strong><h6>📞 Contact Information</h6></strong>
                                    <p><strong>Phone:</strong> {candidate?.contactInformation?.phoneNumber || 'N/A'}</p>
                                    <p><strong>Country:</strong> {candidate?.contactInformation?.country?.name || 'N/A'}
                                    </p>
                                    <p><strong>City:</strong> {candidate?.contactInformation?.city?.name || 'N/A'}</p>
                                </div>

                                <div>
                                    <strong><h6>📜 References</h6></strong>
                                    {candidate?.references?.map((ref, index) => (
                                        <div key={index}>
                                            <p><strong>Name:</strong> {ref.referenceName || 'N/A'}</p>
                                            <p><strong>Company:</strong> {ref.referenceCompany || 'N/A'}</p>
                                            <p><strong>Job Title:</strong> {ref.referenceJobTitle || 'N/A'}</p>
                                            <p><strong>Contact Info:</strong> {ref.referenceContactInfo || 'N/A'}</p>
                                            <p><strong>Years Worked:</strong> {ref.referenceYearsWorked || 'N/A'}</p>
                                        </div>
                                    ))}
                                </div>

                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const filteredApplications = offers.filter(job => job.status === selectedStatus);

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
            <div style={{
                width: '300px',
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

            <div style={{
                flexGrow: 1,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                justifyContent: 'center',
            }}>
                {loading ? (
                    <p>Loading offers...</p>
                ) : filteredApplications.length > 0 ? (
                    filteredApplications.map(job => (
                        <JobCard key={job.id} job={job} />
                    ))
                ) : (
                    <p style={{ fontSize: '18px', color: '#cc304b' }}>No offers found for this status.</p>
                )}
            </div>
        </div>
    );
};

export default JobOffersEmployer;
