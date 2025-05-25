import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentText, setCommentText] = useState('');
  const [reportReason, setReportReason] = useState(''); // rapor sebebi inputu için
  const [reportingPostId, setReportingPostId] = useState(null); // hangi posta rapor yazılıyor
  const [reportStatusMsg, setReportStatusMsg] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:9090/blog/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then((res) => setPosts(res.data))
        .catch((err) => console.error('Failed to fetch posts:', err));
  }, []);

  const handlePublish = () => {
    if (!title || !content) return;

    const newPost = { title, content };
    const token = localStorage.getItem('token');

    axios.post('http://localhost:9090/blog/saveBlog', newPost, {
      headers: { Authorization: `Bearer ${token}` }
    })
        .then(() => axios.get('http://localhost:9090/blog/getAll', {
          headers: { Authorization: `Bearer ${token}` }
        }))
        .then((res) => {
          setPosts(res.data);
          setTitle('');
          setContent('');
        })
        .catch((err) => console.error('Failed to publish post:', err));
  };

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, likes: (post.likes || 0) + 1 };
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleAddComment = (postId) => {
    if (!commentText) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: Date.now(),
          author: 'You',
          avatar: 'https://placehold.co/40x40',
          content: commentText
        };
        return { ...post, comments: [...(post.comments || []), newComment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setCommentText('');
  };

  const openReportForm = (postId) => {
    setReportingPostId(postId);
    setReportReason('');
    setReportStatusMsg('');
  };

  const cancelReport = () => {
    setReportingPostId(null);
    setReportReason('');
    setReportStatusMsg('');
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      setReportStatusMsg('Please enter a reason for reporting.');
      return;
    }

    const token = localStorage.getItem('token');
  console.log(reportReason)
    axios.post(`http://localhost:9090/blog/report/${reportingPostId}`, { reason: reportReason }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

        .then(() => {
          setReportStatusMsg('Report submitted successfully.');
          setTimeout(() => {
            cancelReport();
          }, 2000);
        })
        .catch(err => {
          setReportStatusMsg('Failed to submit report.');
          console.error(err);
        });
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Community Blog</h2>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md mb-6">
          <h4 className="text-2xl font-bold mb-4">Write a New Post</h4>
          <input
              type="text"
              placeholder="Title"
              className="w-full border border-gray-300 p-2 mb-4 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
              placeholder="Content"
              className="w-full border border-gray-300 p-2 mb-4 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
          />
          <button
              onClick={handlePublish}
              className="bg-black text-white px-4 py-2 rounded mb-3"
          >
            Publish
          </button>
        </div>

        <div className="max-w-3xl mx-auto">
          {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-md shadow-md mb-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <p className="text-sm text-gray-500 mb-4">
                  By {post.author} • {new Date(post.timestamp).toLocaleString()}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <button
                      onClick={() => handleLike(post.id)}
                      className="bg-black text-white px-4 py-2 rounded"
                  >
                    Like
                  </button>
                  <span>{post.likes || 0} {post.likes === 1 ? 'like' : 'likes'}</span>

                  <button
                      onClick={() => openReportForm(post.id)}
                      className="bg-black text-white px-4 py-2 rounded"
                  >
                    Report
                  </button>
                </div>

                {/* Report form */}
                {reportingPostId === post.id && (
                    <div className="mt-4 border p-4 rounded bg-red-50">
                <textarea
                    placeholder="Reason for reporting this blog..."
                    className="w-full border border-red-400 p-2 rounded mb-2"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows={3}
                />
                      <div className="flex gap-2">
                        <button
                            onClick={submitReport}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                          Submit Report
                        </button>
                        <button
                            onClick={cancelReport}
                            className="bg-black text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                      {reportStatusMsg && (
                          <p className="mt-2 text-sm text-red-700">{reportStatusMsg}</p>
                      )}
                    </div>
                )}

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Comments:</h4>
                  <ul>
                    {(post.comments || []).map((comment) => (
                        <li key={comment.id} className="mb-2 flex items-start gap-2">
                          <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-semibold">{comment.author}</p>
                            <p>{comment.content}</p>
                          </div>
                        </li>
                    ))}
                  </ul>

                  <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        className="w-full border border-gray-300 p-2 rounded mb-3"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                        onClick={() => handleAddComment(post.id)}
                        className="bg-black text-white px-4 py-2 rounded mb-3"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}

export default BlogPage;
