import React, { useEffect, useState, useCallback } from 'react';
import { FaBook, FaTrash } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReportedBlogs = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
        setMessage("Admin token not found. Please log in.");
        setShowToast(true);
        setLoading(false);
        setBlogs([]);
        return;
    }

    try {
        const response = await fetch('http://localhost:9090/admin/reportedBlogs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch reported blogs: ${errorText || response.status}`);
        }
        const data = await response.json();
        setBlogs(data);
    } catch (error) {
        console.error("Error fetching reported blogs:", error);
        setMessage(error.message || "Could not fetch reported blogs.");
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
        setMessage("Admin token not found. Please log in.");
        setShowToast(true);
        return;
    }
    try {
        const response = await fetch(`http://localhost:9090/admin/removeBlog/${blogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to remove blog: ${errorText || response.status}`);
        }
        setMessage(`Blog #${blogId} has been successfully removed.`);
        setShowToast(true);
        fetchReportedBlogs(); // Refresh the list
    } catch (error) {
        console.error("Error removing blog:", error);
        setMessage(error.message || "Could not remove blog.");
        setShowToast(true);
    }
  };

  return (
    <div style={{ padding: '10px' }} className="p-6 min-h-screen bg-white">
      <h2
        style={{ marginTop: '10px', marginBottom: '25px' }}
        className="text-2xl font-bold mb-6">Reported Blog Posts</h2>

      {loading ? (
        <p className="text-gray-600">Loading reported blogs...</p>
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
                backgroundColor: blog.status === 'REMOVED' ? '#ffebee' : '#fdfdfd'
              }}
            >
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">
                <FaBook className={blog.status === 'REMOVED' ? "text-gray-500" : "text-indigo-600"} />
                {blog.title}
              </h2>
              <p className="text-sm"><strong>Author:</strong> {blog.authorEmail}</p>
              <p className="text-sm"><strong>Reason:</strong> {blog.reportReason}</p>
              <p className="text-sm"><strong>Status:</strong> <span className={`font-medium ${blog.status === 'REMOVED' ? 'text-red-700' : 'text-blue-600'}`}>{blog.status}</span></p>
              {blog.status !== 'REMOVED' && (
                <button
                    className="mt-3 px-3 py-1 text-sm rounded text-white flex items-center gap-1"
                    style={{ backgroundColor: '#b30000' }}
                    onClick={() => handleRemoveBlog(blog.id)}
                >
                    <FaTrash /> Remove Blog
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No reported blogs found or all reports have been handled.</p>
      )}

      <Toast message={message} show={showToast} onClose={() => setShowToast(false)} />
    </div>
  );
}
