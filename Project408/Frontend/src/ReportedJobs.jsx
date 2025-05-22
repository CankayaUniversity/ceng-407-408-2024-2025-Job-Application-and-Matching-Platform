import React, { useEffect, useState } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedJobs() {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const mockData = [
                {
                    id: 1,
                    title: "Frontend Developer (Intern)",
                    companyName: "Innovatech",
                    reportedByEmail: "student1@example.com",
                    reportReason: "Unrealistic job description and missing contact details.",
                    status: "ACTIVE"
                },
                {
                    id: 2,
                    title: "Backend Developer",
                    companyName: "DevSolutions",
                    reportedByEmail: "testuser@example.com",
                    reportReason: "Position already filled but still listed.",
                    status: "ACTIVE"
                }
            ];
            setJobs(mockData);
            setLoading(false);
            console.log("Mock jobs loaded:", mockData);
        }, 1000);
    }, []);

    return (
        <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
            <h1
                style={{ marginTop: '10px', marginBottom: '25px' }}
                className="text-2xl font-bold mb-6">Reported Job Advertisements</h1>

            {loading ? (
                <p className="text-gray-600">Loading data...</p>
            ) : jobs.length > 0 ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '24px',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}
                >

                    {jobs.map(job => (
                        <div
                            key={job.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '14px 18px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                backgroundColor: '#fdfdfd'
                            }}
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                                <FaBriefcase className="text-green-600" />
                                {job.title || 'Untitled Job'}
                            </h2>
                            <p className="text-sm"><strong>Company:</strong> {job.companyName}</p>
                            <p className="text-sm"><strong>Reported By:</strong> {job.reportedByEmail}</p>
                            <p className="text-sm"><strong>Reason:</strong> {job.reportReason}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className="text-blue-600 font-medium">{job.status}</span></p>
                            <button
                                className="mt-3 px-3 py-1 text-sm rounded text-white"
                                style={{ backgroundColor: '#b30000' }}
                                onClick={() => alert(`Removing job #${job.id}`)}
                            >
                                Remove Job
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-red-600">No reported jobs found.</p>
            )}

            <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
