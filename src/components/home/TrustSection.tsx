import { Truck, RotateCcw, ShieldCheck, BadgeCheck, PackageCheck } from 'lucide-react';

const ITEMS = [
  { title: 'Schnelle Lieferung',  sub: '3–7 Werktage nach DE', icon: Truck,         color: '#2563EB', bg: '#EFF6FF' },
  { title: '30 Tage Rückgabe',    sub: 'Kostenlos & einfach',  icon: RotateCcw,     color: '#7C3AED', bg: '#F5F3FF' },
  { title: 'Sichere Zahlung',     sub: 'PayPal · Klarna · Karte', icon: ShieldCheck, color: '#10B981', bg: '#F0FDF4' },
  { title: 'Geprüfte Qualität',   sub: 'Jedes Produkt getestet', icon: BadgeCheck,   color: '#FF5733', bg: '#FFF4F1' },
  { title: 'Gratis Versand',      sub: 'Ab 29€ Bestellwert',   icon: PackageCheck,  color: '#0EA5E9', bg: '#F0F9FF' },
];

export default function TrustSection() {
  return (
    <section className="bg-white border-y border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map(({ title, sub, icon: Icon, color, bg }, idx) => (
            <div
              key={title}
              className={`flex items-center gap-3 px-4 py-5 ${idx < ITEMS.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-[#E2E8F0]' : ''}`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#0F172A] leading-tight">{title}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5 leading-tight">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
