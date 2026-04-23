'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Lock, Package, Trash2, RefreshCw, Plus,
  BarChart2, ShoppingBag, DollarSign, Loader2,
  LogOut, Eye, EyeOff,
} from 'lucide-react';
import type { Product } from '@/types/product';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [productId, setProductId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [importError, setImportError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  // Check if already logged in via cookie
  useEffect(() => {
    fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: '' }) })
      .then(() => {}) .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthed(true);
        loadProducts();
      } else {
        const data = await res.json();
        setAuthError(data.error ?? 'Nieprawidłowe hasło');
      }
    } catch {
      setAuthError('Błąd połączenia z serwerem');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/verify', { method: 'DELETE' });
    setAuthed(false);
    setPassword('');
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim()) return;
    setImporting(true);
    setImportMsg('');
    setImportError('');
    try {
      const res = await fetch('/api/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ productId: productId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error ?? 'Import nie powiódł się');
      } else {
        setImportMsg(`✓ Zaimportowano: ${data.title}`);
        setProductId('');
        loadProducts();
      }
    } catch (err) {
      setImportError(String(err));
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Czy na pewno chcesz usunąć produkt "${title}"?`)) return;
    try {
      await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch { /* ignore */ }
  };

  useEffect(() => { if (authed) loadProducts(); }, [authed, loadProducts]);

  // ── Login screen ──────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-card border border-border p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-btn flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-text-main">Panel administracyjny</h1>
              <p className="text-xs text-text-secondary">TechLaden.de</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">
                Hasło
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                  placeholder="Wprowadź hasło administratora"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠ {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading || !password}
              className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {authLoading ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────
  const totalValue = products.reduce((s, p) => s + p.price.eur, 0);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Panel administracyjny</h1>
            <p className="text-sm text-text-secondary mt-0.5">TechLaden.de — zarządzanie sklepem</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadProducts}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-btn text-sm text-text-secondary hover:text-text-main hover:border-gray-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Odśwież
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-btn text-sm text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Wyloguj
            </button>
          </div>
        </div>

        {/* Statystyki */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: 'Produkty', value: products.length, color: 'text-blue-600 bg-blue-50' },
            { icon: ShoppingBag, label: 'Zamówienia', value: 0, color: 'text-green-600 bg-green-50' },
            { icon: DollarSign, label: 'Wartość katalogu', value: `${totalValue.toFixed(2).replace('.', ',')} €`, color: 'text-primary bg-red-50' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-card border border-border p-5 shadow-card flex items-center gap-4">
              <div className={`w-11 h-11 rounded-btn flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-main">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Import produktu */}
        <div className="bg-white rounded-card border border-border p-6 shadow-card mb-6">
          <h2 className="font-semibold text-text-main mb-1 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Importuj produkt z AliExpress
          </h2>
          <p className="text-xs text-text-secondary mb-4">
            Wklej ID produktu z AliExpress — system automatycznie pobierze dane i doda produkt do sklepu.
          </p>
          <form onSubmit={handleImport} className="flex gap-3">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="ID produktu AliExpress (np. 1005001699302548)"
              className="flex-1 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={importing || !productId.trim()}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Importuję…</>
                : <><Plus className="w-4 h-4" /> Importuj</>
              }
            </button>
          </form>
          {importMsg && <p className="text-green-600 text-sm mt-2 font-medium">{importMsg}</p>}
          {importError && <p className="text-red-500 text-sm mt-2">{importError}</p>}
        </div>

        {/* Lista produktów */}
        <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-text-main flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Lista produktów ({products.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-text-secondary">
              Brak produktów. Zaimportuj pierwszy produkt powyżej.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main line-clamp-1">{product.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {product.category}
                      {' · '}
                      <span className="text-primary font-medium">{product.price.eur.toFixed(2).replace('.', ',')} €</span>
                      {' · '}
                      <span className={product.inStock ? 'text-success' : 'text-red-400'}>
                        {product.inStock ? 'Dostępny' : 'Niedostępny'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-btn border border-border hover:border-primary bg-white"
                    >
                      Podgląd
                    </a>
                    <button
                      onClick={() => handleDelete(product.slug, product.title)}
                      className="p-1.5 rounded-btn text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Usuń produkt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info o haśle */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-card text-xs text-yellow-800">
          <strong>Bezpieczeństwo:</strong> Hasło administratora jest ustawione w zmiennej środowiskowej <code className="bg-yellow-100 px-1 rounded">ADMIN_PASSWORD</code> na Vercelu.
          Aby zmienić hasło, zaktualizuj tę zmienną w panelu Vercel → Settings → Environment Variables.
        </div>
      </div>
    </div>
  );
}
