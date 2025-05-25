import React, { useState } from 'react';
import axios from 'axios';
import { FaFlag } from 'react-icons/fa';

const PostActions = ({ post, user }) => {
    const { posts, setPosts } = usePostContext();
    const [newComment, setNewComment] = useState('');
    const [reportReason, setReportReason] = useState('');
    const [showReport, setShowReport] = useState(false);

    const token = localStorage.getItem('token');

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                'http://localhost:9090/blogs/add-comment',
                {
                    postId: post.id,
                    authorId: user.id,
                    content: newComment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedPost = { ...post, comments: [...post.comments, response.data] };
            const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p));
            setPosts(updatedPosts);
            setNewComment('');
        } catch (error) {
            console.error('Yorum eklenemedi:', error);
        }
    };

    const handleLike = async () => {
        try {
            await axios.post(
                `http://localhost:9090/blogs/${post.id}/like`,
                {
                    userId: user.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedPost = { ...post, likes: post.likes + 1 };
            const updatedPosts = posts.map((p) => (p.id === post.id ? updatedPost : p));
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Beğeni gönderilemedi:', error);
        }
    };

    const handleReportSubmit = async () => {
        if (!reportReason.trim()) return;

        try {
            await axios.post(
                `http://localhost:9090/blogs/${post.id}/report`,
                {
                    blogId: post.id,
                    blogTitle: post.title,
                    authorId: post.authorId,
                    reporterId: user.id,
                    reason: reportReason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReportReason('');
            setShowReport(false);
            alert('Rapor gönderildi.');
        } catch (error) {
            console.error('Rapor gönderilemedi:', error);
        }
    };

    return (
        <div className="p-2 border-t mt-4">
            {/* Yorum alanı */}
            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Yorum yap..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="border p-1 w-full rounded"
                />
                <button onClick={handleAddComment} className="mt-1 bg-blue-500 text-white px-3 py-1 rounded">
                    Ekle
                </button>
            </div>

            {/* Beğeni Butonu */}
            <button onClick={handleLike} className="bg-green-500 text-white px-3 py-1 mr-2 rounded">
                Beğen ({post.likes})
            </button>

            {/* Rapor Butonu */}
            <button
                onClick={() => setShowReport(!showReport)}
                className="bg-red-500 text-white px-3 py-1 rounded inline-flex items-center"
            >
                <FaFlag className="mr-1" />
                Raporla
            </button>

            {/* Rapor formu */}
            {showReport && (
                <div className="mt-2">
          <textarea
              placeholder="Rapor sebebi..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2 border rounded"
          />
                    <button onClick={handleReportSubmit} className="mt-1 bg-red-600 text-white px-3 py-1 rounded">
                        Gönder
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostActions;
