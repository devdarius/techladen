import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Zap className="w-5 h-5" style={{ color: '#00D4FF' }} />
              <span className="text-white">Tech</span>
              <span style={{ color: '#00D4FF' }}>Laden</span>
              <span className="text-slate-400 text-sm font-normal">.de</span>
            </div>
            <p className="text-slate-400 text-sm">
              Premium Handy-Zubehör für anspruchsvolle Kunden. Schnelle
              Lieferung, faire Preise.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Rechtliches</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/widerruf" className="hover:text-white transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Service</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Lieferzeit: 3–7 Werktage</li>
              <li>14 Tage Rückgaberecht</li>
              <li>Alle Preise inkl. 19% MwSt.</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} TechLaden.de – Alle Rechte vorbehalten
        </div>
      </div>
    </footer>
  );
}
