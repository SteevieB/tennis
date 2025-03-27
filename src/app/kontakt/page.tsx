'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function KontaktPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kontakt</h1>
          <p className="mt-2 text-muted-foreground">Wir freuen uns über Ihre Nachricht</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformationen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Adresse</h3>
                  <p className="text-sm text-muted-foreground">Tennis Unterwössen e.V.</p>
                  <p className="text-sm text-muted-foreground">Streichenweg 18</p>
                  <p className="text-sm text-muted-foreground">83246 Unterwössen</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Telefon</h3>
                  <p className="text-sm text-muted-foreground">+49 (0)160 97077622</p>
                  <p className="text-sm text-muted-foreground mt-2">Platzwart Hans Müller:</p>
                  <p className="text-sm text-muted-foreground">Tel: 0123 / 456789</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">E-Mail</h3>
                  <p className="text-sm text-muted-foreground">tennisverein.unterwoessen@gmx.de</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nachricht senden</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Ihr Name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail</Label>
                  <Input id="email" type="email" placeholder="ihre.email@beispiel.de" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Betreff</Label>
                  <Input id="subject" placeholder="Betreff Ihrer Nachricht" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Nachricht</Label>
                  <textarea
                      id="message"
                      rows={5}
                      className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="Ihre Nachricht an uns..."
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">Nachricht senden</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Anfahrt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full rounded-md bg-muted flex items-center justify-center">
              <div className="text-center p-4">
                <p className="mb-2">Tennisanlage Unterwössen</p>
                <p className="text-sm text-muted-foreground mb-4">Streichenweg 18, 83246 Unterwössen</p>
                <Button variant="outline" onClick={() => window.open('https://maps.google.com/?q=Streichenweg+18+83246+Unterwössen', '_blank')}>
                  In Google Maps öffnen
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Anfahrtsbeschreibung:</h3>
              <p className="text-sm text-muted-foreground">Von der Hauptstraße (Dorfstraße) in Unterwössen abbiegen auf den Streichenweg. Nach etwa 500m finden Sie auf der rechten Seite unsere Tennisanlage mit drei Plätzen und ausreichend Parkplätzen.</p>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}