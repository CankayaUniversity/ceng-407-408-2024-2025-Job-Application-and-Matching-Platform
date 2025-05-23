import React, { useEffect, useState, useCallback } from 'react';
import { FaBriefcase, FaTrash } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedJobs() {
    const [jobs, setJobs] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReportedJobs = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Admin token not found. Please log in.");
            setShowToast(true);
            setLoading(false);
            setJobs([]);
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/admin/reportedJobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch reported jobs: ${errorText || response.status}`);
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error("Error fetching reported jobs:", error);
            setMessage(error.message || "Could not fetch reported jobs.");
            setShowToast(true);
            setJobs([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportedJobs();
    }, [fetchReportedJobs]);

    const handleRemoveJob = async (jobId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Admin token not found. Please log in.");
            setShowToast(true);
            return;
        }
        try {
            const response = await fetch(`http://localhost:9090/admin/removeJob/${jobId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to remove job: ${errorText || response.status}`);
            }
            setMessage(`Job #${jobId} has been successfully removed.`);
            setShowToast(true);
            fetchReportedJobs(); // Refresh the list
        } catch (error) {
            console.error("Error removing job:", error);
            setMessage(error.message || "Could not remove job.");
            setShowToast(true);
        }
    };

    return (
        <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
            <h1
                style={{ marginTop: '10px', marginBottom: '25px' }}
                className="text-2xl font-bold mb-6">Reported Job Advertisements</h1>

            {loading ? (
                <p className="text-gray-600">Loading reported jobs...</p>
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
                                backgroundColor: job.status === 'REMOVED' ? '#ffebee' : '#fdfdfd' 
                            }}
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                                <FaBriefcase className={job.status === 'REMOVED' ? "text-gray-500" : "text-green-600"} />
                                {job.title || 'Untitled Job'}
                            </h2>
                            <p className="text-sm"><strong>Company:</strong> {job.companyName}</p>
                            <p className="text-sm"><strong>Reported By:</strong> {job.reportedByEmail}</p>
                            <p className="text-sm"><strong>Reason:</strong> {job.reportReason}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${job.status === 'REMOVED' ? 'text-red-700' : 'text-blue-600'}`}>{job.status}</span></p>
                            {job.status !== 'REMOVED' && (
                                <button
                                    className="mt-3 px-3 py-1 text-sm rounded text-white flex items-center gap-1"
                                    style={{ backgroundColor: '#b30000' }}
                                    onClick={() => handleRemoveJob(job.id)}
                                >
                                    <FaTrash /> Remove Job
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">No reported jobs found or all reports have been handled.</p>
            )}

            <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
