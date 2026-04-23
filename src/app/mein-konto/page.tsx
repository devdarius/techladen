'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Package, LogOut, ChevronRight, Settings } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function MeinKontoPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuthStore();

  useEffect(() => {
    if (!loading && !user) router.push('/anmelden');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Mein Konto</h1>
          <p className="text-text-secondary text-sm mt-0.5">Willkommen, {user.firstName}!</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-text-secondary hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4" /> Abmelden
        </button>
      </div>

      <div className="bg-white rounded-card border border-border p-5 shadow-card mb-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-text-main">{user.firstName} {user.lastName}</p>
          <p className="text-sm text-text-secondary">{user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
        {[
          { icon: Package, label: 'Meine Bestellungen', sub: 'Bestellhistorie und Status', href: '/mein-konto/bestellungen' },
          { icon: Settings, label: 'Kontoeinstellungen', sub: 'Passwort und persönliche Daten', href: '/mein-konto/einstellungen' },
        ].map(({ icon: Icon, label, sub, href }) => (
          <Link key={href} href={href} className="flex items-center gap-4 px-5 py-4 hover:bg-surface transition-colors border-b border-border last:border-0">
            <div className="w-9 h-9 bg-red-50 rounded-btn flex items-center justify-center flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-main">{label}</p>
              <p className="text-xs text-text-secondary">{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
