'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => { setUser(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [setUser, setLoading]);

  return <>{children}</>;
}
