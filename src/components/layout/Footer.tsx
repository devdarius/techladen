import Link from 'next/link';

const CATEGORIES = ['MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch'];
const PAYMENTS = ['PayPal', 'Klarna', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <p className="font-black text-[#111111] text-lg tracking-tight mb-4">
              TECH<span className="font-light text-primary">LADEN</span>
            </p>
            <p className="text-sm leading-relaxed text-[#555555]">
              Premium Handy-Zubehör. Geprüfte Qualität, faire Preise.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">Kategorien</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/?kategorie=${cat}`} className="text-[#555555] hover:text-primary transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">Rechtliches</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Impressum', href: '/impressum' },
                { label: 'Datenschutz', href: '/datenschutz' },
                { label: 'AGB', href: '/agb' },
                { label: 'Widerrufsrecht', href: '/widerruf' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-[#555555] hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#111111] text-xs uppercase tracking-widest mb-4">Service</h3>
            <ul className="space-y-2.5 text-sm text-[#555555]">
              <li><a href="mailto:info@techladen.de" className="hover:text-primary transition-colors">info@techladen.de</a></li>
              <li>Mo–Fr 9–18 Uhr</li>
              <li>Lieferzeit: 3–7 Werktage</li>
              <li>Versandkostenfrei ab 29€</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#E5E5E5] bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map((m) => (
              <span key={m} className="px-2.5 py-1 bg-white border border-[#E5E5E5] rounded text-xs font-medium text-[#111111]">
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#555555]">© 2026 TechLaden.de</p>
        </div>
      </div>
    </footer>
  );
}
