import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from './components/ui/Button';
import { buttonStyle } from './styles/inlineStyles';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaClock, FaArrowLeft } from 'react-icons/fa';
import Toast from './components/Toast';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:9090/api/blogs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlog(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching blog:', error);
            setLoading(false);
            showToast('Failed to load blog post', 'error');
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:9090/api/blogs/${id}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setNewComment('');
            showToast('Comment added successfully!', 'success');
            fetchBlog();
        } catch (error) {
            console.error('Error adding comment:', error);
            showToast('Failed to add comment', 'error');
        }
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:9090/api/blogs/${id}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBlog();
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

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-700"></div>
                <p className="ml-3 text-gray-600">Loading blog post...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-xl text-gray-700 mb-4">Blog post not found</p>
                <Button style={buttonStyle} onClick={() => navigate('/blog')}>
                    Back to Blog
                </Button>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-indigo-100 to-white py-10 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'linear' }}
        >
            {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            <div className="max-w-4xl mx-auto">
                <Button 
                    style={buttonStyle} 
                    onClick={() => navigate('/blog')} 
                    className="mb-6 flex items-center gap-2"
                >
                    <FaArrowLeft /> Back to Blog
                </Button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                            <div className="flex items-center">
                                {blog.author.profilePicture ? (
                                    <img
                                        src={blog.author.profilePicture}
                                        alt={`${blog.author.firstName} ${blog.author.lastName}`}
                                        className="w-10 h-10 rounded-full mr-3 object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                        <span className="text-indigo-800 font-semibold">
                                            {blog.author.firstName?.charAt(0)}
                                            {blog.author.lastName?.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-gray-700">
                                        {blog.author.firstName} {blog.author.lastName}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FaClock className="mr-1" />
                                        <span>{formatDate(blog.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="prose prose-lg max-w-none text-gray-800 mb-8">
                            <ReactMarkdown
                                children={blog.content}
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                            />
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={handleLike}
                                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-200"
                                >
                                    {blog.userLiked ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                    <span className="font-medium">{blog.likesCount || 0} likes</span>
                                </button>
                            </div>

                            <h2 className="text-xl font-semibold mb-4">
                                Comments ({blog.comments ? blog.comments.length : 0})
                            </h2>

                            <div className="space-y-6 mb-8">
                                {blog.comments && blog.comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                                    >
                                        {comment.author.profilePicture ? (
                                            <img
                                                src={comment.author.profilePicture}
                                                alt={`${comment.author.firstName} ${comment.author.lastName}`}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-800 font-semibold">
                                                    {comment.author.firstName?.charAt(0)}
                                                    {comment.author.lastName?.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-sm">
                                                    {comment.author.firstName} {comment.author.lastName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {(!blog.comments || blog.comments.length === 0) && (
                                    <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                                )}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-3">Add a Comment</h3>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment..."
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                                <Button 
                                    style={buttonStyle} 
                                    onClick={handleAddComment} 
                                    className="mt-3"
                                >
                                    Post Comment
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
} 