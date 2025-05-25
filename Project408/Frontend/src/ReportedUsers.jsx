import React, { useEffect, useState, useCallback } from 'react';
import { FaBan, FaUser } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedUsers() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReportedUsers = useCallback(async () => {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        if (!token) {
            setMessage("Admin token not found. Please log in.");
            setShowToast(true);
            setLoading(false);
            setUsers([]);
            return;
        }

        try {
            const response = await fetch('http://localhost:9090/admin/reportedUsers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch reported users: ${errorText || response.status}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching reported users:", error);
            setMessage(error.message || "Could not fetch reported users.");
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
            setMessage("Admin token not found. Please log in.");
            setShowToast(true);
            return;
        }
        try {
            const response = await fetch(`http://localhost:9090/admin/banUser/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to ban user: ${errorText || response.status}`);
            }
            setMessage(`User #${userId} has been successfully banned.`);
            setShowToast(true);
            // Refresh the list of users after banning
            fetchReportedUsers(); 
        } catch (error) {
            console.error("Error banning user:", error);
            setMessage(error.message || "Could not ban user.");
            setShowToast(true);
        }
    };

    return (
        <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
            <h2
                style={{ marginTop: '10px', marginBottom: '25px' }}
                className="text-2xl font-bold mb-6">Reported Users</h2>

            {loading ? (
                <p className="text-gray-600">Loading reported users...</p>
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
                                backgroundColor: user.status === 'BANNED' ? '#ffebee' : '#fdfdfd' // Highlight if banned
                            }}
                        >
                            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                                <FaUser className={user.status === 'BANNED' ? "text-gray-500" : "text-red-600"} />
                                {user.name}
                            </h2>
                            <p className="text-sm"><strong>Email:</strong> {user.email}</p>
                            <p className="text-sm"><strong>Reason:</strong> {user.reportReason}</p>
                            <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${user.status === 'BANNED' ? 'text-red-700' : 'text-blue-600'}`}>{user.status}</span></p>
                            {user.status !== 'BANNED' && (
                                <button
                                    className="mt-3 px-3 py-1 text-sm rounded text-white flex items-center gap-1"
                                    style={{ backgroundColor: '#b30000' }}
                                    onClick={() => handleBan(user.id)}
                                >
                                    <FaBan /> Ban User
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">No reported users found or all reports have been handled.</p>
            )}

            <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
        </div>
    );
}
