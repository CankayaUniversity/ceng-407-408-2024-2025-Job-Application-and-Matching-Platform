import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { Textarea } from './components/ui/TextArea';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { usePostContext } from './PostContext.jsx';
import { avatarStyle, buttonStyle } from './styles/inlineStyles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { useUser } from './UserContext';
import { FaHeart, FaRegHeart, FaComment, FaClock } from 'react-icons/fa';
import Toast from './components/Toast';

export default function BlogPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9090/api/blogs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(response.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
      showToast('Failed to load blogs', 'error');
    }
  };

  const handlePublish = async () => {
    if (!title || !content) {
      showToast('Title and content are required', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:9090/api/blogs',
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTitle('');
      setContent('');
      showToast('Blog post published successfully!', 'success');
      fetchBlogs();
    } catch (error) {
      console.error('Error publishing blog:', error);
      showToast('Failed to publish blog post', 'error');
    }
  };

  const handleAddComment = async (blogId) => {
    const commentText = commentInputs[blogId];
    if (!commentText) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:9090/api/blogs/${blogId}/comments`,
        { content: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCommentInputs({ ...commentInputs, [blogId]: '' });
      showToast('Comment added successfully!', 'success');
      fetchBlogs();
    } catch (error) {
      console.error('Error adding comment:', error);
      showToast('Failed to add comment', 'error');
    }
  };

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:9090/api/blogs/${blogId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBlogs();
    } catch (error) {
      console.error('Error liking blog:', error);
      showToast('Failed to like blog', 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'linear' }}
    >
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-indigo-800">Community Blog</h1>
        <p className="text-gray-600 mt-2">Share knowledge, ask questions, and connect with others in the industry</p>
      </div>
  
      <Card className="mb-8 border-0 shadow-lg rounded-xl overflow-hidden bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Share Your Thoughts</h2>
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Textarea
            placeholder="What's on your mind? Share your knowledge, ask questions, or start a discussion..."
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mb-4 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Button
            style={buttonStyle}
            className="w-full py-3 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
            onClick={handlePublish}
          >
            Publish Post
          </Button>
        </CardContent>
      </Card>
  
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading blog posts...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">No blog posts yet. Be the first to share!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <Card
                key={blog.id}
                className="shadow-md hover:shadow-xl transition-shadow duration-300 border-0 rounded-xl overflow-hidden bg-white"
              >
                <CardContent className="p-6">
                  <h3
                    className="text-2xl font-bold mb-2 cursor-pointer hover:text-indigo-700 transition-colors duration-200"
                    onClick={() => navigate(`/post/${blog.id}`)}
                  >
                    {blog.title}
                  </h3>
  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      {blog.author.profilePicture ? (
                        <img
                          src={blog.author.profilePicture}
                          alt={`${blog.author.firstName} ${blog.author.lastName}`}
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                          <span className="text-indigo-800 font-semibold">
                            {blog.author.firstName?.charAt(0)}
                            {blog.author.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-gray-700">
                        {blog.author.firstName} {blog.author.lastName}
                      </span>
                    </div>
                    <span className="mx-2">•</span>
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-gray-400" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm sm:prose max-w-none text-gray-800 line-clamp-3 mb-4">
                    <ReactMarkdown
                      children={blog.content}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                    />
                  </div>
  
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(blog.id)}
                      className="flex items-center gap-1 text-sm font-medium hover:text-indigo-700 transition-colors duration-200"
                    >
                      {blog.userLiked ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span>{blog.likesCount || 0}</span>
                    </button>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <FaComment />
                      <span>{blog.commentsCount || 0} comments</span>
                    </span>
                    <button
                      onClick={() => navigate(`/post/${blog.id}`)}
                      className="ml-auto text-sm text-indigo-700 hover:text-indigo-900 font-medium hover:underline"
                    >
                      Read more
                    </button>
                  </div>
  
                  {blog.comments && blog.comments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Recent Comments</h4>
                      {(expandedComments[blog.id]
                        ? blog.comments
                        : blog.comments.slice(0, 2)
                      ).map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          {comment.author.profilePicture ? (
                            <img
                              src={comment.author.profilePicture}
                              alt={`${comment.author.firstName} ${comment.author.lastName}`}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-800 font-semibold text-xs">
                                {comment.author.firstName?.charAt(0)}
                                {comment.author.lastName?.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold">
                              {comment.author.firstName} {comment.author.lastName}
                            </span>
                            <span className="text-xs text-gray-700">{comment.content}</span>
                            <span className="text-[10px] text-gray-500 mt-1">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      ))}
  
                      {blog.comments.length > 2 && (
                        <button
                          className="text-xs text-indigo-600 hover:underline"
                          onClick={() =>
                            setExpandedComments((prev) => ({
                              ...prev,
                              [blog.id]: !prev[blog.id],
                            }))
                          }
                        >
                          {expandedComments[blog.id]
                            ? "Show less"
                            : `Show ${blog.comments.length - 2} more comments`}
                        </button>
                      )}
                    </div>
                  )}
  
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={commentInputs[blog.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [blog.id]: e.target.value,
                        })
                      }
                      placeholder="Write a comment..."
                      className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(blog.id);
                        }
                      }}
                    />
                    <Button
                      style={buttonStyle}
                      className="px-3 py-2 text-sm"
                      onClick={() => handleAddComment(blog.id)}
                    >
                      Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
} 