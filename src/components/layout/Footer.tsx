import Link from 'next/link';
import { Zap, Instagram, Twitter, Facebook } from 'lucide-react';

const CATEGORIES = ['MagSafe', 'Hüllen', 'Ladegeräte', 'Kabel', 'Schutzglas', 'Powerbanks', 'Gaming', 'Smartwatch', 'Zubehör'];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1.5 mb-3">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-bold text-text-main">Tech</span>
              <span className="font-light text-text-secondary">Laden.de</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              Premium Handy-Zubehör für anspruchsvolle Kunden. Schnelle Lieferung, faire Preise.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Kategorien */}
          <div>
            <h3 className="font-semibold text-text-main mb-3">Kategorien</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link href={`/?kategorie=${cat}`} className="hover:text-primary transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h3 className="font-semibold text-text-main mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              {[
                { label: 'Impressum', href: '/impressum' },
                { label: 'Datenschutz', href: '/datenschutz' },
                { label: 'AGB', href: '/agb' },
                { label: 'Widerrufsrecht', href: '/widerruf' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="font-semibold text-text-main mb-3">Service</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="mailto:info@techladen.de" className="hover:text-primary transition-colors">Kontakt</a></li>
              <li><span>Lieferzeit: 3–7 Werktage</span></li>
              <li><span>Versandkostenfrei ab 29€</span></li>
              <li><span>14 Tage Rückgabe</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment logos */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-center gap-3">
          {['PayPal', 'Klarna', 'Visa', 'Mastercard', 'Apple Pay', 'Google Pay'].map((method) => (
            <span
              key={method}
              className="px-3 py-1.5 bg-white border border-border rounded text-xs font-semibold text-text-secondary"
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-secondary">
          <span>© 2026 TechLaden.de — Alle Rechte vorbehalten</span>
          <span>Made in Germany 🇩🇪</span>
        </div>
      </div>
    </footer>
  );
}
