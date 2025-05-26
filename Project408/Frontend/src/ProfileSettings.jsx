import React, { useState } from 'react';
import { Button } from './components/ui/Button';
import { avatarStyle, buttonStyle } from './styles/inlineStyles';
import { motion } from 'framer-motion';
import axios from 'axios';
import Toast from "./components/Toast.jsx";

export default function ProfileSettings() {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [message, setMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };
    const [showToast, setShowToast] = useState(false);
    const handleCloseToast = () => {
        setShowToast(false);
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setMessage('New passwords do not match.');
            setShowToast(true);

            return;
        }

        try {
            await axios.post(
                `http://localhost:9090/employer/passwordChange`,
                {
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setMessage('Password updated successfully.');
            setShowToast(true);
        } catch (error) {
            console.error(error);
            setMessage('Failed to update password.');
            setShowToast(true);

        }

    };

    // const handleImageUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;
    //
    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('userId', localStorage.getItem('id'));
    //
    //     try {
    //         const res = await axios.post('http://localhost:9090/candidate/profile-picture', formData, {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`,
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         setMessage('Profile photo uploaded successfully.');
    //     } catch (err) {
    //         console.error("Upload error:", err);
    //         setMessage("Failed to upload profile photo.");
    //     }
    // };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:9090/employer/deleteAccount`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            localStorage.clear();
            alert("Account deleted.");
            window.location.href = "/";
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete account.");
        }
    };

    return (
        <motion.div
            className="p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'linear' }}
        >
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="w-full px-4 py-10">
                    <div className="max-w-[900px] mx-auto bg-gray-100 rounded-xl p-10 space-y-10 shadow-md">
                        <div style={{ backgroundColor: 'red', borderRadius: "15px", padding: "20px", marginTop: '15px' }} className="bg-white shadow rounded-md overflow-hidden">

                            <h2 style={{ marginTop: '10px' }} className="text-2xl font-bold text-gray-800 text-center">Profile Settings</h2>

                            {/* Password Section */}
                            <div style={{ marginTop: '30px'}}>
                                <h3 className="text-lg font-semibold mb-4">🔐 Change Password</h3>
                                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        placeholder="Current Password"
                                        onChange={handlePasswordChange}
                                        className="w-full border p-2 rounded bg-white text-black "
                                    />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="New Password"
                                        onChange={handlePasswordChange}
                                        className="w-full border p-2 rounded bg-white text-black"
                                    />
                                    <input
                                        type="password"
                                        name="confirmNewPassword"
                                        placeholder="New Password Again"
                                        onChange={handlePasswordChange}
                                        className="w-full border p-2 rounded bg-white text-black"
                                    />
                                    <button style={{ ...buttonStyle, marginTop: '10px' }} type="submit" className="bg-blue-700 text-white px-4 py-2 rounded mt-3">
                                        Update Password
                                    </button>
                                </form>
                            </div>

                            {/*/!* Photo Upload Section *!/*/}
                            {/*<div style={{ marginTop: '30px' }}>*/}
                            {/*    <h3 className="text-lg font-semibold mb-2">📸 Upload Profile Photo</h3>*/}
                            {/*    <input*/}
                            {/*        type="file"*/}
                            {/*        accept="image/*"*/}
                            {/*        onChange={handleImageUpload}*/}
                            {/*        className="block w-full p-2 border rounded"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/* Delete Account Section */}
                            <div style={{ marginTop: '30px' }}>
                                <h3 className="text-lg font-semibold text-red-600 mb-2">❌ Delete Account</h3>
                                <button
                                    style={{ ...buttonStyle, marginTop: '5px' }}
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-3 "
                                >
                                    Delete Account
                                </button>
                            </div>

                            <Toast message={message} show={showToast}
                                   onClose={handleCloseToast}/>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
