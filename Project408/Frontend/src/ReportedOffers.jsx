import React, { useEffect, useState } from 'react';
import Toast from './components/Toast';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export default function ReportedOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchReportedOffers();
  }, []);

  const fetchReportedOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/admin/reported-offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reported blogs');

      const data = await response.json();
      setOffers(data);
    } catch (err) {
      setMessage(err.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Reported Job Blogs</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : offers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map(offer => (
            <div key={offer.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                {offer.jobTitle}
              </h2>
              <p><strong>Company:</strong> {offer.companyName}</p>
              <p><strong>Reported By:</strong> {offer.reportedByEmail}</p>
              <p><strong>Reason:</strong> {offer.reportReason}</p>
              <p><strong>Status:</strong> {offer.status}</p>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={() => alert('Silme/filtresi eklenecek')}>
                Remove Offer
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No reported blogs found.</p>
      )}

      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
