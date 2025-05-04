import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicationsPage = () => {
    const [jobAdvs, setJobAdvs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyJobAdvs();
    }, []);

    const fetchMyJobAdvs = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:9090/api/job-adv/my-jobadvs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            setJobAdvs(response.data); // Job ilanlarını state'e yükle
            setLoading(false);
        } catch (error) {
            setError('İlanlar çekilirken hata oluştu.'); // Hata durumunda mesaj göster
            setLoading(false);
        }
    };

    const handleSelectJob = (job) => {
        console.log(job);
        setSelectedJob(job); // Seçilen ilanı set et
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
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    };

    const JobCard = ({ job }) => {
        const isSelected = selectedJob && selectedJob.id === job.id;

        return (
            <div
                style={{
                    border: '1px solid #bdc3c7',
                    borderRadius: '8px',
                    padding: '10px',
                    backgroundColor: isSelected ? '#2c2f34' : '#ecf0f1', // Seçilen kart siyah olacak
                    color: isSelected ? 'white' : '#2c3e50', // Seçilen kartta yazı beyaz olacak
                    cursor: 'pointer',
                    textAlign: 'center',
                    width: '100%',
                    marginBottom: '16px',
                }}
                onClick={() => handleSelectJob(job)} // İlan seçildiğinde detaylar sağda gösterilsin

            >
                <h3 style={{margin: '0', fontSize: '20px', fontWeight: 'bold'}}>{job.description}</h3>
                <p style={{
                    fontSize: '16px',
                    marginBottom: '5px'
                }}>🏢 {job.companyName || "Unknown Company"}</p>
                <p style={{
                    fontSize: '16px',
                    marginBottom: '5px'
                }}>💼 {job.workType || "Not Specified"}</p>
                <p style={{fontSize: '16px', marginBottom: '5px'}}>💰 {job.minSalary} ₺
                    - {job.maxSalary} ₺</p>
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
            flexDirection: 'row',
            maxWidth: '100vw',
            margin: '0 auto',
            overflowY: 'auto',
        }}>
            {/* Left Menu: Job Ad Listings */}
            <div style={{
                width: '300px',
                marginRight: '20px',
                paddingRight: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderRight: '2px solid #ccc',
                overflowY: 'auto', // Sol menüde taşan içeriği kaydırılabilir yapar
                maxHeight: '100vh',// İlk çizgi

            }}>
                <h3>My Jobs</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    jobAdvs.map((job) => (
                        <JobCard key={job.id} job={job}/>
                    ))
                )}
                <div className="mt-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => navigate("/employer/create-job")}
                    >
                        Create Job Advertisement
                    </button>
                </div>
            </div>


            {/* Right Content: Job Details */}
            <div style={{
                flexGrow: 1,
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', // İçeriği yukarıda tutmak için
            }}>
                {selectedJob ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedJob.companyName}</h2>
                        <p><strong>Description:</strong> {selectedJob.description}</p>
                        <p><strong>Salary Range:</strong> {selectedJob.minSalary} - {selectedJob.maxSalary}</p>
                        <p><strong>Last Date:</strong> {new Date(selectedJob.lastDate).toLocaleDateString()}</p>
                        <p><strong>WorkType:</strong> {selectedJob.workType}</p>
                        <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
                        <p><strong>Country:</strong> {selectedJob.country}</p>

                        {/* Başvuruları Görüntüle butonu */}
                        <div className="mt-4">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => navigate("/candidates", { state: { selectedJob } })}

                            >
                                View Applications
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: '#7f8c8d' }}>Select an advertisement, details will be displayed here.</p>
                )}
            </div>
        </div>
    );
};

export default ApplicationsPage;
