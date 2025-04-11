import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { z } from 'zod'

const bookingSchema = z.object({
  courtId: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  type: z.enum(['regular', 'tournament', 'maintenance']).default('regular')
})

// Typdefinitionen
interface Settings {
  openingTime?: string;
  closingTime?: string;
  maintenanceDay?: string;
  maintenanceTime?: string;
  maxSimultaneousBookings?: number;
  advanceBookingPeriod?: string;
}

interface Booking {
  id: number;
  court_id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  type: string;
}

interface DecodedToken {
  userId: number;
  isAdmin?: boolean;
}

interface BookingCount {
  count: number;
}

async function getSettings(): Promise<Settings> {
  const settings = await db.get('SELECT * FROM settings LIMIT 1') as Settings | undefined;
  return settings || {} as Settings;
}

async function isTimeSlotBlocked(courtId: number, date: string, startTime: string): Promise<boolean> {
  // Überprüfe Court Blocks
  const blockExists = await db.get(
      `SELECT 1 FROM court_blocks
       WHERE court_id = ?
         AND ? BETWEEN start_date AND end_date`,
      [courtId, date]
  )

  if (blockExists) return true

  // Überprüfe Wartungszeiten
  const settings = await getSettings()
  if (settings.maintenanceDay && settings.maintenanceTime) {
    const bookingDate = new Date(date)
    const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

    if (dayOfWeek === settings.maintenanceDay && startTime === settings.maintenanceTime) {
      return true
    }
  }

  // Überprüfe Öffnungszeiten
  if (settings.openingTime && settings.closingTime) {
    if (startTime < settings.openingTime || startTime >= settings.closingTime) {
      return true
    }
  }

  return false
}

