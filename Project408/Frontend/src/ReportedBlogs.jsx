import React, { useEffect, useState, useCallback } from 'react';
import { FaBook } from 'react-icons/fa';
import Toast from './components/Toast';
import axios from 'axios';

export default function ReportedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReportedBlogs = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
        setMessage('Authentication token not found. Please log in.');
        setShowToast(true);
        setLoading(false);
        setBlogs([]);
        return;
    }
    try {
        const response = await axios.get('http://localhost:9090/admin/reportedBlogs', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setBlogs(response.data);
        if (response.data.length === 0) {
            setMessage('No reported blogs found.');
            // setShowToast(true); // Optional
        }
    } catch (error) {
        console.error("Failed to fetch reported blogs:", error);
        setMessage(error.response?.data?.message || error.message || 'Failed to fetch reported blogs');
        setShowToast(true);
        setBlogs([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportedBlogs();
  }, [fetchReportedBlogs]);

  const handleRemoveBlog = async (blogId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        setMessage('Authentication token not found. Please log in.');
        setShowToast(true);
        return;
    }
    try {
        await axios.post(`http://localhost:9090/admin/removeBlog/${blogId}`, {}, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setMessage(`Blog #${blogId} has been removed successfully.`);
        setShowToast(true);
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId));
        // Or call fetchReportedBlogs();
    } catch (error) {
        console.error("Failed to remove blog:", error);
        setMessage(error.response?.data?.message || error.message || 'Failed to remove blog');
        setShowToast(true);
    }
  };

  return (
    <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
      <h1
        style={{ marginTop: '10px', marginBottom: '25px' }}
        className="text-2xl font-bold mb-6">Reported Blog Posts</h1>

      {loading ? (
        <p className="text-gray-600">Loading data...</p>
      ) : blogs.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >
          {blogs.map(blog => (
            <div
              key={blog.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '14px 18px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                backgroundColor: '#fdfdfd'
              }}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <FaBook className="text-indigo-600" />
                {blog.title}
              </h2>
              <p className="text-sm"><strong>Author:</strong> {blog.authorEmail}</p>
              <p className="text-sm"><strong>Reason:</strong> {blog.reportReason}</p>
              <p className="text-sm"><strong>Status:</strong> <span className="text-blue-600 font-medium">{blog.status}</span></p>
              <button
                className="mt-3 px-3 py-1 text-sm rounded text-white"
                style={{ backgroundColor: '#b30000' }}
                onClick={() => handleRemoveBlog(blog.id)}
              >
                Remove Blog
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
