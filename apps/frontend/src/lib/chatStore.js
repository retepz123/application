import { create } from 'zustand';

export const useChatStore = create((set) => ({
  authUser: null,
  selectedUser: null,

  setAuthUser: (user) => set({ authUser: user }),
  setSelectedUser: (user) => set({ selectedUser: user }),
}));