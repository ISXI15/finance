export default function Datenschutz() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
          <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-2">1. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
              </p>
              <p className="mt-2">
                [Dein Name / Name des Unternehmens]<br />
                [Deine Adresse]<br />
                [Deine E-Mail-Adresse]<br />
                (Optional: Telefonnummer)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck der Verarbeitung</h2>
              <h3 className="text-xl font-semibold mb-2">a) Art der erhobenen Daten</h3>
              <p>
                Im Rahmen der Nutzung unserer Website speichern wir folgende personenbezogene Daten:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Name</li>
                <li>E-Mail-Adresse</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">b) Zweck der Verarbeitung</h3>
              <p>
                Die Verarbeitung dieser Daten erfolgt zu folgenden Zwecken:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li>Bereitstellung eines Benutzerkontos und Ermöglichung der Anmeldung auf unserer Website.</li>
                <li>Kontaktaufnahme bei Support- oder Rückfragen.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4 mb-2">c) Rechtsgrundlage der Verarbeitung</h3>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> (Erfüllung eines Vertrags): Die Daten sind notwendig, um das Benutzerkonto bereitzustellen.</li>
                <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (berechtigtes Interesse): Wir nutzen die Daten, um den sicheren Betrieb der Website zu gewährleisten.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">3. Nutzung von Vercel als Hosting-Dienstleister</h2>
              <p>
                Unsere Website und die damit verbundene Datenverarbeitung werden über den Anbieter <strong>Vercel Inc.</strong> gehostet.
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Anbieter:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li><strong>Standort der Datenverarbeitung:</strong> Vercel betreibt Serverstandorte weltweit, einschließlich in der EU. Es wird darauf geachtet, dass personenbezogene Daten möglichst auf Servern innerhalb der EU verarbeitet werden. In Ausnahmefällen kann jedoch eine Datenübertragung in die USA stattfinden.</li>
              </ul>
              <p className="mt-2">
                Vercel ist unter dem <strong>EU-US Data Privacy Framework (DPF)</strong> zertifiziert und verpflichtet sich, die europäischen Datenschutzstandards einzuhalten. Weitere Informationen zur Datenverarbeitung durch Vercel finden Sie in der <a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline">Datenschutzerklärung von Vercel</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">4. Speicherung und Löschung der Daten</h2>
              <p>
                Die von Ihnen bereitgestellten personenbezogenen Daten werden nur solange gespeichert, wie dies zur Erfüllung der genannten Zwecke erforderlich ist. Sobald der Zweck entfällt, werden die Daten gelöscht, sofern keine gesetzlichen Aufbewahrungsfristen entgegenstehen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">5. Weitergabe von Daten an Dritte</h2>
              <p>
                Eine Weitergabe Ihrer personenbezogenen Daten erfolgt ausschließlich an folgende Parteien:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Hosting-Provider (Vercel Inc.)</strong>: Zur Bereitstellung der Website und der Datenbank.</li>
                <li>Es erfolgt keine weitere Weitergabe an Dritte, es sei denn, dies ist gesetzlich vorgeschrieben oder ausdrücklich von Ihnen gewünscht.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">6. Sicherheitsmaßnahmen</h2>
              <p>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre personenbezogenen Daten vor unbefugtem Zugriff, Verlust oder Zerstörung zu schützen. Die Verbindung zur Website erfolgt über eine SSL-verschlüsselte Verbindung.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">7. Ihre Rechte</h2>
              <p>
                Sie haben folgende Rechte in Bezug auf Ihre personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO): Sie können Auskunft darüber verlangen, welche Daten wir speichern.</li>
                <li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO): Sie können die Berichtigung unrichtiger Daten verlangen.</li>
                <li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO): Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
                <li><strong>Recht auf Widerspruch</strong> (Art. 21 DSGVO): Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
                <li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO).</li>
              </ul>
              <p className="mt-2">
                Zur Ausübung dieser Rechte können Sie uns unter den oben angegebenen Kontaktdaten erreichen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-2">8. Änderungen der Datenschutzerklärung</h2>
              <p>
                Wir behalten uns das Recht vor, diese Datenschutzerklärung bei Änderungen unserer Dienstleistungen oder rechtlichen Vorgaben zu aktualisieren. Die jeweils aktuelle Version finden Sie auf unserer Website.
              </p>
            </section>
          </div>
        </div>
      </div>
    )
  }

