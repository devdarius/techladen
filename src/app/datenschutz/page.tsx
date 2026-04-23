import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – TechLaden.de',
  description: 'Datenschutzerklärung gemäß DSGVO für TechLaden.de.',
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-main mb-8">Datenschutzerklärung</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">1. Datenschutz auf einen Blick</h2>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert,
            wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            Grundlage ist die Datenschutz-Grundverordnung (DSGVO).
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">2. Verantwortliche Stelle</h2>
          <p>[FIRMENNAME]<br />[ADRESSE]<br />E-Mail: [EMAIL]</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">3. Datenerfassung auf dieser Website</h2>
          <p className="font-medium text-text-main mb-1">Cookies</p>
          <p>Unsere Website verwendet technisch notwendige Cookies zur Speicherung des Warenkorbs (localStorage). Es werden keine Tracking-Cookies eingesetzt.</p>
          <p className="font-medium text-text-main mt-3 mb-1">Server-Log-Dateien</p>
          <p>Der Hosting-Anbieter (Vercel Inc.) erhebt automatisch Server-Log-Dateien mit Browsertyp, Betriebssystem, Referrer URL, IP-Adresse und Uhrzeit der Anfrage.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">4. Ihre Rechte (DSGVO Art. 15–22)</h2>
          <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an: [EMAIL]</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">5. Firebase / Google Cloud</h2>
          <p>
            Diese Website nutzt Firebase (Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA) zur Datenspeicherung.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Weitere Informationen:{' '}
            <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">
              firebase.google.com/support/privacy
            </a>
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">6. Hosting</h2>
          <p>Diese Website wird gehostet bei Vercel Inc., 340 Pine Street Suite 701, San Francisco, CA 94104, USA. Vercel ist zertifizierter Auftragsverarbeiter gemäß DSGVO.</p>
        </section>
      </div>
    </div>
  );
}
