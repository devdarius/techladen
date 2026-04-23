const ITEMS = [
  { title: 'Schnelle Lieferung',  sub: '3–7 Werktage' },
  { title: '14 Tage Rückgabe',    sub: 'Kostenlos & einfach' },
  { title: 'Sichere Zahlung',     sub: 'PayPal · Klarna · Kreditkarte' },
  { title: 'Geprüfte Qualität',   sub: 'Jedes Produkt getestet' },
  { title: 'Gratis Versand',      sub: 'Ab 29€ Bestellwert' },
];

export default function TrustSection() {
  return (
    <section className="border-y border-[#E8E8E8] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {ITEMS.map(({ title, sub }) => (
            <div key={title} className="text-center">
              <p className="font-bold text-xs text-black">{title}</p>
              <p className="text-[11px] text-[#999] mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
