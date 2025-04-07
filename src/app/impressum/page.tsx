import { CLUB_INFO } from "@/lib/constants";

export default function ImpressumPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Impressum</h1>
          <p className="mt-2 text-muted-foreground">Angaben gemäß § 5 TMG</p>
        </div>

        <div className="prose max-w-none">
          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Angaben zum Verein</h2>
            <p className="mb-4">
              {CLUB_INFO.name}<br />
              {CLUB_INFO.address.street}<br />
              {CLUB_INFO.address.zip} {CLUB_INFO.address.city}
            </p>

            <p className="mb-4">
              <strong>Vereinsregistereintrag:</strong><br />
              Eingetragen im Vereinsregister beim {CLUB_INFO.legalInfo.register}<br />
              Registernummer: {CLUB_INFO.legalInfo.registerNumber}
            </p>

            <p className="mb-4">
              <strong>Vertreten durch:</strong><br />
              1. Vorsitzender: {CLUB_INFO.management.chairman}<br />
              2. Vorsitzender: {CLUB_INFO.management.vicechairman}<br />
              Schatzmeister: {CLUB_INFO.management.treasurer}<br />
              Jugendbeauftragte: {CLUB_INFO.management.youth}<br />
              Schriftführer: {CLUB_INFO.management.schreiber}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Kontakt</h2>
            <p className="mb-4">
              Telefon: +49 (0)174 396 4745<br />
              E-Mail: info@tennis-unterwoessen.de
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p className="mb-4">
              {CLUB_INFO.management.chairman}<br />
              1. Vorstand<br />
              {CLUB_INFO.managementAddress.street}<br />
              {CLUB_INFO.managementAddress.zip} {CLUB_INFO.managementAddress.city}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Streitschlichtung</h2>
            <p className="mb-4">
              Die Universalschlichtungsstelle des Bundes stellt eine Plattform zur Online-Streitbeilegung bereit:<br/>
              <a href="https://www.universalschlichtungsstelle.de/" className="text-primary hover:underline">https://www.universalschlichtungsstelle.de/</a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
            <p className="mb-4">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Haftung für Inhalte</h2>
            <p className="mb-4">
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den
              allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
              verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
              forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p className="mb-4">
              Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen
              Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
              Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Haftung für Links</h2>
            <p className="mb-4">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten
              Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
              waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p className="mb-4">
              Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
              Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links
              umgehend entfernen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">Urheberrecht</h2>
            <p className="mb-4">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p className="mb-4">
              Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter
              beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
              Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei
              Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </section>
        </div>
      </div>
  )
}