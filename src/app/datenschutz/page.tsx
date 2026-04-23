import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Datenschutz – TechLaden.de' };

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Datenschutzerklärung</h1>
      <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Datenschutz auf einen Blick</h2>
          <h3 className="font-medium text-white mb-1">Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene
            Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Verantwortliche Stelle</h2>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
            [FIRMENNAME]<br />
            [ADRESSE]<br />
            E-Mail: [EMAIL]
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Datenerfassung auf dieser Website</h2>
          <h3 className="font-medium text-white mb-1">Cookies</h3>
          <p>
            Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die Ihr
            Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot
            nutzerfreundlicher, effektiver und sicherer zu machen.
          </p>
          <h3 className="font-medium text-white mt-3 mb-1">Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten
            Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:
            Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des
            zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten
            personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der
            Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu
            sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit
            unter der im Impressum angegebenen Adresse an uns wenden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. Firebase / Google</h2>
          <p>
            Diese Website nutzt Firebase-Dienste von Google LLC, 1600 Amphitheatre Parkway,
            Mountain View, CA 94043, USA. Firebase verarbeitet Daten gemäß der
            Google-Datenschutzrichtlinie. Weitere Informationen:{' '}
            <a
              href="https://firebase.google.com/support/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: '#00D4FF' }}
            >
              https://firebase.google.com/support/privacy
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
