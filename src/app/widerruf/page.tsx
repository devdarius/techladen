import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Widerrufsrecht – TechLaden.de' };

export default function WiderrufPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Widerrufsrecht</h1>
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Widerrufsbelehrung</h2>
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag
            zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder
            ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz
            genommen haben bzw. hat.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Ausübung des Widerrufsrechts</h2>
          <p>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns ([FIRMENNAME], [ADRESSE],
            E-Mail: [EMAIL]) mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter
            Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
          <p className="mt-2">
            Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
            Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Folgen des Widerrufs</h2>
          <p>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
            erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten,
            die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns
            angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens
            binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren
            Widerruf dieses Vertrags bei uns eingegangen ist.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Muster-Widerrufsformular</h2>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <p className="font-medium text-white mb-2">Muster-Widerrufsformular</p>
            <p>An: [FIRMENNAME], [ADRESSE], E-Mail: [EMAIL]</p>
            <p className="mt-2">
              Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
              den Kauf der folgenden Waren (*):
            </p>
            <p className="mt-1">Bestellt am (*) / erhalten am (*):</p>
            <p>Name des/der Verbraucher(s):</p>
            <p>Anschrift des/der Verbraucher(s):</p>
            <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
            <p>Datum:</p>
            <p className="text-slate-500 text-xs mt-2">(*) Unzutreffendes streichen.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
