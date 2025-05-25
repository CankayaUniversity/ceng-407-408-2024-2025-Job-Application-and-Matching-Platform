import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from './components/ui/Button';
import { usePostContext } from './PostContext';
import { avatarStyle, buttonStyle } from './styles/inlineStyles';
import { useUser } from './UserContext.jsx';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import axios from 'axios';
import PostActions from './PostActions';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { posts, setPosts } = usePostContext();

  const [post, setPost] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/blog/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(res.data);
      } catch (err) {
        console.error('Post alınamadı:', err);
      }
    };
    fetchPost();
  }, [id, token]);

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
            backgroundColor: '#000842',
            borderRadius: '20px',
            padding: '5px',
          }}
        >
          <Button style={buttonStyle} onClick={() => navigate('/blog')} className="mb-4">
            ← Back to Blog
          </Button>

          <div
            className="rounded-xl shadow-md p-6 space-y-6"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              padding: '50px',
              borderRadius: '20px',
              margin: '20px',
            }}
          >
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-sm text-gray-500">
              By {post.author} • {new Date(post.timestamp).toLocaleString()}
            </p>

            <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800">
              <ReactMarkdown
                children={post.content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              />
            </div>

            <h2 className="text-lg font-semibold mb-2 mt-6">
              Comments ({post.comments?.length || 0})
            </h2>

            {(post.comments || []).map((cmt) => (
              <div
                key={cmt.id}
                className="flex items-start gap-2 mb-3 p-2 border border-gray-200 rounded-lg"
              >
                <img src={cmt.avatar} alt={cmt.author} style={avatarStyle} />
                <div className="text-sm">
                  <p className="font-semibold text-xs">{cmt.author}</p>
                  <p className="text-xs">{cmt.content}</p>
                </div>
              </div>
            ))}

            {/* Ekip arkadaşlarının backend bağlantılı yorum / beğeni / rapor bileşeni */}
            <PostActions post={post} user={user} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
