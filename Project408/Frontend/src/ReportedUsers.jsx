import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedUsers() {
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const mockUsers = [
                {
                    id: 1,
                    name: "Alice Johnson",
                    email: "alice@example.com",
                    reportReason: "Inappropriate messages to employers",
                    status: "ACTIVE"
                },
                {
                    id: 2,
                    name: "Bob Smith",
                    email: "bob@example.com",
                    reportReason: "Spamming job applications with fake profiles",
                    status: "UNDER REVIEW"
                }
            ];
            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, []);

    const handleBan = (userId) => {
        setMessage(`User #${userId} has been banned.`);
        setShowToast(true);
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
