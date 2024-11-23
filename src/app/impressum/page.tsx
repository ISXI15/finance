export default function Impressum() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h1 className="text-3xl font-bold mb-6">Impressum</h1>
          <div className="space-y-4">
            <p><strong>Angaben gemäß § 5 TMG:</strong></p>
            <p>
              Ilse Weingaertner <br />
              Winzererstraße 61<br />
              80797 München
            </p>
            <p><strong>Kontakt:</strong></p>
            <p>
              Telefon: +49 (0) 123 456789<br />
              E-Mail: ilse.weingaertner@gmail.com
            </p>
            <p><strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong></p>
            <p>
              Vorname Nachname<br />
              Straße Nr.<br />
              PLZ Ort
            </p>
            {/* Fügen Sie hier weitere erforderliche Informationen hinzu */}
          </div>
        </div>
      </div>
    )
  }

