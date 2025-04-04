'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Home, CircleDot } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import BookingSlot from "@/components/BookingSlot"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Booking, User } from '@/types';

const courts = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
]

const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = i + 8
  return `${hour.toString().padStart(2, '0')}:00`
})

export default function BookingsPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedCourt, setSelectedCourt] = useState(courts[0])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()


  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchBookings = useCallback(async () => {
    try {
      const formattedDate = selectedDate.toLocaleDateString('en-CA');
      console.log("Fetching bookings for date:", formattedDate); // Logging zur Fehlersuche

      const endpoint = currentUser
          ? `/api/bookings?courtId=${selectedCourt.id}&date=${formattedDate}`
          : `/api/public/bookings?courtId=${selectedCourt.id}&date=${formattedDate}`

      console.log("API endpoint:", endpoint); // Logging zur Fehlersuche

      const response = await fetch(endpoint)

      if (response.ok) {
        const data = await response.json()
        console.log("Received booking data:", data); // Logging zur Fehlersuche
        setBookings(data.bookings || [])
        // setSettings(data.settings || null) - auskommentiert, da settings aktuell nicht genutzt wird
      } else {
        setBookings([])
        // setSettings(null)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
      // setSettings(null)
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
      const formattedDate = selectedDate.toLocaleDateString('en-CA'); // Gibt YYYY-MM-DD zurück
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
          description: `Platz ${selectedCourt.id} wurde für ${formattedDate} um ${startTime} Uhr gebucht.`,
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
                <div className="col-span-1"></div>
                {courts.map((court) => (
                    <Button
                        key={court.id}
                        variant={selectedCourt.id === court.id ? "default" : "outline"}
                        className="h-24"
                        onClick={() => setSelectedCourt(court)}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <CircleDot className="w-8 h-8" />
                        <span className="font-medium">Platz {court.name}</span>
                      </div>
                    </Button>
                ))}
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const booking = bookings.find(
                    (b) => b.start_time <= slot && b.end_time > slot
                )
                const isBooked = !!booking

                return (
                    <BookingSlot
                        key={slot}
                        slot={slot}
                        booking={booking}
                        isBooked={isBooked}
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