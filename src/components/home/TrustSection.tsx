import { Truck, RotateCcw, Shield, Star, Package } from 'lucide-react';

const ITEMS = [
  { icon: Truck,     title: 'Schnelle Lieferung',  sub: '3–7 Werktage nach DE' },
  { icon: RotateCcw, title: '14 Tage Rückgabe',    sub: 'Kostenlos & einfach' },
  { icon: Shield,    title: 'Sichere Zahlung',      sub: 'SSL + PayPal Käuferschutz' },
  { icon: Star,      title: 'Geprüfte Qualität',    sub: 'Jedes Produkt getestet' },
  { icon: Package,   title: 'Gratis Versand',       sub: 'Ab 29€ Bestellwert' },
];

const PAYMENTS = ['PayPal', 'Klarna', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'];

export default function TrustSection() {
  return (
    <section className="bg-white border-y border-slate-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">{title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-slate-400 mr-1">Sichere Zahlung:</span>
          {PAYMENTS.map((m) => (
            <span key={m} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
