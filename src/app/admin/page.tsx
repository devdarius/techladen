'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Lock, Package, Trash2, RefreshCw, Plus, BarChart2,
  ShoppingBag, DollarSign, Loader2, LogOut, Eye, EyeOff,
  Users, ClipboardList, ChevronDown, Truck, Search, Link2, Tag, Edit3,
} from 'lucide-react';
import type { Product } from '@/types/product';
import type { Order } from '@/types/user';
import type { Coupon, CouponType } from '@/types/coupon';
import { ProductEditor } from '@/components/admin/ProductEditor';

interface AdminUser {
  uid: string; email: string; firstName: string; lastName: string; createdAt: string; phone?: string;
}

interface SearchResult {
  product_id: number; product_title: string; sale_price: string; main_image: string;
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

type Tab = 'dashboard' | 'produkty' | 'uzytkownicy' | 'zamowienia' | 'aliexpress' | 'kupony';

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

  // AliExpress search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [fulfilling, setFulfilling] = useState<string | null>(null);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponForm, setCouponForm] = useState({
    code: '', type: 'percent' as CouponType, value: 10,
    minOrderValue: 0, maxUses: 0, maxUsesPerUser: 1,
    expiresAt: '', onlyNewCustomers: false, category: '', description: '',
  });
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productStatusFilter, setProductStatusFilter] = useState<'all' | 'active' | 'draft' | 'trash'>('all');

  const headers = useCallback(() => ({
    'Content-Type': 'application/json',
    'x-admin-password': password,
  }), [password]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, uRes, oRes, cRes] = await Promise.all([
        fetch('/api/products?admin=true'),
        fetch('/api/admin/users', { headers: headers() }),
        fetch('/api/admin/orders', { headers: headers() }),
        fetch('/api/coupons', { headers: headers() }),
      ]);
      const [p, u, o, c] = await Promise.all([pRes.json(), uRes.json(), oRes.json(), cRes.json()]);
      setProducts(Array.isArray(p) ? p : []);
      setUsers(Array.isArray(u) ? u : []);
      setOrders(Array.isArray(o) ? o : []);
      setCoupons(Array.isArray(c) ? c : []);
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
    if (!confirm(`Usunąć produkt "${title}" BEZPOWROTNIE?`)) return;
    await fetch(`/api/products/${slug}`, { method: 'DELETE', headers: headers() });
    setProducts((p) => p.filter((x) => x.slug !== slug));
  };

  const handleSaveProduct = async (slug: string, updates: Partial<Product>) => {
    const res = await fetch(`/api/products/${slug}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error('Aktualizacja nie powiodła się');
    }
    loadAll();
  };

  const moveToTrash = async (slug: string, title: string) => {
    if (!confirm(`Przenieść "${title}" do kosza?`)) return;
    await handleSaveProduct(slug, { status: 'trash' });
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

  const sendShipping = async (orderId: string) => {
    const tracking = prompt('Numer śledzenia przesyłki (opcjonalnie):') ?? undefined;
    await fetch('/api/admin/send-shipping', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ orderId, trackingNumber: tracking || undefined }),
    });
    setOrders((o) => o.map((x) => x.id === orderId ? { ...x, status: 'shipped' as Order['status'] } : x));
    alert('Email o wysyłce został wysłany!');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/aliexpress/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setSearching(false); }
  };

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(''); setCouponError('');
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          ...couponForm,
          expiresAt: couponForm.expiresAt || null,
          category: couponForm.category || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error); return; }
      setCouponMsg(`✓ Kupon "${data.code}" utworzony!`);
      setCouponForm({ code: '', type: 'percent', value: 10, minOrderValue: 0, maxUses: 0, maxUsesPerUser: 1, expiresAt: '', onlyNewCustomers: false, category: '', description: '' });
      loadAll();
    } catch { setCouponError('Błąd serwera'); }
  };

  const toggleCoupon = async (code: string, active: boolean) => {
    await fetch('/api/coupons', { method: 'PATCH', headers: headers(), body: JSON.stringify({ code, active }) });
    setCoupons((c) => c.map((x) => x.code === code ? { ...x, active } : x));
  };

  const deleteCoupon = async (code: string) => {
    if (!confirm(`Usunąć kupon "${code}"?`)) return;
    await fetch('/api/coupons', { method: 'DELETE', headers: headers(), body: JSON.stringify({ code }) });
    setCoupons((c) => c.filter((x) => x.code !== code));
  };

  const handleFulfill = async (orderId: string) => {
    if (!confirm('Automatycznie złożyć zamówienie na AliExpress?')) return;
    setFulfilling(orderId);
    try {
      const res = await fetch('/api/aliexpress/fulfill', {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Zamówienie złożone! AliExpress IDs: ${data.aliOrderIds?.join(', ')}`);
        loadAll();
      } else {
        alert(`Błąd: ${data.error}`);
      }
    } catch { /* ignore */ }
    finally { setFulfilling(null); }
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
    { id: 'kupony',       label: 'Kupony',        icon: Tag },
    { id: 'aliexpress',   label: 'AliExpress',   icon: Link2 },
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
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-text-main">Lista produktów ({products.length})</h3>
                <div className="flex bg-surface rounded-btn p-1">
                  {['all', 'active', 'draft', 'trash'].map(filter => (
                    <button key={filter} onClick={() => setProductStatusFilter(filter as any)}
                      className={`px-3 py-1 text-xs font-medium rounded-btn transition-colors ${
                        productStatusFilter === filter ? 'bg-white shadow-sm text-text-main' : 'text-text-secondary hover:text-text-main'
                      }`}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div className="p-10 text-center text-text-secondary flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
                </div>
              ) : products.length === 0 ? (
                <p className="p-10 text-center text-text-secondary">Brak produktów.</p>
              ) : (
                <div className="divide-y divide-border">
                  {products.filter(p => productStatusFilter === 'all' ? true : (p.status || 'active') === productStatusFilter).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                        {p.images[0] && <Image src={p.images[0]} alt={p.title} fill className="object-contain p-1" sizes="48px" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-main line-clamp-1">
                          {p.title} 
                          {(!p.status || p.status === 'active') && <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">ACTIVE</span>}
                          {p.status === 'draft' && <span className="ml-2 text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">DRAFT</span>}
                          {p.status === 'trash' && <span className="ml-2 text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">TRASH</span>}
                        </p>
                        <p className="text-xs text-text-secondary">{p.category} · <span className="text-primary font-medium">{p.price.eur.toFixed(2).replace('.', ',')} €</span></p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <a href={`/${p.slug}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-3 py-1.5 rounded-btn border border-border hover:border-primary text-text-secondary hover:text-primary transition-colors">
                          Podgląd
                        </a>
                        <button onClick={() => setEditingProduct(p)}
                          className="p-1.5 rounded-btn text-text-secondary hover:text-primary hover:bg-surface transition-colors" title="Edytuj produkt">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {p.status !== 'trash' ? (
                          <button onClick={() => moveToTrash(p.slug, p.title)}
                            className="p-1.5 rounded-btn text-text-secondary hover:text-orange-500 hover:bg-orange-50 transition-colors" title="Przenieś do kosza">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => deleteProduct(p.slug, p.title)}
                            className="p-1.5 rounded-btn text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Usuń trwale">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {editingProduct && (
              <ProductEditor
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={handleSaveProduct}
              />
            )}
            
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
                        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
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
                          {order.status === 'paid' || order.status === 'processing' ? (
                            <>
                              <button
                                onClick={() => handleFulfill(order.id)}
                                disabled={fulfilling === order.id}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-btn bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors font-medium disabled:opacity-50"
                                title="Złóż zamówienie na AliExpress"
                              >
                                {fulfilling === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
                                Fulfil
                              </button>
                              <button
                                onClick={() => sendShipping(order.id)}
                                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-btn bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
                                title="Wyślij email o wysyłce"
                              >
                                <Truck className="w-3.5 h-3.5" /> Wyślij
                              </button>
                            </>
                          ) : null}                          <p className="text-sm font-bold text-primary">{order.total?.toFixed(2).replace('.', ',')} €</p>
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
        {/* ── KUPONY ── */}
        {tab === 'kupony' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text-main">Kody rabatowe</h2>

            {/* Create form */}
            <div className="bg-white rounded-card border border-border p-6 shadow-card">
              <h3 className="font-semibold text-text-main mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" /> Nowy kupon
              </h3>
              <form onSubmit={createCoupon} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Kod *</label>
                    <input value={couponForm.code} onChange={(e) => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                      placeholder="WILLKOMMEN10" required
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Typ</label>
                    <select value={couponForm.type} onChange={(e) => setCouponForm(f => ({ ...f, type: e.target.value as CouponType }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="percent">% Rabatt</option>
                      <option value="fixed">€ Rabatt (stały)</option>
                      <option value="free_shipping">Darmowa wysyłka</option>
                    </select>
                  </div>
                  {couponForm.type !== 'free_shipping' && (
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Wartość {couponForm.type === 'percent' ? '(%)' : '(€)'}
                      </label>
                      <input type="number" min="1" value={couponForm.value}
                        onChange={(e) => setCouponForm(f => ({ ...f, value: Number(e.target.value) }))}
                        className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Min. wartość koszyka (€)</label>
                    <input type="number" min="0" value={couponForm.minOrderValue}
                      onChange={(e) => setCouponForm(f => ({ ...f, minOrderValue: Number(e.target.value) }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Maks. użyć (0 = bez limitu)</label>
                    <input type="number" min="0" value={couponForm.maxUses}
                      onChange={(e) => setCouponForm(f => ({ ...f, maxUses: Number(e.target.value) }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Maks. użyć / użytkownik</label>
                    <input type="number" min="0" value={couponForm.maxUsesPerUser}
                      onChange={(e) => setCouponForm(f => ({ ...f, maxUsesPerUser: Number(e.target.value) }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Data wygaśnięcia</label>
                    <input type="date" value={couponForm.expiresAt}
                      onChange={(e) => setCouponForm(f => ({ ...f, expiresAt: e.target.value }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Kategoria (opcjonalnie)</label>
                    <select value={couponForm.category} onChange={(e) => setCouponForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white">
                      <option value="">Wszystkie kategorie</option>
                      {['MagSafe','Hüllen','Ladegeräte','Kabel','Schutzglas','Powerbanks','Gaming','Smartwatch'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id="newCustomers" checked={couponForm.onlyNewCustomers}
                      onChange={(e) => setCouponForm(f => ({ ...f, onlyNewCustomers: e.target.checked }))}
                      className="rounded" />
                    <label htmlFor="newCustomers" className="text-xs text-text-secondary">Tylko nowi klienci</label>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Opis (notatka wewnętrzna)</label>
                  <input value={couponForm.description} onChange={(e) => setCouponForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="np. Kod powitalny dla nowych klientów"
                    className="w-full border border-border rounded-btn px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                </div>
                {couponMsg && <p className="text-green-600 text-sm font-medium">{couponMsg}</p>}
                {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                <button type="submit" className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Utwórz kupon
                </button>
              </form>
            </div>

            {/* Coupons list */}
            <div className="bg-white rounded-card border border-border shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-text-main">Aktywne kupony ({coupons.length})</h3>
              </div>
              {coupons.length === 0 ? (
                <p className="p-8 text-center text-text-secondary text-sm">Brak kuponów.</p>
              ) : (
                <div className="divide-y divide-border">
                  {coupons.map((c) => (
                    <div key={c.id} className="flex items-center gap-4 px-5 py-3 hover:bg-surface transition-colors flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-sm text-text-main bg-slate-100 px-2 py-0.5 rounded">{c.code}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {c.active ? 'Aktywny' : 'Nieaktywny'}
                          </span>
                          <span className="text-xs text-text-secondary bg-slate-100 px-2 py-0.5 rounded">
                            {c.type === 'percent' && `-${c.value}%`}
                            {c.type === 'fixed' && `-${c.value}€`}
                            {c.type === 'free_shipping' && 'Darmowa wysyłka'}
                          </span>
                          {c.category && <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{c.category}</span>}
                          {c.onlyNewCustomers && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">Nowi klienci</span>}
                        </div>
                        <p className="text-xs text-text-secondary mt-1">
                          Użyto: {c.usedCount}/{c.maxUses || '∞'} · Min: {c.minOrderValue}€
                          {c.expiresAt && ` · Wygasa: ${new Date(c.expiresAt).toLocaleDateString('pl-PL')}`}
                          {c.description && ` · ${c.description}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => toggleCoupon(c.code, !c.active)}
                          className={`text-xs px-3 py-1.5 rounded-btn border transition-colors ${c.active ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                          {c.active ? 'Dezaktywuj' : 'Aktywuj'}
                        </button>
                        <button onClick={() => deleteCoupon(c.code)}
                          className="p-1.5 rounded-btn text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preset coupons */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-card p-4 text-sm text-indigo-800">
              <p className="font-semibold mb-2">Gotowe kody do szybkiego tworzenia:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'WILLKOMMEN10', type: 'percent', value: 10, desc: 'Powitanie nowych klientów' },
                  { code: 'SOMMER20', type: 'percent', value: 20, desc: 'Letnia promocja' },
                  { code: 'GRATIS', type: 'free_shipping', value: 0, desc: 'Darmowa wysyłka' },
                  { code: 'TREUE5', type: 'fixed', value: 5, desc: '5€ dla stałych klientów' },
                ].map((preset) => (
                  <button key={preset.code}
                    onClick={() => setCouponForm(f => ({ ...f, code: preset.code, type: preset.type as CouponType, value: preset.value, description: preset.desc }))}
                    className="px-3 py-1.5 bg-white border border-indigo-200 rounded-btn text-xs font-mono hover:bg-indigo-100 transition-colors">
                    {preset.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ALIEXPRESS ── */}
        {tab === 'aliexpress' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-text-main">AliExpress Integracja</h2>

            {/* OAuth connect */}
            <div className="bg-white rounded-card border border-border p-5 shadow-card">
              <h3 className="font-semibold text-text-main mb-1 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" /> Połączenie OAuth
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Aby automatycznie składać zamówienia na AliExpress, musisz autoryzować aplikację.
              </p>
              <button
                onClick={() => {
                  const redirectUri = `${window.location.origin}/api/aliexpress/callback`;
                  const appId = process.env.NEXT_PUBLIC_ALIEXPRESS_APP_KEY || '532686';
                  window.open(`https://api-sg.aliexpress.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=${redirectUri}&client_id=${appId}`, '_blank');
                }}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                <Link2 className="w-4 h-4" /> Połącz z AliExpress
              </button>
            </div>

            {/* Product search */}
            <div className="bg-white rounded-card border border-border p-5 shadow-card">
              <h3 className="font-semibold text-text-main mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> Wyszukaj produkty
              </h3>
              <form onSubmit={handleSearch} className="flex gap-3 mb-4">
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="np. iPhone case, USB-C cable..."
                  className="flex-1 border border-border rounded-btn px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
                <button type="submit" disabled={searching}
                  className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50">
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Szukaj
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {searchResults.map((r) => (
                    <div key={r.product_id} className="border border-border rounded-card overflow-hidden hover:border-primary transition-colors">
                      {r.main_image && (
                        <div className="relative aspect-square bg-surface">
                          <Image src={r.main_image} alt={r.product_title} fill className="object-contain p-2" sizes="150px" />
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs text-text-main line-clamp-2 mb-1">{r.product_title}</p>
                        <p className="text-xs font-bold text-primary mb-2">{r.sale_price} €</p>
                        <button
                          onClick={() => { setProductId(String(r.product_id)); setTab('produkty'); }}
                          className="w-full text-xs py-1.5 rounded-btn bg-red-50 text-primary hover:bg-red-100 transition-colors font-medium"
                        >
                          + Importuj
                        </button>
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
