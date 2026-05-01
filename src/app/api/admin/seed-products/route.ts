import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getFirestore } from '@/lib/firebase-admin';

function slug(text: string) {
  return text.toLowerCase().replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c] ?? c))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
}
function r99(price: number) { return Math.floor(price) + 0.99; }

const PRODUCTS = [
  // ── MagSafe ──────────────────────────────────────────────────────
  { title: 'MagSafe Leder Wallet – Kartenhalter für iPhone 12–15', category: 'MagSafe', aliEur: 5.49, margin: 3.1, badge: 'BESTSELLER', images: ['https://images.unsplash.com/photo-1601972599748-9a3c3d23b0a3?w=500&q=80'], desc: '<p>Elegantes <strong>Leder-Wallet</strong> mit MagSafe-Magnet. Platz für 3 Karten, kompatibel mit iPhone 12, 13, 14, 15 (inkl. Pro/Max). Ultradünnes Design – fällt nicht auf, schützt optimal.</p>' },
  { title: 'MagSafe Autohalterung 360° – Lüftungsclip & Armaturenbrett', category: 'MagSafe', aliEur: 8.99, margin: 2.9, badge: 'TOP', images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&q=80'], desc: '<p>Starke <strong>360°-Autohalterung</strong> mit MagSafe – kein Kabel, kein Zittern. Passt an jeden Lüftungsschlitz. Kompatibel mit allen MagSafe-fähigen iPhones.</p>' },
  { title: 'MagSafe Powerbank 5000mAh – kabellos & kompakt', category: 'MagSafe', aliEur: 17.99, margin: 2.8, badge: 'NEU', images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80'], desc: '<p><strong>5000mAh MagSafe-Powerbank</strong> mit Wireless 7.5W Schnellladung. Haftet magnetisch am iPhone – kein Kabel nötig. Perfekt für unterwegs.</p>' },
  { title: 'MagSafe Pop Socket Ring – Fingerhalter & Ständer', category: 'MagSafe', aliEur: 2.99, margin: 3.3, badge: null, images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80'], desc: '<p>Kompakter <strong>Pop-Griff mit MagSafe</strong>. Hält sicher am iPhone, dient als Ständer für Netflix & Co. Einfach abnehmbar zum Laden.</p>' },
  { title: 'Qi2 MagSafe Wireless Charger 15W – Tischladestation', category: 'MagSafe', aliEur: 12.99, margin: 2.9, badge: null, images: ['https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80'], desc: '<p><strong>Qi2-zertifizierter MagSafe Lader</strong> mit 15W maximaler Ladeleistung. Kompatibel mit iPhone 13–15 & Android Qi-fähige Geräte. LED-Statusanzeige.</p>' },

  // ── Hüllen ────────────────────────────────────────────────────────
  { title: 'iPhone 15 Pro Silikon Hülle mit MagSafe – 8 Farben', category: 'Hüllen', aliEur: 2.49, margin: 5.2, badge: null, images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&q=80'], desc: '<p>Weiche <strong>Silikonhülle</strong> für iPhone 15 Pro mit integriertem MagSafe-Ring. Microfiber-Innenfutter, kratzfest, 8 Farben erhältlich.</p>' },
  { title: 'iPhone 15 Pro Max Clear Case – Anti-Gelb Schutz', category: 'Hüllen', aliEur: 1.99, margin: 4.5, badge: null, images: ['https://images.unsplash.com/photo-1601972599748-9a3c3d23b0a3?w=500&q=80'], desc: '<p>Kristallklare <strong>transparente Hülle</strong> für iPhone 15 Pro Max. Anti-Vergilbung durch UV-Schutz, 2mm Kameraschutz, Military-Drop-Test bestanden.</p>' },
  { title: 'Samsung Galaxy S24 Ultra Armor Case mit Ständer', category: 'Hüllen', aliEur: 3.49, margin: 4.3, badge: 'TOP', images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80'], desc: '<p><strong>Doppelschicht-Hülle</strong> für Samsung S24 Ultra – TPU + Polycarbonat. Klappbarer Ständer für Hände-freies Schauen, schützt vor Stürzen aus 2m.</p>' },
  { title: 'iPhone 14 Pro Privacy Hülle – Sichtschutz rundum', category: 'Hüllen', aliEur: 3.99, margin: 4.2, badge: 'NEU', images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&q=80'], desc: '<p><strong>Anti-Spy Hülle</strong> für iPhone 14 Pro – nur du siehst deinen Bildschirm. Integrierter Sichtschutzfilter, MagSafe-kompatibel.</p>' },
  { title: 'Samsung Galaxy S24 Leder Book Cover – Klappcase', category: 'Hüllen', aliEur: 5.99, margin: 3.7, badge: null, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'], desc: '<p>Elegantes <strong>Leder-Klappcase</strong> für Samsung S24. Kartenfächer, Standfunktion, automatische Sleep/Wake-Funktion. Premium-Optik.</p>' },

  // ── Ladegeräte ───────────────────────────────────────────────────
  { title: '67W GaN USB-C Ladegerät – 3 Ports, iPhone & MacBook', category: 'Ladegeräte', aliEur: 11.99, margin: 2.9, badge: 'BESTSELLER', images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80'], desc: '<p>Ultrakompaktes <strong>67W GaN-Ladegerät</strong> mit 2x USB-C + 1x USB-A. Lädt iPhone 15 Pro, MacBook Air, AirPods gleichzeitig. EU-Stecker, Überhitzungsschutz.</p>' },
  { title: '3-in-1 Wireless Charging Station – iPhone, Watch & AirPods', category: 'Ladegeräte', aliEur: 14.99, margin: 2.9, badge: 'TOP', images: ['https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&q=80'], desc: '<p>Lade alle Apple-Geräte gleichzeitig. <strong>MagSafe 15W</strong> für iPhone, 3W für AirPods, 2.5W für Apple Watch. LED-Nachtlicht, platzsparend.</p>' },
  { title: '20W USB-C PD Fast Charger – kompakt, EU-Stecker', category: 'Ladegeräte', aliEur: 4.99, margin: 3.0, badge: null, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'], desc: '<p><strong>20W Power Delivery</strong> USB-C Ladegerät. Lädt iPhone 15 in 30min auf 50%. Kompaktes Format, Reisekompatibel. Inklusive Überspannungsschutz.</p>' },
  { title: '100W Desktop USB Ladegerät – 6 Ports GaN', category: 'Ladegeräte', aliEur: 19.99, margin: 2.7, badge: null, images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80'], desc: '<p><strong>100W Ladestation</strong> mit 4x USB-C + 2x USB-A. Lädt bis zu 6 Geräte gleichzeitig. Ideal für Home Office, Intelligente Leistungsverteilung.</p>' },

  // ── Kabel ─────────────────────────────────────────────────────────
  { title: 'USB-C Kabel 2m 100W – schnelles Laden & Datenübertragung', category: 'Kabel', aliEur: 2.99, margin: 3.3, badge: null, images: ['https://images.unsplash.com/photo-1601972599748-9a3c3d23b0a3?w=500&q=80'], desc: '<p><strong>100W USB-C auf USB-C Kabel</strong>, 2 Meter. Geflochten, bis zu 40Gbit/s, kompatibel mit MacBook, iPad, Samsung, Android. Lebensdauer 30.000+ Biegungen.</p>' },
  { title: 'Magnetisches USB-C Ladekabel 540° drehbar – 3er Set', category: 'Kabel', aliEur: 4.49, margin: 3.1, badge: 'NEU', images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'], desc: '<p><strong>Magnetischer Stecker</strong>, 540° schwenkbar. Steck ein – kein Suchen im Dunkeln. Set mit USB-C, Micro-USB & Lightning-Adapter. 3A Schnellladung.</p>' },
  { title: 'USB-C auf Lightning Kabel 1m – Apple MFi zertifiziert', category: 'Kabel', aliEur: 3.99, margin: 3.0, badge: null, images: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&q=80'], desc: '<p><strong>Apple MFi-zertifiziertes Kabel</strong> USB-C auf Lightning. Geflochten, 1m lang, kompatibel mit iPhone 11–14, iPad. 20W PD Schnellladung.</p>' },

  // ── Schutzglas ───────────────────────────────────────────────────
  { title: 'Anti-Spy Panzerglas iPhone 15 Pro – 2 Stück', category: 'Schutzglas', aliEur: 2.99, margin: 4.0, badge: 'BESTSELLER', images: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80'], desc: '<p><strong>Privacy Panzerglas</strong> für iPhone 15 Pro – nur du siehst den Bildschirm (170° Blickschutz). 9H Härte, staubfreies Einsetztool im Lieferumfang. 2 Stück.</p>' },
  { title: '9H Panzerglas Samsung S24 Ultra – 2er Pack, Anti-Fingerprint', category: 'Schutzglas', aliEur: 1.99, margin: 4.0, badge: null, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80'], desc: '<p><strong>9H gehärtetes Glas</strong> für Samsung Galaxy S24 Ultra. Anti-Fingerprint Nano-Beschichtung, 100% Display-Abdeckung. Mit Einsetztool & Staubprotokoll.</p>' },
  { title: 'Kameraschutz Glas iPhone 15 Pro Max – Titan Ring', category: 'Schutzglas', aliEur: 2.49, margin: 4.0, badge: null, images: ['https://images.unsplash.com/photo-1516245834210-c4c142787335?w=500&q=80'], desc: '<p><strong>Kameralinsen-Schutzglas</strong> mit elegantem Titanring für iPhone 15 Pro Max. Verhindert Kratzer auf dem Kamerasystem, 9H Härte, einfache Montage.</p>' },

  // ── Powerbanks ───────────────────────────────────────────────────
  { title: '20000mAh Powerbank 65W PD – für Laptop, iPhone, Android', category: 'Powerbanks', aliEur: 18.99, margin: 2.9, badge: 'TOP', images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80'], desc: '<p><strong>20.000mAh Powerbank</strong> mit 65W USB-C – lädt MacBook Air vollständig. LED-Anzeige, 2x USB-C + 1x USB-A, Schnellladung QC 3.0.</p>' },
  { title: '10000mAh Slim Powerbank 22.5W – ultra-dünn', category: 'Powerbanks', aliEur: 9.99, margin: 2.8, badge: null, images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80'], desc: '<p>Nur 13mm dünn – <strong>10.000mAh Powerbank</strong> im Slim-Design. 22.5W Schnellladung, kompatibel mit iPhone & Android. Passt in jede Jackentasche.</p>' },
  { title: 'Solar Powerbank 10000mAh – wasserdicht IP67', category: 'Powerbanks', aliEur: 14.99, margin: 2.8, badge: 'NEU', images: ['https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500&q=80'], desc: '<p><strong>Solarladefähige Powerbank</strong> mit 10.000mAh und IP67 Wasserschutz. Ideal für Camping & Outdoor. LED-Taschenlampe integriert, 3 USB-Ports.</p>' },

  // ── Smartwatch ───────────────────────────────────────────────────
  { title: 'Apple Watch Ultra 2 Armband – Silikon Sport, 20 Farben', category: 'Smartwatch', aliEur: 3.49, margin: 3.7, badge: null, images: ['https://images.unsplash.com/photo-1523475496153-3206d4c9d710?w=500&q=80'], desc: '<p>Weiches <strong>Sport-Silikonarmband</strong> für Apple Watch Ultra 2, Series 9/8/7 (49mm & 45mm). 20 Farben, schweißabweisend, Schnellverschluss. Für Sport & Alltag.</p>' },
  { title: 'Samsung Galaxy Watch 6 Armband – Milanese Edelstahl', category: 'Smartwatch', aliEur: 6.99, margin: 3.1, badge: 'BESTSELLER', images: ['https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80'], desc: '<p>Edles <strong>Milanese-Edelstahlband</strong> für Samsung Galaxy Watch 6 & 5 (40mm/44mm). Magnetischer Verschluss, premium Look, einfache Montage. Inklusive Adapter.</p>' },
];

export async function POST() {
  const session = await getSession();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Brak dostępu' }, { status: 401 });
  }

  const db = getFirestore();
  const col = db.collection('products/de/items');

  // 1. Delete all existing products
  const existing = await col.get();
  const batch = db.batch();
  existing.docs.forEach(d => batch.delete(d.ref));
  await batch.commit();

  // 2. Insert new products
  const batch2 = db.batch();
  const now = new Date().toISOString();

  PRODUCTS.forEach((p) => {
    const id = slug(p.title);
    const eur = r99(p.aliEur * p.margin);
    const ref = col.doc(id);
    batch2.set(ref, {
      id,
      slug: id,
      title: p.title,
      description: p.desc,
      category: p.category,
      images: p.images,
      price: { eur, aliexpressEur: p.aliEur },
      variants: { colors: [], models: [] },
      aliexpressProductId: '',
      inStock: true,
      badge: p.badge ?? null,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    });
  });

  await batch2.commit();
  return NextResponse.json({ ok: true, added: PRODUCTS.length, deleted: existing.size });
}
