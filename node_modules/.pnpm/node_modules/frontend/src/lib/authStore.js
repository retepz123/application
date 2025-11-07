import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { axiosInstance } from './axios';

axios.defaults.withCredentials = true;

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isLoading: false,
      error: null,

      checkAuth: async () => {
        
        try {
          const res = await axiosInstance.get('/check');
          set({ authUser: res.data});


        } catch (err) {
           console.log("Error in checkAuth:", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
        
      

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            username,
            password,
          });
          set({ authUser: res.data.user, isLoading: false });
          return res.data;
        } catch (err) {
          console.error('Error in login:', err);
          set({
            error: err.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage', //  key in localStorage
      partialize: (state) => ({ authUser: state.authUser }), // only save user
    }
  )
);
