import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const JobAdvList = () => {
    const [jobs, setJobs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Kullanıcı giriş yapmamış');
            navigate('/login');
            return;
        }

        fetch('http://localhost:9090/candidate/getAllJobAdv', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())  // Gelen veriyi JSON'a çevir
            .then(data => {
                const uniqueJobs = Array.from(new Set(data.map(job => job.id)))
                    .map(id => data.find(job => job.id === id));
                setJobs(uniqueJobs);  // Tekrarlanan iş ilanlarını filtreleyin
            })

            .catch(err => console.error("İlanlar alınamadı", err));
    }, [navigate]);

    const handleClick = (id) => {
        navigate(`/jobs/${id}`);
    };

    return (
        <div>
            <h2>Tüm İş İlanları</h2>
            <ul>
                {jobs.map((job) => (
                    <li key={job.id} onClick={() => handleClick(job.id)} style={{ cursor: "pointer", marginBottom: '10px' }}>
                        <strong>{job.description}</strong>
                        <br />
                        <span>Şirket: {job.company?.name || "Bilinmeyen Şirket"}</span>
                        <br />
                        <span>İş Türü: {job.jobCondition?.workType || "Bilinmiyor"}</span>
                        <br />
                        <span>Çalışma Süresi: {job.jobCondition?.minWorkHours} saat/hafta</span>
                        <br />
                        <span>Minimum Maaş: {job.minSalary}</span>
                        <br />
                        <span>Maximum Maaş: {job.maxSalary}</span>
                        <br />
                        <span>Son Başvuru Tarihi: {new Date(job.lastDate).toLocaleDateString()}</span>
                        <br />
                        <span>Gezi İzni: {job.travelRest ? "Evet" : "Hayır"}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JobAdvList;
