import Link from 'next/link';
import { Zap, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const CATEGORIES = ['MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch'];
const PAYMENTS = ['PayPal', 'Klarna', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white text-lg">TechLaden<span className="text-indigo-400">.de</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-5 text-slate-500">
              Premium Handy-Zubehör für anspruchsvolle Kunden. Geprüfte Qualität, faire Preise.
            </p>
            <div className="flex gap-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kategorien */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4">Kategorien</h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/?kategorie=${cat}`} className="hover:text-white transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4">Rechtliches</h3>
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

          {/* Service */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4">Service</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href="mailto:info@techladen.de" className="hover:text-white transition-colors">info@techladen.de</a></li>
              <li className="text-slate-500">Mo–Fr 9–18 Uhr</li>
              <li className="text-slate-500">Lieferzeit: 3–7 Werktage</li>
              <li className="text-slate-500">Versandkostenfrei ab 29€</li>
              <li className="text-slate-500">14 Tage Rückgabe</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment + copyright */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {PAYMENTS.map((m) => (
              <span key={m} className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-semibold text-slate-400">
                {m}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600">© 2026 TechLaden.de — Alle Rechte vorbehalten</p>
        </div>
      </div>
    </footer>
  );
}
