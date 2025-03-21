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

    // Hole nur die öffentlichen Buchungsinformationen ohne Nutzernamen
    const bookings = await db.all(
        `SELECT id, court_id, date, start_time, end_time, type 
       FROM bookings 
       WHERE court_id = ? AND date = ?`,
        [courtId, date]
    )

    // Hole Sperrzeiten
    const blocks = await db.all(
        `SELECT * FROM court_blocks 
       WHERE court_id = ? 
       AND ? BETWEEN start_date AND end_date`,
        [courtId, date]
    )

    // Hole Einstellungen
    const settings = await db.get('SELECT openingTime, closingTime, maintenanceDay, maintenanceTime FROM settings LIMIT 1')

    return NextResponse.json({
      bookings,
      blocks,
      settings
    })
  } catch (error) {
    console.error('GET public booking error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}