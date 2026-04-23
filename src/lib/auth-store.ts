'use client';

import { create } from 'zustand';
import type { SessionUser } from './auth';

interface AuthStore {
  user: SessionUser | null;
  loading: boolean;
  setUser: (user: SessionUser | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },
}));
