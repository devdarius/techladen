import Link from 'next/link';

const CATEGORIES = ['MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch'];
const PAYMENTS = ['PayPal', 'Klarna', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'];

export default function Footer() {
  return (
    <footer className="bg-[#111] text-[#888]">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          <div>
            <p className="font-black text-white text-lg tracking-tight mb-4">
              TECH<span className="font-light">LADEN</span><span className="text-[#555]">.DE</span>
            </p>
            <p className="text-sm leading-relaxed text-[#666]">
              Premium Handy-Zubehör. Geprüfte Qualität, faire Preise.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Kategorien</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/?kategorie=${cat}`} className="hover:text-white transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Rechtliches</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Impressum', href: '/impressum' },
                { label: 'Datenschutz', href: '/datenschutz' },
                { label: 'AGB', href: '/agb' },
                { label: 'Widerrufsrecht', href: '/widerruf' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Service</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:info@techladen.de" className="hover:text-white transition-colors">info@techladen.de</a></li>
              <li>Mo–Fr 9–18 Uhr</li>
              <li>Lieferzeit: 3–7 Werktage</li>
              <li>Versandkostenfrei ab 29€</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#222]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map((m) => (
              <span key={m} className="px-2.5 py-1 bg-[#1a1a1a] border border-[#333] rounded text-xs font-medium text-[#666]">
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-[#444]">© 2026 TechLaden.de</p>
        </div>
      </div>
    </footer>
  );
}
