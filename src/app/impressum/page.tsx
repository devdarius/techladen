import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum – TechLaden.de',
  description: 'Impressum und Anbieterkennzeichnung gemäß § 5 TMG für TechLaden.de.',
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-main mb-8">Impressum</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Angaben gemäß § 5 TMG</h2>
          <p>
            [FIRMENNAME]<br />
            [STRASSE UND HAUSNUMMER]<br />
            [PLZ ORT]<br />
            Deutschland
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Kontakt</h2>
          <p>E-Mail: [EMAIL]<br />Telefon: [TELEFONNUMMER]</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: [UST-ID]</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>[NAME]<br />[ADRESSE]</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="mt-2">Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
        </section>
      </div>
    </div>
  );
}
