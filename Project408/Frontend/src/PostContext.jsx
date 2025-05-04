import { createContext, useContext, useState } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Jane Doe',
      title: 'Navigating Job Interviews in 2025',
      content: 'In this post, I share some of the most useful strategies...',
      timestamp: 'May 3, 2025',
      likes: 0,
      comments: [
        {
          id: 101,
          author: 'Jane Doe',
          avatar: 'https://i.pravatar.cc/150?u=john',
          content: 'Wonderful!',
        },
      ],
    },
    {
      id: 2,
      author: 'Jane Doe',
      title: 'Navigating Job Interviews in 2025',
      content: 'In this post, I share some of the most useful strategies for standing out during job interviews in today’s competitive tech market...',
      timestamp: 'May 3, 2025',
      likes: 0,
      comments: [
        {
          id: 1,
          author: 'John Doe',
          avatar: 'https://i.pravatar.cc/150?u=a', // örnek
          content: 'Wonderful!',
        },
        {
            id: 2,
            author: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?u=b', // örnek
            content: 'Wonderful!',
          },
          {
            id: 3,
            author: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?u=c', // örnek
            content: 'Wonderful!',
          },
          {
            id: 4,
            author: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?u=d', // örnek
            content: 'Wonderful!',
          },
      ],
    },
    {
      id: 3,
      author: 'John Doe',
      title: 'Mastering the Technical CV',
      content: 'A technical CV needs to highlight not just your experience, but your impact. Here’s how you can tailor your CV for roles in data science and software engineering...',
      timestamp: 'May 1, 2025',
      likes: 0,
      comments: [
        {
          id: 1,
          author: 'Jane Doe',
          avatar: 'https://i.pravatar.cc/150?u=e', // örnek
          content: 'Congrats!',
        },
      ],
    },
  ]);

  

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
}
