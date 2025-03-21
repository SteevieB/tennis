import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
    return (
        <div className="space-y-8">
            {/* Hauptbereich */}
            <section className="space-y-4">
                <h1 className="text-3xl font-bold text-center">
                    Tennis in Unterwössen
                </h1>
                <p className="text-muted-foreground">
                    Herzlich willkommen auf der Buchungsseite unseres Tennisvereins.
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
                <h2 className="font-semibold mb-3">Aktuelle Hinweise</h2>
                <ul className="space-y-2 text-sm">
                    <li>• Platzpflege jeden Montag von 7-8 Uhr</li>
                    <li>• Buchungen sind bis zu 7 Tage im Voraus möglich</li>
                    <li>• Bei Fragen: Hans Müller (Platzwart) - Tel: 0123/456789</li>
                </ul>
            </Card>

            {/* Öffnungszeiten und Kontakt */}
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <h2 className="font-semibold mb-3">Öffnungszeiten</h2>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Montag - Sonntag</p>
                        <p>8:00 - 22:00 Uhr</p>
                    </div>
                </div>

                <div>
                    <h2 className="font-semibold mb-3">So finden Sie uns</h2>
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Mitterweg 7</p>
                        <p>83246 Unterwössen</p>
                        <p className="mt-4">Parkplätze direkt an der Anlage</p>
                    </div>
                </div>
            </div>

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