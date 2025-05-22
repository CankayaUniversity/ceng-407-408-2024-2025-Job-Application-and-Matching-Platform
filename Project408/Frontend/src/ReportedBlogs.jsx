import React, { useEffect, useState } from 'react';
import { FaBook } from 'react-icons/fa';
import Toast from './components/Toast';

export default function ReportedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockBlogs = [
        {
          id: 1,
          title: "Why I Quit My Developer Job",
          authorEmail: "writer1@example.com",
          reportReason: "Contains offensive language",
          status: "PENDING"
        },
        {
          id: 2,
          title: "Top 5 Resume Mistakes",
          authorEmail: "careercoach@example.com",
          reportReason: "Plagiarized content from another site",
          status: "REVIEWED"
        }
      ];
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRemove = (id) => {
    setMessage(`Blog #${id} removed.`);
    setShowToast(true);
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
                onClick={() => handleRemove(blog.id)}
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
