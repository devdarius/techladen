import type { Review } from '@/types/product';

const NAMES = ['Max', 'Anna', 'Thomas', 'Sarah', 'Michael', 'Lisa', 'Stefan', 'Julia', 'Andreas', 'Laura', 'Markus', 'Petra', 'Christian', 'Sandra', 'Daniel', 'Nicole', 'Tobias', 'Katharina', 'Sebastian', 'Monika'];
const CITIES = ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg'];

const TITLES_5 = [
  'Absolut top!', 'Sehr zufrieden', 'Perfekte Qualität', 'Genau wie beschrieben', 'Klasse Produkt',
  'Sehr empfehlenswert', 'Tolle Verarbeitung', 'Bin begeistert', 'Super Kauf', 'Alles bestens',
];
const TITLES_4 = [
  'Gutes Produkt', 'Solide Qualität', 'Passt gut', 'Bin zufrieden', 'Guter Kauf',
  'Macht was es soll', 'Empfehlenswert', 'Schönes Design', 'Gutes Preis-Leistungs-Verhältnis',
];
const TITLES_3 = [
  'Geht so', 'Okay für den Preis', 'Mittelmäßig', 'Könnte besser sein', 'Akzeptabel',
];
const TITLES_2 = ['Etwas enttäuscht', 'Nicht ganz überzeugt', 'Verbesserungswürdig'];
const TITLES_1 = ['Leider enttäuscht', 'Nicht empfehlenswert'];

const TEXTS_5 = [
  'Bin wirklich begeistert von diesem Produkt. Qualität ist top und die Lieferung war super schnell. Kann ich nur empfehlen!',
  'Habe das Produkt für mein Smartphone gekauft und bin sehr zufrieden. Passt perfekt und sieht toll aus.',
  'Sehr gute Verarbeitung, genau wie auf den Bildern. Schnelle Lieferung, alles bestens verpackt.',
  'Tolles Produkt zu einem fairen Preis. Habe schon mehrere Sachen hier bestellt und war immer zufrieden.',
  'Qualität ist wirklich gut. Mein Handy ist jetzt bestens geschützt. Sehr empfehlenswert!',
  'Schnelle Lieferung, gute Qualität. Genau das was ich gesucht habe. Werde wieder hier bestellen.',
  'Super Produkt! Passt perfekt, sieht hochwertig aus und der Preis ist fair. Sehr zufrieden.',
];
const TEXTS_4 = [
  'Gutes Produkt, bin zufrieden. Qualität ist solide, Lieferung hat etwas länger gedauert aber alles gut.',
  'Passt gut und macht einen guten Eindruck. Kleinigkeiten könnten besser sein, aber insgesamt empfehlenswert.',
  'Solide Qualität für den Preis. Würde ich wieder kaufen. Lieferung war pünktlich.',
  'Bin zufrieden mit dem Kauf. Das Produkt hält was es verspricht. Gutes Preis-Leistungs-Verhältnis.',
  'Gutes Produkt, macht was es soll. Design gefällt mir gut. Lieferung war schnell.',
];
const TEXTS_3 = [
  'Produkt ist okay, aber nicht überragend. Für den Preis geht es in Ordnung.',
  'Qualität ist mittelmäßig. Passt zwar, aber die Verarbeitung könnte besser sein.',
  'Geht so. Habe schon besseres gesehen, aber auch schlechteres. Preis ist fair.',
];
const TEXTS_2 = [
  'Bin etwas enttäuscht. Qualität entspricht nicht ganz den Erwartungen. Passt aber.',
  'Nicht ganz das was ich erwartet hatte. Verarbeitung könnte besser sein.',
];
const TEXTS_1 = [
  'Leider nicht zufrieden. Qualität ist schlecht und passt nicht richtig.',
  'Würde ich nicht empfehlen. Entspricht nicht der Beschreibung.',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

function pickRating(rand: () => number): number {
  const r = rand();
  if (r < 0.50) return 5;
  if (r < 0.80) return 4;
  if (r < 0.95) return 3;
  if (r < 0.99) return 2;
  return 1;
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDate(rand: () => number): string {
  const now = Date.now();
  const sixMonthsAgo = now - 180 * 24 * 60 * 60 * 1000;
  const ts = sixMonthsAgo + rand() * (now - sixMonthsAgo);
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function generateReviews(slug: string): Review[] {
  const seed = hashString(slug);
  const rand = seededRandom(seed);
  const count = 8 + Math.floor(rand() * 8); // 8-15

  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const rating = pickRating(rand);
    let title: string, text: string;
    if (rating === 5) { title = pick(TITLES_5, rand); text = pick(TEXTS_5, rand); }
    else if (rating === 4) { title = pick(TITLES_4, rand); text = pick(TEXTS_4, rand); }
    else if (rating === 3) { title = pick(TITLES_3, rand); text = pick(TEXTS_3, rand); }
    else if (rating === 2) { title = pick(TITLES_2, rand); text = pick(TEXTS_2, rand); }
    else { title = pick(TITLES_1, rand); text = pick(TEXTS_1, rand); }

    reviews.push({
      id: `${slug}-review-${i}`,
      author: pick(NAMES, rand),
      location: pick(CITIES, rand),
      rating,
      title,
      text,
      date: randomDate(rand),
      verified: rand() > 0.1,
      helpful: Math.floor(rand() * 30),
    });
  }
  return reviews;
}

export function getAverageRating(reviews: Review[]): number {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
