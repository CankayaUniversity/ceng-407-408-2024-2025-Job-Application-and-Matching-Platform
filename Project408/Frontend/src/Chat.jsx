import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  // Kişi listesi
  const [chatUsers] = useState([
    { id: 1, name: 'Employer' },
    { id: 2, name: 'Candidate' },
  ]);
  const [activeUser, setActiveUser] = useState(chatUsers[0]);

  // Mesajlar (aktif kullanıcıya göre filtrele)
  const [messages, setMessages] = useState([
    { userId: 1, sender: 'Employer', text: 'Hello, how can I help you?' },
    { userId: 1, sender: 'You', text: 'I am interested in the job posting.' },
    { userId: 2, sender: 'Candidate', text: 'Hi, any updates about my application?' },
    { userId: 2, sender: 'You', text: 'We are reviewing your profile.' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      userId: activeUser.id,
      sender: 'You',
      text: newMessage,
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage('');
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeUser]);

  // Aktif kullanıcıya göre mesajları filtrele
  const filteredMessages = messages.filter((msg) => msg.userId === activeUser.id);

  return (
    <div className="flex h-screen">
      {/* Sol - Kişi Listesi */}
      <div className="w-1/3 border-r p-4 space-y-4">
        <h3 className="text-lg font-semibold mb-2">Chats</h3>
        {chatUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setActiveUser(user)}
            className={`p-2 rounded cursor-pointer ${
              activeUser?.id === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Sağ - Mesaj Alanı */}
      <div className="flex-1 flex flex-col p-4">
        {/* Mesajlar */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredMessages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded max-w-[70%] ${
                msg.sender === 'You'
                  ? 'bg-blue-100 self-end'
                  : 'bg-gray-200 self-start'
              }`}
            >
              <p className="text-sm text-gray-600">{msg.sender}</p>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Mesaj Gönderme */}
        <div className="flex mt-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-md p-2"
          />
          <button
            style={{ backgroundColor: '#0C21C1', borderColor: '#0C21C1' }}
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}









// import { useEffect, useState, useRef } from 'react';
// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// export default function ChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const stompClientRef = useRef(null);
//   const messagesEndRef = useRef(null);

//   // WebSocket bağlantısı
//   useEffect(() => {
//     const socket = new SockJS('http://localhost:8080/ws');  // backend endpoint
//     const stompClient = new Client({
//       webSocketFactory: () => socket,
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//     });

//     stompClient.onConnect = () => {
//       console.log('Connected');
//       stompClient.subscribe('/topic/messages', (message) => {
//         const body = JSON.parse(message.body);
//         setMessages((prev) => [...prev, body]);
//       });
//     };

//     stompClient.activate();
//     stompClientRef.current = stompClient;

//     return () => stompClient.deactivate();  // cleanup
//   }, []);

//   const handleSend = () => {
//     if (newMessage.trim() === '' || !stompClientRef.current.connected) return;

//     const chatMessage = {
//       sender: 'You',
//       text: newMessage,
//     };

//     stompClientRef.current.publish({
//       destination: '/app/chat',
//       body: JSON.stringify(chatMessage),
//     });

//     setNewMessage('');
//   };

//   // Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
//       <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-2">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 rounded max-w-[70%] ${
//               msg.sender === 'You'
//                 ? 'bg-blue-100 self-end'
//                 : 'bg-gray-200 self-start'
//             }`}
//           >
//             <p className="text-sm text-gray-600">{msg.sender}</p>
//             <p>{msg.text}</p>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="flex mt-4">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           placeholder="Type your message..."
//           className="flex-1 border border-gray-300 rounded-l-md p-2"
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
