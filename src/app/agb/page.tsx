import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'AGB – TechLaden.de' };

export default function AgbPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, die über unseren
            Online-Shop getätigt werden. Vertragspartner ist [FIRMENNAME], [ADRESSE].
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 2 Vertragsschluss</h2>
          <p>
            Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot,
            sondern eine Aufforderung zur Bestellung dar. Durch Anklicken des Bestellbuttons geben
            Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 3 Preise und Versandkosten</h2>
          <p>
            Alle Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer von 19%.
            Die Lieferung erfolgt innerhalb von 3–7 Werktagen nach Deutschland. Versandkosten
            werden im Bestellprozess ausgewiesen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 4 Zahlung</h2>
          <p>
            Die Zahlung erfolgt über die im Bestellprozess angebotenen Zahlungsmethoden.
            Der Kaufpreis ist mit Bestellabschluss fällig.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 5 Eigentumsvorbehalt</h2>
          <p>
            Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 6 Gewährleistung</h2>
          <p>
            Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist beträgt
            2 Jahre ab Lieferung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">§ 7 Streitbeilegung</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
