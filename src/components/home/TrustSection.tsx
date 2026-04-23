import { Truck, RotateCcw, Shield, Star } from 'lucide-react';

const ITEMS = [
  { icon: Truck, title: 'Schnelle Lieferung', sub: '3–7 Werktage' },
  { icon: RotateCcw, title: '14 Tage Rückgabe', sub: 'Kostenlos & einfach' },
  { icon: Shield, title: 'Sichere Zahlung', sub: 'SSL verschlüsselt' },
  { icon: Star, title: 'Geprüfte Qualität', sub: 'Alle Produkte getestet' },
];

export default function TrustSection() {
  return (
    <section className="bg-surface border-y border-border py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-btn flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-main text-sm">{title}</p>
                <p className="text-xs text-text-secondary mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
