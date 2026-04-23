import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Impressum – TechLaden.de' };

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>
      <div className="prose prose-invert prose-sm max-w-none space-y-6 text-slate-300">
        <section>
          <h2 className="text-lg font-semibold text-white">Angaben gemäß § 5 TMG</h2>
          <p>
            [FIRMENNAME]<br />
            [STRASSE UND HAUSNUMMER]<br />
            [PLZ ORT]<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Kontakt</h2>
          <p>
            E-Mail: [EMAIL]<br />
            Telefon: [TELEFONNUMMER]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
            [UST-ID]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            [NAME]<br />
            [ADRESSE]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white">Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
              style={{ color: '#00D4FF' }}
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
