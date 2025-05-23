import React, { useEffect, useState, useCallback } from 'react';
import { FaUser } from 'react-icons/fa';
import Toast from './components/Toast';
import axios from 'axios';

export default function ReportedUsers() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReportedUsers = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Authentication token not found. Please log in.');
            setShowToast(true);
            setLoading(false);
            setUsers([]);
            return;
        }
        try {
            const response = await axios.get('http://localhost:9090/admin/reportedUsers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUsers(response.data);
            if (response.data.length === 0) {
                setMessage('No reported users found.');
                setShowToast(true);
            }
        } catch (error) {
            console.error("Failed to fetch reported users:", error);
            setMessage(error.response?.data?.message || error.message || 'Failed to fetch reported users');
            setShowToast(true);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportedUsers();
    }, [fetchReportedUsers]);

    const handleBan = async (userId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage('Authentication token not found. Please log in.');
            setShowToast(true);
            return;
        }
        try {
            await axios.post(`http://localhost:9090/admin/banUser/${userId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage(`User #${userId} has been banned successfully.`);
            setShowToast(true);
            setUsers(prevUsers => prevUsers.map(user => 
                user.id === userId ? { ...user, status: 'BANNED' } : user
            ));
        } catch (error) {
            console.error("Failed to ban user:", error);
            setMessage(error.response?.data?.message || error.message || 'Failed to ban user');
            setShowToast(true);
        }
    };

    return (
        <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
            <h1
                style={{ marginTop: '10px', marginBottom: '25px' }}
                className="text-2xl font-bold mb-6">Reported Users</h1>

            {loading ? (
                <p className="text-gray-600">Loading data...</p>
            ) : users.length > 0 ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '24px',
                        maxWidth: '1000px',
                        margin: '0 auto'
                    }}
                >
                    {users.map(user => (
                        <div
                            key={user.id}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '14px 18px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                                backgroundColor: '#fdfdfd'
                            }}
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                                <FaUser className="text-red-600" />
                                {user.name}
                            </h2>
                            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                            <p className="text-sm"><strong>Reason:</strong> {user.reportReason}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className="text-blue-600 font-medium">{user.status}</span></p>
                            <button
                                className="mt-3 px-3 py-1 text-sm rounded text-white"
                                style={{ backgroundColor: '#b30000' }}
                                onClick={() => handleBan(user.id)}
                            >
                                Ban User
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
