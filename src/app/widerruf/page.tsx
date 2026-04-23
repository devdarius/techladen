import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Widerrufsrecht – TechLaden.de',
  description: '14-tägiges Widerrufsrecht für alle Bestellungen bei TechLaden.de.',
};

export default function WiderrufPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-main mb-8">Widerrufsrecht</h1>
      <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Widerrufsbelehrung</h2>
          <p>
            Sie haben das Recht, binnen <strong className="text-text-main">vierzehn Tagen</strong> ohne Angabe von Gründen diesen Vertrag zu widerrufen.
            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter die Waren in Besitz genommen haben.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Ausübung des Widerrufsrechts</h2>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ([FIRMENNAME], [ADRESSE], E-Mail: [EMAIL]) mittels einer eindeutigen Erklärung
            (z.B. Brief oder E-Mail) über Ihren Entschluss informieren.
          </p>
          <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, die Mitteilung vor Ablauf der Frist abzusenden.</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, erstatten wir alle Zahlungen einschließlich Lieferkosten unverzüglich,
            spätestens binnen vierzehn Tagen ab Eingang Ihrer Widerrufserklärung.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-text-main mb-2">Muster-Widerrufsformular</h2>
          <div className="bg-surface rounded-card p-4 border border-border">
            <p className="font-medium text-text-main mb-2">Muster-Widerrufsformular</p>
            <p>An: [FIRMENNAME], [ADRESSE], E-Mail: [EMAIL]</p>
            <p className="mt-2">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):</p>
            <p className="mt-1">Bestellt am (*) / erhalten am (*):</p>
            <p>Name des/der Verbraucher(s):</p>
            <p>Anschrift des/der Verbraucher(s):</p>
            <p>Unterschrift (nur bei Mitteilung auf Papier):</p>
            <p>Datum:</p>
            <p className="text-text-secondary text-xs mt-2">(*) Unzutreffendes streichen.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
