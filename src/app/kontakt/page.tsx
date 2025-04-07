'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin } from "lucide-react"
import { CLUB_INFO } from "@/lib/constants";

export default function KontaktPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Kontakt</h1>
          <p className="mt-2 text-muted-foreground">Kontaktieren Sie den {CLUB_INFO.name}</p>
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
                  <p className="text-sm text-muted-foreground">{CLUB_INFO.name}</p>
                  <p className="text-sm text-muted-foreground">{CLUB_INFO.address.street}</p>
                  <p className="text-sm text-muted-foreground">{CLUB_INFO.address.zip} {CLUB_INFO.address.city}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Telefon</h3>
                  <p className="text-sm text-muted-foreground">{CLUB_INFO.contact.phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">E-Mail</h3>
                  <p className="text-sm text-muted-foreground">{CLUB_INFO.contact.email}</p>
                  <div className="mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `mailto:${CLUB_INFO.contact.email}`}                    >
                      <Mail className="mr-2 h-4 w-4" />
                      E-Mail schreiben
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Öffnungszeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h3 className="font-medium">Tennisplätze</h3>
                <p className="text-sm text-muted-foreground">Täglich von {CLUB_INFO.court.openingHours.open} - {CLUB_INFO.court.openingHours.close} Uhr</p>
                <p className="text-sm text-muted-foreground">{CLUB_INFO.court.addition}</p>
              </div>

              <div className="flex flex-col space-y-2 mt-4">
                <h3 className="font-medium">Tennisheim</h3>
                <p className="text-sm text-muted-foreground">
                  Das Tennisheim (Umkleiden/Toiletten) hat aktuell keine geregelten Öffnungszeiten,<br />
                  wir versuchen jedoch so oft wie möglich vor Ort zu sein
                </p>
              </div>
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
                <p className="text-sm text-muted-foreground mb-4">{CLUB_INFO.address.street}, {CLUB_INFO.address.zip} {CLUB_INFO.address.city}</p>
                <Button
                    variant="outline"
                    onClick={() => window.open('https://maps.google.com/?q=Streichenweg+18+83246+Unterwössen', '_blank')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
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