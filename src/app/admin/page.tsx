'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Lock, Package, Trash2, RefreshCw, Plus, BarChart2, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';
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

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Bitte Passwort eingeben');
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
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
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
      await fetch(`/api/products/${slug}`, { method: 'DELETE', headers: { 'x-admin-password': password } });
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch { /* ignore */ }
  };

  useEffect(() => { if (authed) loadProducts(); }, [authed, loadProducts]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-card border border-border p-8 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-btn flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-text-main">Admin-Bereich</h1>
              <p className="text-xs text-text-secondary">TechLaden.de</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1.5">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="Admin-Passwort"
                autoFocus
              />
              {authError && <p className="text-red-500 text-xs mt-1">{authError}</p>}
            </div>
            <button type="submit" className="btn-primary w-full py-2.5 text-sm">
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = products.reduce((s, p) => s + p.price.eur, 0);

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-main">Admin-Panel</h1>
            <p className="text-sm text-text-secondary mt-0.5">TechLaden.de Dashboard</p>
          </div>
          <button
            onClick={loadProducts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-btn text-sm text-text-secondary hover:text-text-main hover:border-gray-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Aktualisieren
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, label: 'Produkte', value: products.length, color: 'text-blue-600 bg-blue-50' },
            { icon: ShoppingBag, label: 'Bestellungen', value: 0, color: 'text-green-600 bg-green-50' },
            { icon: DollarSign, label: 'Katalogwert', value: `${totalRevenue.toFixed(2).replace('.', ',')} €`, color: 'text-primary bg-red-50' },
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

        {/* Import */}
        <div className="bg-white rounded-card border border-border p-6 shadow-card mb-6">
          <h2 className="font-semibold text-text-main mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Produkt importieren
          </h2>
          <form onSubmit={handleImport} className="flex gap-3">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="AliExpress Produkt-ID (z.B. 1005001699302548)"
              className="flex-1 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={importing || !productId.trim()}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importiere…</> : 'Importieren'}
            </button>
          </form>
          {importMsg && <p className="text-green-600 text-sm mt-2 font-medium">{importMsg}</p>}
          {importError && <p className="text-red-500 text-sm mt-2">{importError}</p>}
        </div>

        {/* Products table */}
        <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-text-main flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-primary" />
              Produkte ({products.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade…
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-text-secondary">
              Noch keine Produkte. Importiere dein erstes Produkt oben.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors">
                  <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                    {product.images[0] && (
                      <Image src={product.images[0]} alt={product.title} fill className="object-contain p-1" sizes="48px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main line-clamp-1">{product.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {product.category} · {product.price.eur.toFixed(2).replace('.', ',')} € · {product.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={`/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-btn border border-border hover:border-primary bg-white"
                    >
                      Ansehen
                    </a>
                    <button
                      onClick={() => handleDelete(product.slug)}
                      className="p-1.5 rounded-btn text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
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
    </div>
  );
}
