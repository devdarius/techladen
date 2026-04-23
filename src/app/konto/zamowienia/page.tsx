'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import type { Order } from '@/types/user';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: 'Oczekuje',      color: 'bg-yellow-100 text-yellow-800' },
  paid:       { label: 'Opłacone',      color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'W realizacji',  color: 'bg-purple-100 text-purple-800' },
  shipped:    { label: 'Wysłane',       color: 'bg-indigo-100 text-indigo-800' },
  delivered:  { label: 'Dostarczone',   color: 'bg-green-100 text-green-800' },
  cancelled:  { label: 'Anulowane',     color: 'bg-red-100 text-red-800' },
};

export default function ZamowieniaPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/logowanie');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/konto" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Wróć do konta
      </Link>
      <h1 className="text-2xl font-bold text-text-main mb-6">Moje zamówienia</h1>

      {fetching ? (
        <div className="flex items-center justify-center py-16 text-text-secondary gap-2">
          <Loader2 className="w-5 h-5 animate-spin" /> Ładowanie…
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-card border border-border">
          <Package className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="font-medium text-text-main">Brak zamówień</p>
          <p className="text-sm text-text-secondary mt-1 mb-4">Nie złożyłeś jeszcze żadnego zamówienia.</p>
          <Link href="/" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            Przejdź do sklepu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = STATUS_LABELS[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-800' };
            return (
              <div key={order.id} className="bg-white rounded-card border border-border shadow-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface">
                  <div className="text-xs text-text-secondary">
                    <span className="font-medium text-text-main">#{order.id.slice(-8).toUpperCase()}</span>
                    {' · '}
                    {new Date(order.createdAt).toLocaleDateString('pl-PL')}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="relative w-10 h-10 flex-shrink-0 rounded-btn overflow-hidden bg-surface border border-border">
                        {item.image && <Image src={item.image} alt={item.title} fill className="object-contain p-0.5" sizes="40px" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-main line-clamp-1">{item.title}</p>
                        <p className="text-xs text-text-secondary">× {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-text-main flex-shrink-0">
                        {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                      </p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    Wysyłka: {order.shippingAddress.street}, {order.shippingAddress.zip} {order.shippingAddress.city}
                  </p>
                  <p className="text-sm font-bold text-primary">
                    {order.total.toFixed(2).replace('.', ',')} €
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
