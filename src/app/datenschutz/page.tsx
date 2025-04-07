export default function DatenschutzPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
          <p className="mt-2 text-muted-foreground">Stand: März 2025</p>
        </div>

        <div className="prose max-w-none">
          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Verantwortlicher</h2>
            <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="mb-4">
              Tennis Unterwössen e.V.<br />
              Streichenweg 18<br />
              83246 Unterwössen<br />
              E-Mail: info@tennis-unterwoessen.de<br />
              Telefon: +49 (0)160 97077622
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Datenerfassung auf unserer Website</h2>

            <h3 className="text-lg font-medium mt-4 mb-2">Cookies</h3>
            <p>
              Unsere Website verwendet Cookies. Bei Cookies handelt es sich um Textdateien, die im Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des Nutzers gespeichert werden. Wir verwenden Cookies, um unsere Website nutzerfreundlicher zu gestalten. Einige Elemente unserer Internetseite erfordern es, dass der aufrufende Browser auch nach einem Seitenwechsel identifiziert werden kann.
            </p>
            <p className="mb-4">
              In den Cookies werden dabei folgende Daten gespeichert und übermittelt:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Login-Informationen (JWT-Token)</li>
              <li>Spracheinstellungen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Datenschutz bei der Platzreservierung</h2>
            <p>
              Für die Nutzung unseres Online-Buchungssystems ist eine Registrierung als Benutzer erforderlich. Dabei werden folgende personenbezogene Daten erfasst und gespeichert:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name</li>
              <li>E-Mail-Adresse</li>
              <li>Informationen zu Ihren Platzbuchungen (Datum, Uhrzeit, Platznummer)</li>
            </ul>
            <p className="mb-4">
              Die Daten werden ausschließlich zum Zweck der Verwaltung der Tennisplätze, zur Kontaktaufnahme bei Rückfragen sowie zur Abrechnung verwendet. Eine Weitergabe an Dritte erfolgt nicht, sofern keine gesetzliche Pflicht hierzu besteht.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Ihre Rechte</h2>
            <p>Als betroffene Person haben Sie folgende Rechte:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung oder Löschung (Art. 16, 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            </ul>
            <p className="mb-4">
              Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Dauer der Speicherung</h2>
            <p className="mb-4">
              Wir speichern Ihre personenbezogenen Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden, erforderlich ist oder sofern dies gesetzlich vorgeschrieben ist. Die Buchungsdaten werden nach Ende der Tennissaison noch für den Zeitraum von 6 Monaten aufbewahrt und danach gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Datensicherheit</h2>
            <p className="mb-4">
              Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird. Ob eine einzelne Seite unseres Internetauftrittes verschlüsselt übertragen wird, erkennen Sie an der geschlossenen Darstellung des Schlüssel- beziehungsweise Schloss-Symbols in der unteren Statusleiste Ihres Browsers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Änderung der Datenschutzerklärung</h2>
            <p className="mb-4">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der Datenschutzerklärung umzusetzen, z.B. bei der Einführung neuer Services. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
            </p>
          </section>
        </div>
      </div>
  )
}