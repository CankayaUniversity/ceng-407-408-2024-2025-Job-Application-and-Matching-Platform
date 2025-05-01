import {useNavigate, useParams} from 'react-router-dom';
import { useEffect, useState } from 'react';

const JobAdvDetail = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Kullanıcı giriş yapmamış');
            navigate('/login');
            return;
        }

        fetch('http://localhost:9090/candidate/getAllJobAdv')
            .then(res => res.json())
            .then(data => {
                const selectedJob = data.find(j => j.id === parseInt(id));
                setJob(selectedJob);
            });
    }, [id]);

    const applyToJob = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:9090/candidate/applyJobAdv/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setMessage("Başvuru başarılı!");
            } else {
                const errorText = await res.text();
                setMessage("Başvuru başarısız: " + errorText);
            }
        } catch (error) {
            setMessage("Bir hata oluştu.");
        }
    };

    if (!job) return <div>Yükleniyor...</div>;

    return (
        <div>
            <h2>{job.title}</h2>
            <p><strong>Şirket:</strong> {job.company}</p>
            <p><strong>Açıklama:</strong> {job.description}</p>

            <button onClick={applyToJob}>Başvur</button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default JobAdvDetail;