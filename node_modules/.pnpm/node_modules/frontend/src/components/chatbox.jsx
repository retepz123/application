import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../lib/chatStore';
import { useAuthStore } from '../lib/authStore';

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

  // Fetch messages whenever selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!senderId || !receiverId) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_URL}/api/messages/${senderId}/${receiverId}`,
          { withCredentials: true }
        );

        setAllMessages((prev) => ({
          ...prev,
          [receiverId]: res.data,
        }));
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [senderId, receiverId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages, selectedUser]);

  // Send a message
  const sendMessage = async () => {
    if (!context.trim()) return;
    if (!senderId || !receiverId) {
      console.warn('Missing sender or receiver ID');
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/messages/send`,
        { senderId, receiverId, context },
        { withCredentials: true }
      );

      // Update the current conversation
      setAllMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), res.data],
      }));

      setContext('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chatting 💬
      </div>
    );
  }

  const messages = allMessages[selectedUser._id] || [];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-semibold bg-gray-50">
        Chat with {selectedUser.username}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId === senderId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-3 py-2 rounded-lg max-w-xs ${
                  msg.senderId === senderId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {msg.context}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
