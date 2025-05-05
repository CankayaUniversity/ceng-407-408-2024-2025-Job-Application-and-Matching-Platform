import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './components/ui/Button';
import { usePostContext } from './PostContext';
import { avatarStyle, buttonStyle } from './styles/inlineStyles';
import { useUser } from './UserContext.jsx';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';



export default function PostDetail() {
    const { user } = useUser();
    const { id } = useParams();
    const navigate = useNavigate();
    const { posts, setPosts } = usePostContext();

    const post = posts.find((p) => p.id === parseInt(id));
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (!newComment.trim()) return;

        const updatedPosts = posts.map((p) =>
            p.id === post.id
                ? {
                    ...p,
                    comments: [
                        ...p.comments,
                        {
                            id: Date.now(),
                            author: [user.name, user.surname].filter(Boolean).join(' '),
                            avatar: user.avatar,
                            content: newComment,
                          }                          
                    ],
                }
                : p
        );

        setPosts(updatedPosts);
        setNewComment('');
    };

    if (!post) {
        return <div className="p-6 text-center">Post not found.</div>;
    }

    return (
        <motion.div
        className="p-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'linear' }}
        >
        <div className="min-h-screen bg-blue-500 py-10 px-4 flex justify-center">
        <div
            className="w-full max-w-[1100px] rounded-2xl shadow-lg p-6 md:p-10"
            style={{
                backgroundColor: "#000842", // koyu lacivert
                borderRadius: '20px',
                padding: '5px'
            }}
            >
                <Button style={buttonStyle} onClick={() => navigate('/blog')} className="mb-4">
                    ← Back to Blog
                </Button>

                <div
                    className="rounded-xl shadow-md p-6 space-y-6"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.97)', // yarı saydam beyaz
                        padding: '50px',
                        borderRadius: '20px',
                        margin: '20px'
                    }}
                    >
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                    <p className="text-sm text-gray-500">
                        By {post.author} • {post.timestamp}
                    </p>
                    <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800">
                        <ReactMarkdown
                            children={post.content}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        />
                    </div>




                    <div className="mt-6 border-t pt-4">

                        <Button
                            style={buttonStyle}
                            onClick={() => {
                                const updatedPosts = posts.map((p) =>
                                    p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                                );
                                setPosts(updatedPosts);
                            }}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded"
                        >
                            👍 {post.likes}
                        </Button>

                        <h2 className="text-lg font-semibold mb-2">
                            Comments ({post.comments.length})
                        </h2>

                        {post.comments.map((cmt) => (
                            <div
                                key={cmt.id}
                                className="flex items-start gap-2 mb-3 p-2 border border-gray-200 rounded-lg"
                            >
                                <img
                                    src={cmt.avatar}
                                    alt={cmt.author}
                                    style={avatarStyle}
                                />
                                <div className="text-sm">
                                    <p className="font-semibold text-xs">{cmt.author}</p>
                                    <p className="text-xs">{cmt.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Yorum ekleme alanı */}
                        <div className="mt-4 space-y-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                            />
                            <Button style={buttonStyle} onClick={handleAddComment} className="text-sm">
                                Add Comment
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </motion.div>
    );
}
