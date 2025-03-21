// src/app/api/public/bookings/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

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

    // Join mit Nutzertabelle, aber gebe keine Nutzernamen zurück
    const bookings = await db.all(
        `SELECT
           b.id, b.court_id, b.date, b.start_time, b.end_time, b.type
         FROM bookings b
         WHERE b.court_id = ? AND b.date = ?`,
        [courtId, date]
    )

    // Hole Sperrzeiten
    const blocks = await db.all(
        `SELECT * FROM court_blocks
         WHERE court_id = ?
           AND ? BETWEEN start_date AND end_date`,
        [courtId, date]
    )

    const settings = await db.get('SELECT * FROM settings LIMIT 1')

    return NextResponse.json({
      bookings,
      blocks,
      settings: {
        openingTime: settings?.openingTime,
        closingTime: settings?.closingTime,
        maintenanceDay: settings?.maintenanceDay,
        maintenanceTime: settings?.maintenanceTime
      }
    })
  } catch (error) {
    console.error('GET public booking error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}