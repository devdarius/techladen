import Link from 'next/link';
import { Magnet, Smartphone, Zap, Cable, Shield, BatteryCharging, Gamepad2, Watch } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'MagSafe',
    icon: Magnet,
    href: '/?kategorie=MagSafe',
    gradient: 'from-indigo-500 to-purple-600',
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    desc: 'Kabellos laden',
  },
  {
    name: 'Hüllen',
    icon: Smartphone,
    href: '/?kategorie=Hüllen',
    gradient: 'from-slate-600 to-slate-800',
    bg: 'bg-slate-50',
    iconColor: 'text-slate-600',
    desc: 'Schutz & Style',
  },
  {
    name: 'Ladegeräte',
    icon: Zap,
    href: '/?kategorie=Ladegeräte',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    desc: 'GaN & Schnellladen',
  },
  {
    name: 'Kabel',
    icon: Cable,
    href: '/?kategorie=Kabel',
    gradient: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    desc: 'USB-C & mehr',
  },
  {
    name: 'Schutzglas',
    icon: Shield,
    href: '/?kategorie=Schutzglas',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    desc: '9H Härtegrad',
  },
  {
    name: 'Powerbanks',
    icon: BatteryCharging,
    href: '/?kategorie=Powerbanks',
    gradient: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    iconColor: 'text-green-600',
    desc: 'Bis 20.000 mAh',
  },
  {
    name: 'Gaming',
    icon: Gamepad2,
    href: '/?kategorie=Gaming',
    gradient: 'from-red-500 to-rose-600',
    bg: 'bg-red-50',
    iconColor: 'text-red-600',
    desc: 'Mobile Gaming',
  },
  {
    name: 'Smartwatch',
    icon: Watch,
    href: '/?kategorie=Smartwatch',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    desc: 'Bänder & Zubehör',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-7">
        <div>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Sortiment</p>
          <h2 className="text-2xl font-extrabold text-slate-900">Alle Kategorien</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(({ name, icon: Icon, href, bg, iconColor, desc }) => (
          <Link
            key={name}
            href={href}
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-start gap-3 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/60 group-hover:to-purple-50/40 transition-all duration-300 rounded-2xl" />

            <div className={`relative w-11 h-11 ${bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
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
