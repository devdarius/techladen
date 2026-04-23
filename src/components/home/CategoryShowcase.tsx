import Link from 'next/link';
import {
  Magnet, Smartphone, Zap, Cable, Shield,
  BatteryCharging, Gamepad2, Watch,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'MagSafe',     icon: Magnet,          href: '/?kategorie=MagSafe' },
  { name: 'Hüllen',      icon: Smartphone,       href: '/?kategorie=Hüllen' },
  { name: 'Ladegeräte',  icon: Zap,              href: '/?kategorie=Ladegeräte' },
  { name: 'Kabel',       icon: Cable,            href: '/?kategorie=Kabel' },
  { name: 'Schutzglas',  icon: Shield,           href: '/?kategorie=Schutzglas' },
  { name: 'Powerbanks',  icon: BatteryCharging,  href: '/?kategorie=Powerbanks' },
  { name: 'Gaming',      icon: Gamepad2,         href: '/?kategorie=Gaming' },
  { name: 'Smartwatch',  icon: Watch,            href: '/?kategorie=Smartwatch' },
];

export default function CategoryShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Kategorien</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className="group bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center gap-3 text-center hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="w-12 h-12 bg-slate-50 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center transition-colors">
              <Icon className="w-6 h-6 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="font-semibold text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
              {name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
