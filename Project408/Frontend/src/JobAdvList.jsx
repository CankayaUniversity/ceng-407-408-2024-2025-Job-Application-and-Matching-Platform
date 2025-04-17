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
            console.log('Kullanıcı giriş yapmamış');
            return;
        }

        // Fetch jobs
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
            .catch(err => console.error("İlanlar alınamadı", err));

        // Fetch applications (status + jobAdvId)
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
        const [applicationStatus, setApplicationStatus] = useState({}); // Object to store status by job id

        const application = applications.find(app => app.jobAdvId === job.id);
        const status = application ? application.status : null; // Başvuru durumunu al

        const handleApply = async (jobId) => {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage("Lütfen giriş yapın.");
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
                    // Başvuru başarılı, başvuruları tekrar alalım
                    const statusResponse = await fetch('http://localhost:9090/candidate/myApplications', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const statusData = await statusResponse.json();
                    setApplications(statusData); // applications'ı tekrar güncelle

                    setMessage("Başvuru başarılı!");
                } else {
                    const errorText = await res.text();
                    setMessage("Başvuru başarısız: " + errorText);
                }
            } catch (error) {
                setMessage("Bir hata oluştu.");
            }
        };

        return (
            <div
                style={{
                    border: '1px solid #bdc3c7',
                    borderRadius: '8px',
                    padding: '12px',
                    backgroundColor: '#f7f7f7',
                    color: '#2f2f2f',
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
                    <h3 style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>{job.description}</h3>
                    <p style={{ fontSize: '12px', color: '#383e3e', marginBottom: '5px' }}>🏢 {job.companyName || "Bilinmeyen Şirket"}</p>
                    <p style={{ fontSize: '12px', color: '#383e3e', marginBottom: '5px' }}>💼 {job.workType || "Bilinmiyor"}</p>
                    <p style={{ fontSize: '12px', color: '#383e3e', marginBottom: '5px' }}>💰 {job.minSalary} ₺ - {job.maxSalary} ₺</p>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                        style={buttonStyle}
                    >
                        {isAccordionOpen ? '🔽 Gizle' : '🔼 Detayları Göster'}
                    </button>
                </div>

                {isAccordionOpen && (
                    <div style={{ marginTop: '10px', lineHeight: '1.4', fontSize: '12px' }}>
                        <p><strong>🕒 Süre:</strong> {job.minWorkHours} - {job.maxWorkHours} saat/hafta</p>
                        <p><strong>📅 Son Başvuru:</strong> {new Date(job.lastDate).toLocaleDateString()}</p>
                        <p><strong>🧳 Gezi İzni:</strong> {job.travelRest ? "Evet" : "Hayır"}</p>
                        <p><strong>🎁 İzinler:</strong> {job.benefitTypes?.join(', ') || "Yok"}</p>
                        <p><strong>🗣️ Diller:</strong> {job.languageProficiencies?.join(', ')}</p>
                        <p><strong>🤝 Sosyal Beceriler:</strong> {job.socialSkills?.join(', ')}</p>
                        <p><strong>🧠 Teknik Beceriler:</strong> {job.technicalSkills?.join(', ')}</p>
                        <p><strong>📌 Pozisyon Türleri:</strong> {job.positionTypes?.join(', ')}</p>
                        <p><strong>🌟 Özel Pozisyonlar:</strong> {job.customJobPositions?.join(', ')}</p>

                        {status ? (
                            // Başvuru durumu varsa, durumu göster
                            <p style={{ marginTop: '8px', fontWeight: 'bold', color: '#cc304b' }}>
                                Başvuru Durumu: {status}
                            </p>
                        ) : (
                            // Başvuru durumu yoksa, Başvur butonunu göster
                            <button
                                onClick={() => handleApply(job.id)}
                                style={{ ...buttonStyle, marginTop: '8px' }}
                            >
                                🚀 Başvur
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };



    return (
        <div style={{
            backgroundColor: '#2c3e50',
            padding: '20px',
            minHeight: '100vh',
            color: '#f6f5f5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            maxWidth: '100vw',
            margin: '0 auto',
        }}>
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <button onClick={() => navigate('/dashboard')} style={buttonStyle}>🏠 Profile</button>
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                <h2 style={{ textAlign: 'center', fontSize: '30px' }}>İş İlanları</h2>
                {message && <p style={{ color: '#df2434', textAlign: 'center', fontSize: '14px' }}>{message}</p>}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    flexWrap: 'wrap'
                }}>
                    <input type="text" name="position" value={filters.position} onChange={handleFilterChange} placeholder="Pozisyon" style={inputStyle} />
                    <input type="text" name="workType" value={filters.workType} onChange={handleFilterChange} placeholder="İş Tipi" style={inputStyle} />
                    <input type="number" name="minSalary" value={filters.minSalary} onChange={handleFilterChange} placeholder="Min Maaş" style={inputStyle} />
                    <input type="number" name="maxSalary" value={filters.maxSalary} onChange={handleFilterChange} placeholder="Max Maaş" style={inputStyle} />
                    <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Konum (Şehir)" style={inputStyle} />
                    <input type="text" name="company" value={filters.company} onChange={handleFilterChange} placeholder="Şirket" style={inputStyle} />
                </div>
                <div style={{ textAlign: 'center' }}>
                    <button onClick={filterJobs} style={{ ...buttonStyle, marginTop: '8px' }}>Filtrele</button>
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
