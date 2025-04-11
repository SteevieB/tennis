'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Home, CircleDot } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import BookingSlot from "@/components/BookingSlot"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Booking, User, CourtBlock, Settings } from '@/types';

const courts = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
]

// Funktion zum Generieren von Timeslots basierend auf Öffnungs- und Schließzeiten
function generateTimeSlots(settings: Settings | null) {
  // Standardwerte, falls keine Einstellungen vorhanden sind
  const defaultOpeningHour = 8;
  const defaultClosingHour = 22;

  // Parse die Zeiten aus den Strings
  let openingHour = defaultOpeningHour;
  let closingHour = defaultClosingHour;

  if (settings?.openingTime && settings?.closingTime) {
    openingHour = parseInt(settings.openingTime.split(':')[0]);
    closingHour = parseInt(settings.closingTime.split(':')[0]);
  }

  // Berechne die Anzahl der Stunden zwischen Öffnungszeit und Schließzeit
  const length = closingHour - openingHour;

  // Generiere die Timeslots
  return Array.from({ length }, (_, i) => {
    const hour = i + openingHour;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
}

export default function BookingsPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedCourt, setSelectedCourt] = useState(courts[0])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [courtBlocks, setCourtBlocks] = useState<CourtBlock[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Generiere Timeslots basierend auf den Einstellungen
  const timeSlots = generateTimeSlots(settings);

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');

      const endpoint = currentUser
          ? `/api/bookings?courtId=${selectedCourt.id}&date=${formattedDate}`
          : `/api/public/bookings?courtId=${selectedCourt.id}&date=${formattedDate}`

      const response = await fetch(endpoint)

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
        setCourtBlocks(data.blocks || [])
        setSettings(data.settings || null)
      } else {
        setBookings([])
        setCourtBlocks([])
        setSettings(null)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
      setCourtBlocks([])
      setSettings(null)
    }
  }, [selectedCourt, selectedDate, currentUser])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data)
      } else {
        setCurrentUser(null)
      }
    } catch {
      setCurrentUser(null)
    }
  }

  const handleBooking = async (startTime: string, type: string = 'regular') => {
    try {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId: selectedCourt.id,
          date: formattedDate,
          startTime,
          type
        }),
      })

      if (response.ok) {
        toast({
          title: "Buchung erfolgreich!",
          description: `Platz ${selectedCourt.name} wurde für ${formattedDate} um ${startTime} Uhr gebucht.`,
        })
        await fetchBookings()
      } else {
        const errorData = await response.json()
        toast({
          title: "Buchung fehlgeschlagen",
          description: errorData.error || "Bitte versuchen Sie es erneut.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      toast({
        title: "Buchung fehlgeschlagen",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      })
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    try {
      const response = await fetch(`/api/bookings?id=${bookingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: "Stornierung erfolgreich",
          description: "Die Buchung wurde erfolgreich storniert.",
        })
        await fetchBookings()
      } else {
        const errorData = await response.json()
        toast({
          title: "Stornierung fehlgeschlagen",
          description: errorData.error || "Bitte versuchen Sie es erneut.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error canceling booking:', error)
      toast({
        title: "Stornierung fehlgeschlagen",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      })
    }
  }

  const canCancelBooking = (booking: Booking | null) => {
    if (!booking) return false;
    return currentUser?.isAdmin || booking.user_id === currentUser?.id;
  };

  // Prüft, ob ein Zeitslot für den ausgewählten Platz geblockt ist
  const isTimeSlotBlocked = (timeSlot: string) => {
    // Überprüfe, ob der ausgewählte Platz für das ausgewählte Datum gesperrt ist
    return courtBlocks.length > 0;
  };

  // Suche nach dem Sperrgrund für den aktuellen Platz
  const getBlockReason = () => {
    if (courtBlocks.length > 0) {
      return courtBlocks[0].reason;
    }
    return undefined;
  };

  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-3xl font-bold">Tennisplatzbuchung</h1>
          {currentUser?.isAdmin ? (
              <Button variant="outline" onClick={() => router.push('/admin/settings')}>
                Admin-Bereich
              </Button>
          ) : null}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platzauswahl</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-center h-24 bg-muted rounded-lg">
                    <div className="flex flex-col items-center space-y-2">
                      <Home className="w-8 h-8" />
                      <span className="font-medium">Tennisheim</span>
                    </div>
                  </div>
                </div>

                {/* Platz 1 oben */}
                <div className="col-span-2">
                  <Button
                      variant={selectedCourt.id === 1 ? "default" : "outline"}
                      className="h-24 w-full"
                      onClick={() => setSelectedCourt(courts[0])}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <CircleDot className="w-8 h-8" />
                      <span className="font-medium">Platz 1</span>
                    </div>
                  </Button>
                </div>

                {/* Platz 3 unten links // Nummerierung so im Pachtvertrag */}
                <div className="col-span-1">
                  <Button
                      variant={selectedCourt.id === 3 ? "default" : "outline"}
                      className="h-24 w-full"
                      onClick={() => setSelectedCourt(courts[2])}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <CircleDot className="w-8 h-8" />
                      <span className="font-medium">Platz 3</span>
                    </div>
                  </Button>
                </div>

                {/* Platz 2 unten rechts // Nummerierung so im Pachtvertrag */}
                <div className="col-span-1">
                  <Button
                      variant={selectedCourt.id === 2 ? "default" : "outline"}
                      className="h-24 w-full"
                      onClick={() => setSelectedCourt(courts[1])}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <CircleDot className="w-8 h-8" />
                      <span className="font-medium">Platz 2</span>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datum wählen</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < today}
                  className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verfügbare Zeiten</CardTitle>
            <p className="p-1 text-sm text-gray-500 mx-auto">
              Platz 1 ist nur nach Rücksprache mit Schlüssel, die Plätze 2 und 3 sind durchgehend zugänglich
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const booking = bookings.find(
                    (b) => b.start_time <= slot && b.end_time > slot
                )
                const isBooked = !!booking
                const isBlocked = isTimeSlotBlocked(slot)
                const blockReason = getBlockReason()

                return (
                    <BookingSlot
                        key={slot}
                        slot={slot}
                        booking={booking}
                        isBooked={isBooked}
                        isBlocked={isBlocked}
                        blockReason={blockReason}
                        currentUser={currentUser}
                        onBook={handleBooking}
                        onCancel={handleCancelBooking}
                        canCancel={canCancelBooking}
                    />
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
  )
}