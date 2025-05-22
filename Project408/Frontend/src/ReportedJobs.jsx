import React, { useEffect, useState } from 'react';
import Toast from './components/Toast';
import { FaBriefcase } from 'react-icons/fa';

export default function ReportedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchReportedJobs();
  }, []);

  const fetchReportedJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/admin/reported-jobs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reported job advertisements');

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setMessage(err.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Reported Job Advertisements</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div key={job.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <FaBriefcase className="text-green-600" />
                {job.title || 'Untitled Job'}
              </h2>
              <p><strong>Company:</strong> {job.companyName || '-'}</p>
              <p><strong>Reported By:</strong> {job.reportedByEmail}</p>
              <p><strong>Reason:</strong> {job.reportReason}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={() => alert('You can deactivate or remove this job')}>
                Remove Job
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No reported job advertisements found.</p>
      )}

      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
