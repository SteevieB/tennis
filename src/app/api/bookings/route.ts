// src/app/api/bookings/route.ts
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
      return NextResponse.json({ error: 'Du bist nicht eingeloggt!' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number; isAdmin: boolean }

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

      return NextResponse.json(bookings)
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
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
      return NextResponse.json({ error: 'Du bist nicht eingeloggt!' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number }
      const body = await request.json()

      const result = bookingSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
            { error: 'Invalid input', details: result.error.flatten() },
            { status: 400 }
        )
      }

      const { courtId, date, startTime, type } = result.data

      const [hours, minutes] = startTime.split(':')
      const endTimeDate = new Date(0, 0, 0, parseInt(hours), parseInt(minutes) + 30)
      const endTime = endTimeDate.toTimeString().slice(0, 5)

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
            { error: 'Der Platz ist schon belegt!' },
            { status: 400 }
        )
      }

      await db.run(
          `INSERT INTO bookings (
            court_id,
            user_id,
            date,
            start_time,
            end_time
          ) VALUES (?, ?, ?, ?, ?)`,
          [courtId, decoded.userId, date, startTime, endTime]
      )

      return NextResponse.json({
        success: true,
        message: 'Tennisplatz erfolgreich gebucht'
      })
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
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
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Du bist nicht eingeloggt!' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number; isAdmin: boolean }

      // Get the booking
      const booking = await db.get('SELECT * FROM bookings WHERE id = ?', [bookingId])

      if (!booking) {
        return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })
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
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
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