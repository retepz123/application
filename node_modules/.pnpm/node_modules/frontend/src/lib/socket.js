import { io } from 'socket.io-client';

export const socket = io('https://backend-chat-w8r7.onrender.com', {
  withCredentials: true,
});