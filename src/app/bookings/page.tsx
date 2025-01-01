// src/app/bookings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, CircleDot, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: number
  user_id: number
  user_name: string
  start_time: string
  end_time: string
  type: 'regular' | 'tournament' | 'maintenance'
}

interface User {
  id: number
  isAdmin: boolean
}

const courts = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
]

const timeSlots = Array.from({ length: 28 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const minute = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minute}`
})

export default function BookingsPage() {
  const [selectedCourt, setSelectedCourt] = useState(courts[0])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchCurrentUser()
    fetchBookings()
  }, [selectedCourt, selectedDate])

  const fetchCurrentUser = async () => {
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      const data = await response.json()
      setCurrentUser(data)
    }
  }

  const fetchBookings = async () => {
    const response = await fetch(`/api/bookings?courtId=${selectedCourt.id}&date=${selectedDate}`)
    if (response.ok) {
      const data = await response.json()
      setBookings(data)
    }
  }

  const handleBooking = async (startTime: string) => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courtId: selectedCourt.id,
        date: selectedDate,
        startTime,
      }),
    })

    if (response.ok) {
      toast({
        title: "Buchung erfolgreich!",
        description: `Platz ${selectedCourt.id} wurde für ${selectedDate} um ${startTime} Uhr gebucht.`,
        variant: "success"
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
  }

  const handleCancelBooking = async (bookingId: number) => {
    const response = await fetch(`/api/bookings?id=${bookingId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      toast({
        title: "Stornierung erfolgreich",
        description: "Die Buchung wurde erfolgreich storniert.",
        variant: "success"
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
  }

  const canCancelBooking = (booking: Booking) => {
    return currentUser?.isAdmin || booking.user_id === currentUser?.id
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Tennisplatzbuchung</h1>
        <div className="flex flex-col gap-8">
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="col-span-2">
                <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex flex-col items-center space-y-2">
                    <Home className="w-8 h-8 text-gray-600" />
                    <span className="text-gray-600 font-medium">Tennisheim</span>
                  </div>
                </div>
              </div>

              {/* Leere Zelle */}
              <div className=""></div>

              {/* Court 1 */}
              <button
                  className={`h-24 rounded-lg shadow-md transition-all ${
                      selectedCourt.id === 1
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedCourt(courts[0])}
              >
                <div className="flex flex-col items-center space-y-2">
                  <CircleDot className={`w-8 h-8 ${selectedCourt.id === 1 ? 'text-white' : 'text-blue-500'}`} />
                  <span className="font-medium">Platz 1</span>
                </div>
              </button>

              {/* Court 2 */}
              <button
                  className={`h-24 rounded-lg shadow-md transition-all ${
                      selectedCourt.id === 2
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedCourt(courts[1])}
              >
                <div className="flex flex-col items-center space-y-2">
                  <CircleDot className={`w-8 h-8 ${selectedCourt.id === 2 ? 'text-white' : 'text-blue-500'}`} />
                  <span className="font-medium">Platz 2</span>
                </div>
              </button>

              {/* Court 3 */}
              <button
                  className={`h-24 rounded-lg shadow-md transition-all ${
                      selectedCourt.id === 3
                          ? 'bg-blue-500 text-white'
                          : 'bg-white hover:bg-blue-50'
                  }`}
                  onClick={() => setSelectedCourt(courts[2])}
              >
                <div className="flex flex-col items-center space-y-2">
                  <CircleDot className={`w-8 h-8 ${selectedCourt.id === 3 ? 'text-white' : 'text-blue-500'}`} />
                  <span className="font-medium">Platz 3</span>
                </div>
              </button>
            </div>
          </div>

          <div className="w-full">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Zeitauswahl</h2>
              <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mb-6 p-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const booking = bookings.find(
                      (b) => b.start_time <= slot && b.end_time > slot
                  )
                  const isBooked = !!booking

                  return (
                      <div key={slot} className="relative">
                        <button
                            className={`w-full p-3 rounded-lg font-medium transition-colors ${
                                isBooked
                                    ? 'bg-gray-200 text-gray-700'
                                    : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            onClick={() => !isBooked && handleBooking(slot)}
                            disabled={isBooked}
                        >
                          <div className="flex flex-col">
                            <span>{slot}</span>
                            {isBooked && currentUser?.isAdmin && (
                                <span className="text-sm font-normal">{booking.user_name}</span>
                            )}
                          </div>
                        </button>
                        {isBooked && canCancelBooking(booking) && (
                            <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-300"
                            >
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                        )}
                      </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}