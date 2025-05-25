import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Button } from './components/ui/Button';
import { avatarStyle, buttonStyle } from './styles/inlineStyles';
import { Textarea } from './components/ui/TextArea';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useNavigate } from 'react-router-dom';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [reportingPostId, setReportingPostId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [reportStatusMsg, setReportStatusMsg] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:9090/blog/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => setPosts(res.data))
    .catch((err) => console.error('Failed to fetch posts:', err));
  }, []);

  const handlePublish = () => {
    if (!title || !content) return;

    axios.post('http://localhost:9090/blog/saveBlog', { title, content }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => axios.get('http://localhost:9090/blog/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    }))
    .then((res) => {
      setPosts(res.data);
      setTitle('');
      setContent('');
    });
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (!commentText) return;

    const newComment = {
      id: Date.now(),
      author: 'You',
      avatar: 'https://i.pravatar.cc/150?u=you',
      content: commentText,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });
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

    axios.post(`http://localhost:9090/blog/report/${reportingPostId}`, { reason: reportReason }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      setReportStatusMsg('Report submitted successfully.');
      setTimeout(() => cancelReport(), 2000);
    })
    .catch(err => {
      setReportStatusMsg('Failed to submit report.');
      console.error(err);
    });
  };

  // const buttonStyle = {
  //   backgroundColor: '#000842',
  //   color: '#fff',
  //   padding: '8px 16px',
  //   borderRadius: '8px',
  // };

  // const avatarStyle = {
  //   width: '28px',
  //   height: '28px',
  //   borderRadius: '50%',
  // };

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'linear' }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Community Blog</h1>

      <Card className="mb-8">
        <CardContent className="p-4 space-y-3">
          <h2 className="text-xl font-semibold">Write a New Post</h2>
          <Input placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="What's on your mind?" rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
          <Button style={buttonStyle} className="w-full" onClick={handlePublish}>Publish</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md border border-gray-300 rounded-2xl">
            <CardContent className="p-4">
              <h3 className="text-2xl font-bold mb-2 cursor-pointer hover:underline" onClick={() => navigate(`/post/${post.id}`)}>
                {post.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                By {post.author} • {new Date(post.timestamp).toLocaleString()}
              </p>

              <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 line-clamp-6">
                <ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} />
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Button
                  style={buttonStyle}
                  onClick={() =>
                    setPosts((prevPosts) =>
                      prevPosts.map((p) =>
                        p.id === post.id ? { ...p, likes: (p.likes || 0) + 1 } : p
                      )
                    )
                  }
                >
                  👍 {post.likes || 0}
                </Button>
                <span className="text-sm text-gray-600">
                  💬 {post.comments?.length || 0} comments
                </span>
                <Button style={buttonStyle} onClick={() => openReportForm(post.id)}>
                  Report
                </Button>
              </div>

              {reportingPostId === post.id && (
                <div className="mt-4 border p-4 rounded bg-red-50">
                  <Textarea
                    placeholder="Reason for reporting this blog..."
                    rows={3}
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button style={buttonStyle} onClick={submitReport}>Submit Report</Button>
                    <Button style={buttonStyle} onClick={cancelReport}>Cancel</Button>
                  </div>
                  {reportStatusMsg && (
                    <p className="mt-2 text-sm text-red-700">{reportStatusMsg}</p>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-2">
                {(expandedComments[post.id]
                  ? post.comments || []
                  : (post.comments || []).slice(0, 3)
                ).map((cmt) => (
                  <div key={cmt.id} className="flex items-start gap-2 p-1.5 border border-gray-200 rounded-md">
                    <img src={cmt.avatar} alt={cmt.author} style={avatarStyle} />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">{cmt.author}</span>
                      <span className="text-[11px]">{cmt.content}</span>
                    </div>
                  </div>
                ))}
                {post.comments?.length > 3 && (
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                  >
                    {expandedComments[post.id] ? 'Yorumları gizle' : 'Daha fazla göster'}
                  </button>
                )}
              </div>

              <div className="mt-4">
                <Input
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ''}
                  onChange={(e) =>
                    setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                  }
                />
                <Button style={buttonStyle} className="mt-2" onClick={() => handleAddComment(post.id)}>Comment</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}





// import React, { useState } from 'react';
// import { Card, CardContent } from './components/ui/Card';
// import { Input } from './components/ui/Input';
// import { Button } from './components/ui/Button';
// import { Textarea } from './components/ui/TextArea';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { PostProvider, usePostContext } from './PostContext.jsx';
// import { avatarStyle, buttonStyle } from './styles/inlineStyles';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';


// export default function BlogPage() {

//   const navigate = useNavigate();
  
//   const { posts, setPosts } = usePostContext(); // PostContext'ten posts ve setPosts'i alıyoruz

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');

//   const handlePublish = () => {
//     if (!title || !content) return;

//     const newPost = {
//       id: posts.length + 1,
//       author: 'You',
//       title,
//       content,
//       timestamp: new Date().toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       }),
//       likes: 0,
//       comments: [],
//     };

//     setPosts([newPost, ...posts]);
//     setTitle('');
//     setContent('');
//   };

//   const [commentInputs, setCommentInputs] = useState({});
//   const [expandedComments, setExpandedComments] = useState({});


//   const handleAddComment = (postId) => {
//     const commentText = commentInputs[postId];
//     if (!commentText) return;
  
//     const newComment = {
//       id: Date.now(),
//       author: 'You',
//       avatar: 'https://i.pravatar.cc/150?u=you',
//       content: commentText,
//     };
  
//     setPosts((prevPosts) =>
//       prevPosts.map((post) =>
//         post.id === postId
//           ? { ...post, comments: [...post.comments, newComment] }
//           : post
//       )
//     );
  
//     setCommentInputs({ ...commentInputs, [postId]: '' });
//   };
  


//   return (
//     <motion.div
//       className="p-6 max-w-4xl mx-auto"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: 'linear' }}
//     >
//       <h1 className="text-3xl font-bold mb-6 text-center">Community Blog</h1>
  
//       <Card className="mb-8">
//         <CardContent className="p-4 space-y-3">
//           <h2 className="text-xl font-semibold">Write a New Post</h2>
//           <Input
//             placeholder="Post Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//           <Textarea
//             placeholder="What's on your mind?"
//             rows={6}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//           />
//           <Button
//             style={buttonStyle}
//             className="w-full"
//             onClick={handlePublish}
//           >
//             Publish
//           </Button>
//         </CardContent>
//       </Card>
  
//       <div className="space-y-6">
//         {posts.map((post) => (
//           <Card
//             key={post.id}
//             className="shadow-md border border-gray-300 rounded-2xl"
//           >
//             <CardContent className="p-4">
//             <h3
//                 className="text-2xl font-bold mb-2 cursor-pointer hover:underline"
//                 onClick={() => navigate(`/post/${post.id}`)}
//                 >
//                 {post.title}
//             </h3>

//               <p className="text-sm text-gray-500 mb-2">
//                 By {post.author} • {post.timestamp}
//               </p>
              
//               <div className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 line-clamp-6">
//                   <ReactMarkdown
//                       children={post.content}
//                       remarkPlugins={[remarkGfm]}
//                       rehypePlugins={[rehypeRaw]}
//                   />
//               </div>
  
//               <div className="flex items-center gap-4 mt-4">
//                 <Button
//                   style={buttonStyle}
//                   onClick={() =>
//                     setPosts((prevPosts) =>
//                       prevPosts.map((p) =>
//                         p.id === post.id ? { ...p, likes: p.likes + 1 } : p
//                       )
//                     )
//                   }
//                 >
//                   👍 {post.likes}
//                 </Button>
//                 <span className="text-sm text-gray-600">
//                   💬 {post.comments.length} comments
//                 </span>
//               </div>
  
//               <div className="mt-4 space-y-2">
//                 {(expandedComments[post.id]
//                     ? post.comments
//                     : post.comments.slice(0, 3)
//                 ).map((cmt) => (
//                     <div
//                     key={cmt.id}
//                     className="flex items-start gap-2 p-1.5 border border-gray-200 rounded-md"
//                     >
//                     <img
//                         src={cmt.avatar}
//                         alt={cmt.author}
//                         style={avatarStyle}
//                     />
//                     <div className="flex flex-col">
//                         <span className="text-xs font-semibold">{cmt.author}</span>
//                         <span className="text-[11px]">{cmt.content}</span>
//                     </div>
//                     </div>
//                 ))}

//                 {post.comments.length > 3 && (
//                     <button
//                     className="text-sm text-blue-600 hover:underline"
//                     onClick={() =>
//                         setExpandedComments((prev) => ({
//                         ...prev,
//                         [post.id]: !prev[post.id],
//                         }))
//                     }
//                     >
//                     {expandedComments[post.id]
//                         ? 'Yorumları gizle'
//                         : 'Daha fazla göster'}
//                     </button>
//                 )}
//                 </div>

//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </motion.div>
//   );
// }  
