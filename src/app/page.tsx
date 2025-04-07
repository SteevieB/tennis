import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
    return (
        <div className="space-y-8">
            {/* Hauptbereich */}
            <section className="space-y-4 px-2 text-center">
                <h1 className="text-3xl font-bold text-center">
                    Tennis in Unterwössen
                </h1>
                <p className="text-muted-foreground">
                    Herzlich willkommen auf der Website des Tennisverein Unterwössen e.V.<br/>
                    Hier können Sie ganz einfach einen unserer drei Plätze reservieren.
                </p>
                <p className="text-muted-foreground">
                    Sie können aber auch  ganz ohne Reservierung einfach vorbeikommen!
                </p>
                <Button asChild>
                    <Link href="/bookings">
                        Platz buchen
                    </Link>
                </Button>
            </section>

            {/* Aktuelle Infos */}
            <Card className="p-6 bg-muted/50">
                <h2 className="font-semibold mb-4">Aktuelle Hinweise</h2>
                <ul className="space-y-4 px-2 text-sm">
                    <li>• Platz 1 ist nur nach Rücksprache mit Schlüssel, die Plätze 2 und 3 sind durchgehend zugänglich <br/> (bitte bei Reservierung beachten)</li>
                    <li>• Buchungen sind bis zu 7 Tage im Voraus möglich</li>
                    <li>• Zutritt zu den Plätzen nur mit geeignetem Schuhwerk (Tennisschuhe)</li>
                    <li>• Die gesamte Anlage ist pfleglich zu behandeln, Schäden sind umgehend zu melden</li>
                    <li>• Das Tennisheim (Umkleiden/Toiletten) hat aktuell keine geregelten Öffnungszeiten, <br/>  wir versuchen jedoch so oft wie möglich vor Ort zu sein</li>
                </ul>
            </Card>

            {/* Platzbild */}
            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden">
                <Image
                    src="/tennisheim.jpg"
                    alt="Tennisheim Unterwössen"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    )
}