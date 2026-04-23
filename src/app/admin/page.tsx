'use client';

import { useState, useEffect } from 'react';
import { Lock, Package, Trash2, RefreshCw, Plus } from 'lucide-react';
import type { Product } from '@/types/product';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  const [productId, setProductId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [importError, setImportError] = useState('');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side check — real auth happens server-side on import
    if (password === 'admin123' || password.length > 0) {
      // We'll verify via the API; for now allow entry and let API reject
      setAuthed(true);
      setAuthError('');
      loadProducts();
    } else {
      setAuthError('Falsches Passwort');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
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
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ productId: productId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error ?? 'Import fehlgeschlagen');
      } else {
        setImportMsg(`✓ Importiert: ${data.title}`);
        setProductId('');
        loadProducts();
      }
    } catch (err) {
      setImportError(String(err));
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Produkt "${slug}" wirklich löschen?`)) return;
    try {
      await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password },
      });
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (authed) loadProducts();
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card rounded-2xl p-8 border border-slate-800">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6" style={{ color: '#00D4FF' }} />
            <h1 className="text-xl font-bold text-white">Admin-Bereich</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">
                Passwort
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
                placeholder="Admin-Passwort"
                autoFocus
              />
              {authError && (
                <p className="text-red-400 text-xs mt-1">{authError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-semibold text-black text-sm"
              style={{ backgroundColor: '#00D4FF' }}
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="w-6 h-6" style={{ color: '#00D4FF' }} />
          Admin-Panel
        </h1>
        <button
          onClick={loadProducts}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Aktualisieren
        </button>
      </div>

      {/* Import form */}
      <div className="bg-card rounded-xl p-6 border border-slate-800 mb-8">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4" style={{ color: '#00D4FF' }} />
          Produkt importieren
        </h2>
        <form onSubmit={handleImport} className="flex gap-3">
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="AliExpress Produkt-ID (z.B. 1005001699302548)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent"
          />
          <button
            type="submit"
            disabled={importing || !productId.trim()}
            className="px-5 py-2 rounded-lg font-semibold text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            style={{ backgroundColor: '#00D4FF' }}
          >
            {importing ? 'Importiere…' : 'Importieren'}
          </button>
        </form>
        {importMsg && (
          <p className="text-green-400 text-sm mt-2">{importMsg}</p>
        )}
        {importError && (
          <p className="text-red-400 text-sm mt-2">{importError}</p>
        )}
      </div>

      {/* Products list */}
      <div className="bg-card rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">
            Produkte ({products.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Lade…</div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Noch keine Produkte importiert.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-4 hover:bg-slate-800/30 transition-colors"
              >
                {product.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1">
                    {product.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {product.category} ·{' '}
                    {product.price.eur.toFixed(2).replace('.', ',')} € ·{' '}
                    {product.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={`/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded bg-slate-800"
                  >
                    Ansehen
                  </a>
                  <button
                    onClick={() => handleDelete(product.slug)}
                    className="p-1.5 rounded text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors"
                    aria-label="Löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
