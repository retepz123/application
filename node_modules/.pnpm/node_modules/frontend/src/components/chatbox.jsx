import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../lib/chatStore';
import { useAuthStore } from '../lib/authStore';
import { socket } from '../lib/socket';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function ChatBox() {
  const [allMessages, setAllMessages] = useState({});
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  const senderId = authUser?.user?._id;
  const receiverId = selectedUser?._id;

  // Join your room on mount
  useEffect(() => {
    if (!senderId) return;
    socket.emit('join_room', senderId);
  }, [senderId]);

  // Listen for incoming messages
  useEffect(() => {
    const handleReceive = (data) => {
      setAllMessages(prev => ({
        ...prev,
        [data.senderId]: [...(prev[data.senderId] || []), data],
      }));
    };

    socket.on('receive_message', handleReceive);
    return () => {
      socket.off('receive_message', handleReceive);
    };
  }, []);

  // Fetch messages on selected user change
  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/api/messages/${senderId}/${receiverId}`,
          { withCredentials: true }
        );
        setAllMessages(prev => ({
          ...prev,
          [receiverId]: res.data,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [senderId, receiverId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedUser]);

  // Send message
  const sendMessage = async () => {
    if (!context.trim() || !senderId || !receiverId) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/messages/send`,
        { senderId, receiverId, context },
        { withCredentials: true }
      );
      const newMsg = res.data;

      setAllMessages(prev => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newMsg],
      }));

      // Emit via socket
      socket.emit('send_message', newMsg);

      setContext('');
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedUser) return <div>Select a user to start chatting 💬</div>;

  const messages = allMessages[selectedUser._id] || [];


  return (

   <div className='chatbox-container'>
  <div className='chatbox-header'>{selectedUser.username}</div>

  <div className='chatbox-messages'>
    {loading ? (
      <p>Loading messages...</p>
    ) : messages.length === 0 ? (
      <p>No messages yet</p>
    ) : (
      messages.map((msg) => (
        <div
          key={msg._id}
          className={`chat-message ${
            msg.senderId === senderId ? 'chat-sender' : 'chat-receiver'
          }`}
        >
          {msg.context}
        </div>
      ))
    )}
    <div ref={messagesEndRef}></div>
  </div>

  <div className="chatbox-input">
    <input
      type="text"
      value={context}
      onChange={(e) => setContext(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder="Type a message..."
    />
    <button onClick={sendMessage}>Send</button>
  </div>
</div>

  )
}

export default ChatBox;
