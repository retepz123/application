import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://backend-chat-w8r7.onrender.com/api/auth',
  withCredentials: true,
});