async function validateBooking(userId: number, date: string, settings: Settings): Promise<void> {
  // Überprüfe maximale gleichzeitige Buchungen
  if (settings.maxSimultaneousBookings) {
    const activeBookings = await db.get<BookingCount>(
        `SELECT COUNT(*) as count FROM bookings
         WHERE user_id = ?
           AND date >= date('now')
           AND type = 'regular'`,
        [userId]
    )

    if (activeBookings && activeBookings.count >= settings.maxSimultaneousBookings) {
      throw new Error('Maximale Anzahl gleichzeitiger Buchungen erreicht')
    }
  }

  // Überprüfe Vorausbuchungszeitraum
  if (settings.advanceBookingPeriod) {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + parseInt(settings.advanceBookingPeriod))
    const bookingDate = new Date(date)

    if (bookingDate > maxDate) {
      throw new Error(`Buchungen sind nur ${settings.advanceBookingPeriod} Tage im Voraus möglich`)
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courtId = searchParams.get('courtId')
    const date = searchParams.get('date')

    if (!courtId || !date) {
      return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
          { error: 'Du bist nicht eingeloggt!' },
          { status: 401 }
      )
    }

    try {
      // Verifiziere das Token, ohne die Variable zu speichern wenn wir sie nicht verwenden
      verify(token, process.env.JWT_SECRET!)

      // Join with users table to get user names
      const bookings = await db.all(
          `SELECT
             b.*,
             u.name as user_name
           FROM bookings b
                  JOIN users u ON b.user_id = u.id
           WHERE b.court_id = ? AND b.date = ?`,
          [courtId, date]
      )

      // Hole Sperrzeiten und Wartungszeiten
      const blocks = await db.all(
          `SELECT * FROM court_blocks
           WHERE court_id = ?
             AND ? BETWEEN start_date AND end_date`,
          [courtId, date]
      )

      const settings = await getSettings()

      return NextResponse.json({
        bookings,
        blocks,
        settings: {
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          maintenanceDay: settings.maintenanceDay,
          maintenanceTime: settings.maintenanceTime
        }
      })
    } catch (err: unknown) {
      const error = err as Error & { name?: string }
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
            { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
            { status: 401 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('GET booking error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
          { error: 'Du bist nicht eingeloggt!' },
          { status: 401 }
      )
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as DecodedToken
      const body = await request.json()

      const result = bookingSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
            { error: 'Invalid input', details: result.error.flatten() },
            { status: 400 }
        )
      }

      const { courtId, date, startTime, type } = result.data
      const settings = await getSettings()

      // Validiere die Buchung
      try {
        await validateBooking(decoded.userId, date, settings)
      } catch (error: unknown) {
        const err = error as Error
        return NextResponse.json(
            { error: err.message },
            { status: 400 }
        )
      }

      // Überprüfe ob der Zeitslot blockiert ist
      const isBlocked = await isTimeSlotBlocked(courtId, date, startTime)

      // Wenn der Platz gesperrt ist und der Benutzer kein Admin ist, verhindere die Buchung
      if (isBlocked && !decoded.isAdmin) {
        return NextResponse.json(
            { error: 'Dieser Platz ist für den angegebenen Zeitraum gesperrt' },
            { status: 400 }
        )
      }

      // Prüfe, ob das Datum in der Vergangenheit liegt
      const today = new Date()
      const todayDate = today.toLocaleDateString('en-CA')
      const todayTime = today.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric"});
      const bookingDate = new Date(date).toLocaleDateString('en-CA')

      if (bookingDate < todayDate) {
        return NextResponse.json(
            { error: 'Buchungen in der Vergangenheit sind nicht möglich' },
            { status: 400 }
        )
      }

      // Wenn die Buchung für heute ist, prüfe, ob die Startzeit mindestens eine Stunde in der Zukunft liegt
      if (bookingDate === todayDate) {
        // Aktuelle Zeit in Minuten seit Mitternacht
        const [currentHour, currentMinute] = todayTime.split(':').map(Number);
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        // Startzeit der Buchung in Minuten seit Mitternacht
        const [bookingHour, bookingMinute] = startTime.split(':').map(Number);
        const bookingTimeInMinutes = bookingHour * 60 + bookingMinute;

        // Prüfen, ob die Buchung mindestens 60 Minuten in der Zukunft liegt
        if (bookingTimeInMinutes < currentTimeInMinutes + 60) {
          return NextResponse.json(
              { error: 'Buchungen für heute müssen mindestens eine Stunde in der Zukunft liegen' },
              { status: 400 }
          )
        }
      }

      const [hours, minutes] = startTime.split(':')
      const endTimeDate = new Date(0, 0, 0, parseInt(hours) + 1, parseInt(minutes))
      const endTime = endTimeDate.toTimeString().slice(0, 5)

      // Überprüfe auf Überschneidungen
      const existingBooking = await db.get(
          `SELECT * FROM bookings
           WHERE court_id = ?
             AND date = ?
             AND (
               (start_time <= ? AND end_time > ?)
              OR
               (start_time < ? AND end_time >= ?)
             )`,
          [courtId, date, startTime, startTime, endTime, endTime]
      )

      if (existingBooking) {
        return NextResponse.json(
            { error: 'Der Platz ist für diesen Zeitraum bereits gebucht!' },
            { status: 400 }
        )
      }

      // Erstelle die Buchung
      await db.run(
          `INSERT INTO bookings (
            court_id,
            user_id,
            date,
            start_time,
            end_time,
            type
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [courtId, decoded.userId, date, startTime, endTime, type]
      )

      return NextResponse.json({
        success: true,
        message: 'Tennisplatz erfolgreich gebucht'
      })
    } catch (err: unknown) {
      const error = err as Error & { name?: string }
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
            { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
            { status: 401 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('POST booking error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
          { error: 'Missing booking ID' },
          { status: 400 }
      )
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json(
          { error: 'Du bist nicht eingeloggt!' },
          { status: 401 }
      )
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as DecodedToken

      // Get the booking
      const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [bookingId]) as Booking | undefined;

      if (!booking) {
        return NextResponse.json(
            { error: 'Buchung nicht gefunden' },
            { status: 404 }
        )
      }

      // Prüfe, ob die Buchung in der Vergangenheit liegt
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const bookingDate = new Date(booking.date)
      bookingDate.setHours(0, 0, 0, 0)

      if (bookingDate < today) {
        return NextResponse.json(
            { error: 'Buchungen in der Vergangenheit können nicht storniert werden' },
            { status: 400 }
        )
      }

      // Check if user is authorized to delete the booking
      if (!decoded.isAdmin && booking.user_id !== decoded.userId) {
        return NextResponse.json(
            { error: 'Keine Berechtigung zum Löschen dieser Buchung' },
            { status: 403 }
        )
      }

      // Delete the booking
      await db.run('DELETE FROM bookings WHERE id = ?', [bookingId])

      return NextResponse.json({
        success: true,
        message: 'Buchung erfolgreich storniert'
      })
    } catch (err: unknown) {
      const error = err as Error & { name?: string }
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json(
            { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
            { status: 401 }
        )
      }
      throw err
    }
  } catch (error) {
    console.error('DELETE booking error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}