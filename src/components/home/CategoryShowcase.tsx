import Link from 'next/link';
import { Magnet, Smartphone, Zap, Cable, Shield, BatteryCharging, Gamepad2, Watch } from 'lucide-react';

const CATEGORIES = [
  { name: 'MagSafe',    icon: Magnet,         href: '/?kategorie=MagSafe',    desc: 'Kabellos laden',   color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100' },
  { name: 'Hüllen',     icon: Smartphone,     href: '/?kategorie=Hüllen',     desc: 'Schutz & Style',   color: 'bg-slate-50 text-slate-600 group-hover:bg-slate-100' },
  { name: 'Ladegeräte', icon: Zap,            href: '/?kategorie=Ladegeräte', desc: 'GaN Schnellladen', color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' },
  { name: 'Kabel',      icon: Cable,          href: '/?kategorie=Kabel',      desc: 'USB-C & mehr',     color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
  { name: 'Schutzglas', icon: Shield,         href: '/?kategorie=Schutzglas', desc: '9H Härtegrad',     color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' },
  { name: 'Powerbanks', icon: BatteryCharging,href: '/?kategorie=Powerbanks', desc: 'Bis 20.000 mAh',  color: 'bg-green-50 text-green-600 group-hover:bg-green-100' },
  { name: 'Gaming',     icon: Gamepad2,       href: '/?kategorie=Gaming',     desc: 'Mobile Gaming',    color: 'bg-red-50 text-red-600 group-hover:bg-red-100' },
  { name: 'Smartwatch', icon: Watch,          href: '/?kategorie=Smartwatch', desc: 'Bänder & Zubehör', color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' },
];

export default function CategoryShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="section-label mb-1">Sortiment</p>
          <h2 className="text-2xl font-black text-slate-900">Alle Kategorien</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(({ name, icon: Icon, href, desc, color }) => (
          <Link key={name} href={href}
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-start gap-3 hover:border-indigo-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/40 group-hover:to-purple-50/20 transition-all duration-300 rounded-2xl" />
            <div className={`relative w-11 h-11 ${color} rounded-xl flex items-center justify-center transition-all duration-200`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="relative">
              <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors">{name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
