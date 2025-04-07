import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Preise</h1>
          <p className="mt-2 text-muted-foreground">Unsere aktuellen Preise für die Saison 2025</p>
        </div>

        <div className="grid gap-6">
          {/* Platzmiete */}
          <Card>
            <CardHeader>
              <CardTitle>Platzmiete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Tennisplatz pro Stunde</span>
                <span className="font-medium">12 €</span>
              </div>
            </CardContent>
          </Card>

          {/* Mitgliedschaft */}
          <Card>
            <CardHeader>
              <CardTitle>Mitgliedschaft</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Einzelmitglieder</span>
                <span className="font-medium">100 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Ehepaare</span>
                <span className="font-medium">190 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Kinder bis 14 Jahre</span>
                <span className="font-medium">25 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Jugendliche bis 18 Jahre</span>
                <span className="font-medium">50 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Studenten / Zivildienstleistende</span>
                <span className="font-medium">50 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Passive Mitglieder</span>
                <span className="font-medium">25 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Familienbeitrag</span>
                <span className="font-small">auf Anfrage</span>
              </div>
            </CardContent>
          </Card>

          {/* Hinweis */}
          <div className="text-sm text-muted-foreground">
            <p>Die Mitgliedschaft gilt für das gesamte Kalenderjahr.</p>
            <p>Die Saisonkarte berechtigt zur unbegrenzten Platznutzung während der Sommersaison (Mai bis Oktober).</p>
            <p>Für weitere Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          </div>
        </div>
      </div>
  )
}