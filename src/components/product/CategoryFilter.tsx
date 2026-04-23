'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
  categories: string[];
  active: string;
}

export default function CategoryFilter({ categories, active }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'Alle') {
      params.delete('kategorie');
    } else {
      params.set('kategorie', cat);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            active === cat
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-text-main border-border hover:border-primary hover:text-primary'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
