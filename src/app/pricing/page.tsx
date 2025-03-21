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
                <span className="font-medium">10 €</span>
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
                <span>Kinder unter 12 Jahre</span>
                <span className="font-medium">0 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Jugendliche 12 - 15 Jahre</span>
                <span className="font-medium">50 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Jugendliche 16 - 18 Jahre</span>
                <span className="font-medium">75 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Erwachsene (ab 18 Jahre)</span>
                <span className="font-medium">100 €</span>
              </div>
            </CardContent>
          </Card>

          {/* Saisonkarte */}
          <Card>
            <CardHeader>
              <CardTitle>Saisonkarte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Kinder unter 12 Jahre</span>
                <span className="font-medium">10 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Jugendliche 12 - 15 Jahre</span>
                <span className="font-medium">60 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Jugendliche 16 - 18 Jahre</span>
                <span className="font-medium">85 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Erwachsene (ab 18 Jahre)</span>
                <span className="font-medium">110 €</span>
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