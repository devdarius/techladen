import Link from 'next/link';

const CATEGORIES = [
  { name: 'MagSafe', icon: '🧲', color: 'bg-indigo-50 hover:bg-indigo-100' },
  { name: 'Hüllen', icon: '📱', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Ladegeräte', icon: '⚡', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Kabel', icon: '🔌', color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Schutzglas', icon: '🛡️', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'Powerbanks', icon: '🔋', color: 'bg-emerald-50 hover:bg-emerald-100' },
  { name: 'Gaming', icon: '🎮', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Smartwatch', icon: '⌚', color: 'bg-orange-50 hover:bg-orange-100' },
];

export default function CategoryShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-text-main mb-6">Kategorien</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {CATEGORIES.map(({ name, icon, color }) => (
          <Link
            key={name}
            href={`/?kategorie=${name}`}
            className={`${color} rounded-card p-5 flex flex-col items-center gap-2 text-center transition-all card-hover border border-transparent hover:border-border`}
          >
            <span className="text-3xl">{icon}</span>
            <span className="font-semibold text-sm text-text-main">{name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
