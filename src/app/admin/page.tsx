'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Lock, Package, Trash2, RefreshCw, Plus, BarChart2,
  ShoppingBag, DollarSign, Loader2, LogOut, Eye, EyeOff,
  Users, ClipboardList, ChevronDown,
} from 'lucide-react';
import type { Product } from '@/types/product';
import type { Order } from '@/types/user';

// ─── Types ────────────────────────────────────────────────────
interface AdminUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  phone?: string;
}

const ORDER_STATUSES = [
  { value: 'pending',    label: 'Oczekuje' },
  { value: 'paid',       label: 'Opłacone' },
  { value: 'processing', label: 'W realizacji' },
  { value: 'shipped',    label: 'Wysłane' },
  { value: 'delivered',  label: 'Dostarczone' },
  { value: 'cancelled',  label: 'Anulowane' },
];

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  paid:       'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
};

type Tab = 'dashboard' | 'produkty' | 'uzytkownicy' | 'zamowienia';

// ─── Main component ───────────────────────────────────────────
export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [productId, setProductId] = useState('');
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const [importError, setImportError] = useState('');

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }), [password]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, uRes, oRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/users', { headers: headers() }),
        fetch('/api/admin/orders', { headers: headers() }),
      ]);
      const [p, u, o] = await Promise.all([pRes.json(), uRes.json(), oRes.json()]);
      setProducts(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [headers]);

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
      if (res.ok) { setAuthed(true); }
      else { const d = await res.json(); setAuthError(d.error ?? 'Nieprawidłowe hasło'); }
    } catch { setAuthError('Błąd połączenia'); }
    finally { setAuthLoading(false); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/verify', { method: 'DELETE' });
    setAuthed(false); setPassword('');
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId.trim()) return;
    setImporting(true); setImportMsg(''); setImportError('');
    try {
      const res = await fetch('/api/import-product', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ productId: productId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setImportError(data.error ?? 'Import nie powiódł się'); }
      else { setImportMsg(`✓ Zaimportowano: ${data.title}`); setProductId(''); loadAll(); }
    } catch (err) { setImportError(String(err)); }
    finally { setImporting(false); }
  };

  const deleteProduct = async (slug: string, title: string) => {
    if (!confirm(`Usunąć produkt "${title}"?`)) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE', headers: headers() });
    setProducts((p) => p.filter((x) => x.slug !== slug));
  };

  const deleteUser = async (uid: string, email: string) => {
    if (!confirm(`Usunąć użytkownika "${email}"?`)) return;
    await fetch('/api/admin/users', { method: 'DELETE', headers: headers(), body: JSON.stringify({ uid }) });
    setUsers((u) => u.filter((x) => x.uid !== uid));
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ orderId, status }),
    });
    setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status: status as Order['status'] } : x));
  };

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  // ── Login ──────────────────────────────────────────────────
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
              <label className="block text-sm font-medium text-text-main mb-1.5">Hasło</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border rounded-btn px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-primary"
                  placeholder="Hasło administratora" autoFocus
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && <p className="text-red-500 text-xs mt-1">⚠ {authError}</p>}
            </div>
            <button type="submit" disabled={authLoading || !password}
              className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {authLoading ? 'Logowanie…' : 'Zaloguj się'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard',    label: 'Dashboard',    icon: BarChart2 },
    { id: 'produkty',     label: 'Produkty',     icon: Package },
    { id: 'uzytkownicy',  label: 'Użytkownicy',  icon: Users },
    { id: 'zamowienia',   label: 'Zamówienia',   icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar */}
      <div className="bg-white border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-text-main text-sm">TechLaden Admin</span>
            <nav className="hidden sm:flex items-center gap-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-sm font-medium transition-colors ${
                    tab === id ? 'bg-red-50 text-primary' : 'text-text-secondary hover:text-text-main hover:bg-surface'
                  }`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={loadAll} className="p-2 rounded-btn hover:bg-surface text-text-secondary transition-colors" title="Odśwież">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn text-sm text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" /> Wyloguj
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-text-main">Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Package,      label: 'Produkty',    value: products.length,                          color: 'text-blue-600 bg-blue-50' },
                { icon: Users,        label: 'Użytkownicy', value: users.length,                             color: 'text-purple-600 bg-purple-50' },
                { icon: ShoppingBag,  label: 'Zamówienia',  value: orders.length,                            color: 'text-green-600 bg-green-50' },
                { icon: DollarSign,   label: 'Przychód',    value: `${totalRevenue.toFixed(2).replace('.', ',')} €`, color: 'text-primary bg-red-50' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white rounded-card border border-border p-5 shadow-card flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-btn flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text-main">{value}</p>
                    <p className="text-sm text-text-secondary">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-text-main">Ostatnie zamówienia</h3>
              </div>
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-surface transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-main">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-text-secondary">{order.shippingAddress?.email} · {new Date(order.createdAt).toLocaleDateString('pl-PL')}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                    {ORDER_STATUSES.find(s => s.value === order.status)?.label ?? order.status}
                  </span>
                  <p className="text-sm font-bold text-primary flex-shrink-0">{order.total?.toFixed(2).replace('.', ',')} €</p>
                </div>
              ))}
              {orders.length === 0 && <p className="px-5 py-8 text-center text-text-secondary text-sm">Brak zamówień</p>}
            </div>
          </div>
        )}

        {/* ── PRODUKTY ── */}
        {tab === 'produkty' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text-main">Produkty</h2>

            {/* Import */}
            <div className="bg-white rounded-card border border-border p-5 shadow-card">
              <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Importuj z AliExpress
              </h3>
              <form onSubmit={handleImport} className="flex gap-3">
                <input type="text" value={productId} onChange={(e) => setProductId(e.target.value)}
                  placeholder="ID produktu AliExpress (np. 1005001699302548)"
                  className="flex-1 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <button type="submit" disabled={importing || !productId.trim()}
                  className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                  {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Importuję…</> : <><Plus className="w-4 h-4" /> Importuj</>}
                </button>
              </form>
              {importMsg && <p className="text-green-600 text-sm mt-2 font-medium">{importMsg}</p>}
              {importError && <p className="text-red-500 text-sm mt-2">{importError}</p>}
            </div>

            {/* List */}
            <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-text-main">Lista produktów ({products.length})</h3>
              </div>
              {loading ? (
                <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
                </div>
              ) : products.length === 0 ? (
                <p className="p-10 text-center text-text-secondary">Brak produktów.</p>
              ) : (
                <div className="divide-y divide-border">
                  {products.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                        {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1" sizes="48px" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-main line-clamp-1">{p.title}</p>
                        <p className="text-xs text-text-secondary">{p.category} · <span className="text-primary font-medium">{p.price.eur.toFixed(2).replace('.', ',')} €</span></p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-btn border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors">
                          Podgląd
                        </a>
                        <button onClick={() => deleteProduct(p.slug, p.title)}
                          className="p-1.5 rounded-btn text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── UŻYTKOWNICY ── */}
        {tab === 'uzytkownicy' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text-main">Użytkownicy ({users.length})</h2>
            <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
              {loading ? (
                <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
                </div>
              ) : users.length === 0 ? (
                <p className="p-10 text-center text-text-secondary">Brak zarejestrowanych użytkowników.</p>
              ) : (
                <>
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-2.5 bg-surface border-b border-border text-xs font-semibold text-text-secondary uppercase tracking-wide">
                    <div className="col-span-4">Imię i nazwisko</div>
                    <div className="col-span-4">E-mail</div>
                    <div className="col-span-3">Data rejestracji</div>
                    <div className="col-span-1"></div>
                  </div>
                  <div className="divide-y divide-border">
                    {users.map((u) => (
                      <div key={u.uid} className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-surface transition-colors">
                        <div className="col-span-4">
                          <p className="text-sm font-medium text-text-main">{u.firstName} {u.lastName}</p>
                          {u.phone && <p className="text-xs text-text-secondary">{u.phone}</p>}
                        </div>
                        <div className="col-span-4">
                          <p className="text-sm text-text-secondary truncate">{u.email}</p>
                        </div>
                        <div className="col-span-3">
                          <p className="text-xs text-text-secondary">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pl-PL') : '—'}
                          </p>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <button onClick={() => deleteUser(u.uid, u.email)}
                            className="p-1.5 rounded-btn text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Usuń użytkownika">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── ZAMÓWIENIA ── */}
        {tab === 'zamowienia' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text-main">Zamówienia ({orders.length})</h2>
            <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
              {loading ? (
                <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
                </div>
              ) : orders.length === 0 ? (
                <p className="p-10 text-center text-text-secondary">Brak zamówień.</p>
              ) : (
                <div className="divide-y divide-border">
                  {orders.map((order) => (
                    <div key={order.id} className="px-5 py-4 hover:bg-surface transition-colors">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-sm font-bold text-text-main">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName} · {order.shippingAddress?.email}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {order.shippingAddress?.street}, {order.shippingAddress?.zip} {order.shippingAddress?.city}
                          </p>
                          <p className="text-xs text-text-secondary mt-1">
                            {new Date(order.createdAt).toLocaleString('pl-PL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Status dropdown */}
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer appearance-none pr-6 ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-800'}`}
                            >
                              {ORDER_STATUSES.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                          </div>
                          <p className="text-sm font-bold text-primary">{order.total?.toFixed(2).replace('.', ',')} €</p>
                        </div>
                      </div>
                      {/* Items */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {order.items?.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 bg-surface rounded-btn px-2 py-1">
                            {item.image && (
                              <div className="relative w-6 h-6 flex-shrink-0">
                                <Image src={item.image} alt={item.title} fill className="object-contain" sizes="24px" />
                              </div>
                            )}
                            <span className="text-xs text-text-secondary line-clamp-1 max-w-[150px]">{item.title}</span>
                            <span className="text-xs font-medium text-text-main">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
