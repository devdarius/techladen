import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AGB – TechLaden.de',
  description: 'Allgemeine Geschäftsbedingungen von TechLaden.de.',
};

export default function AgbPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-main mb-8">Allgemeine Geschäftsbedingungen</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 1 Geltungsbereich</h2>
          <p>Diese AGB gelten für alle Bestellungen über unseren Online-Shop. Vertragspartner ist [FIRMENNAME], [ADRESSE].</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 2 Vertragsschluss</h2>
          <p>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot dar. Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung ab.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 3 Preise und Versandkosten</h2>
          <p>Alle Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer von 19% (inkl. 19% MwSt.). Die Lieferung erfolgt innerhalb von 3–7 Werktagen nach Deutschland. Versandkostenfrei ab 29€ Bestellwert.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 4 Zahlung</h2>
          <p>Die Zahlung erfolgt über die im Bestellprozess angebotenen Zahlungsmethoden. Der Kaufpreis ist mit Bestellabschluss fällig.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 5 Lieferung</h2>
          <p>Die Lieferzeit beträgt 3–7 Werktage innerhalb Deutschlands. Lieferzeit: 3–7 Werktage nach Zahlungseingang.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 6 Eigentumsvorbehalt</h2>
          <p>Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 7 Gewährleistung</h2>
          <p>Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist beträgt 2 Jahre ab Lieferung.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 8 Widerrufsrecht</h2>
          <p>Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Details siehe <a href="/widerruf" className="text-primary underline">Widerrufsbelehrung</a>.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">§ 9 Streitbeilegung</h2>
          <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>
      </div>
    </div>
  );
}
