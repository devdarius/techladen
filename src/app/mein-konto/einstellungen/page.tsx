'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Key, Bell, ShieldAlert, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';

export default function EinstellungenPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Puste pola jako placeholder – aktualnie użytkownicy nie mają edycji profilu, 
  // ale strona jest gotowa na rozwój
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    newsletter: true,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/anmelden');
    if (user) {
      setFormData({
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        phone: '',
        newsletter: true,
      });
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    // Symulacja zapisu (można podpiąć do Firebase później)
    setTimeout(() => {
      setSaving(false);
      setMessage('Einstellungen erfolgreich gespeichert.');
    }, 800);
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Sind Sie sicher, dass Sie Ihr Konto endgültig löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const res = await fetch('/api/auth/me', { method: 'DELETE' });
      if (res.ok) {
        useAuthStore.getState().setUser(null);
        window.location.href = '/';
      } else {
        alert('Fehler beim Löschen des Kontos.');
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/mein-konto" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Zurück zum Konto
      </Link>
      
      <h1 className="text-2xl font-bold text-text-main mb-6">Kontoeinstellungen</h1>

      <div className="bg-white rounded-card border border-border shadow-card p-6 md:p-8">
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-main mb-2">Kontoinformationen</h2>
          <p className="text-sm text-text-secondary">Aktualisieren Sie Ihre persönlichen Daten und Kontaktinformationen.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-main mb-1">E-Mail-Adresse</label>
              <input 
                type="email" 
                value={user.email} 
                disabled 
                className="w-full border border-border rounded-btn px-4 py-2.5 text-sm bg-surface text-text-secondary cursor-not-allowed" 
              />
              <p className="text-xs text-text-secondary mt-1">Die E-Mail-Adresse kann aus Sicherheitsgründen nicht geändert werden.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Vollständiger Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  placeholder="Max Mustermann"
                  className="w-full border border-border rounded-btn px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-main mb-1">Telefonnummer (optional)</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  placeholder="+49 123 456789"
                  className="w-full border border-border rounded-btn px-4 py-2.5 text-sm focus:border-primary focus:outline-none" 
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-b border-border pb-8">
            <Link href="/passwort-vergessen" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
              <Key className="w-4 h-4" /> Passwort ändern
            </Link>
            
            <div className="flex items-center gap-4">
              {message && <span className="text-sm text-green-600 font-medium">{message}</span>}
              <button 
                type="submit" 
                disabled={saving} 
                className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Speichern...</>
                ) : (
                  <><Save className="w-4 h-4" /> Änderungen speichern</>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Newsletter Section */}
        <div className="py-8 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-main">Newsletter & Angebote</h3>
              <p className="text-sm text-text-secondary mt-1">Erhalten Sie Benachrichtigungen über exklusive Rabatte, Produktneuheiten und Aktionen.</p>
              
              <label className="flex items-center gap-2 mt-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.newsletter}
                  onChange={(e) => setFormData(prev => ({...prev, newsletter: e.target.checked}))}
                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                />
                <span className="text-sm font-medium text-text-main">Ich möchte den Newsletter erhalten</span>
              </label>
            </div>
          </div>
        </div>

        {/* Delete Account Section */}
        <div className="pt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-600">Konto löschen (Gefahrenzone)</h3>
              <p className="text-sm text-text-secondary mt-1">Wenn Sie Ihr Konto löschen, werden alle Ihre persönlichen Daten, Bestellhistorie und gespeicherten Adressen dauerhaft entfernt. Diese Aktion kann nicht rückgängig gemacht werden.</p>
              
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="mt-4 px-4 py-2 border border-red-200 text-red-600 rounded-btn text-sm font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Mein Konto endgültig löschen
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
