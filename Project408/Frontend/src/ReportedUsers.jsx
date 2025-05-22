import React, { useEffect, useState } from 'react';
import Toast from './components/Toast';
import { FaUser } from 'react-icons/fa';

export default function ReportedUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchReportedUsers();
  }, []);

  const fetchReportedUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:9090/api/admin/reported-users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch reported users');

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setMessage(err.message);
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6">Reported Users</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map(user => (
            <div key={user.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
                <FaUser className="text-blue-600" />
                {user.fullName || 'Unnamed User'}
              </h2>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Reported By:</strong> {user.reportedByEmail}</p>
              <p><strong>Reason:</strong> {user.reportReason}</p>
              <p><strong>Status:</strong> {user.status}</p>
              <button
                className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                onClick={() => alert('Ban/disable user feature can go here')}>
                Disable Account
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-red-600">No reported users found.</p>
      )}

      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
