import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Schema für die Validierung der Einstellungen
const settingsSchema = z.object({
  maxBookingDuration: z.number().min(30).max(240).optional(),
  advanceBookingPeriod: z.number().min(1).max(365).optional(),
  maxSimultaneousBookings: z.number().min(1).max(10).optional(),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  maintenanceDay: z.enum([
    'monday', 'tuesday', 'wednesday', 'thursday',
    'friday', 'saturday', 'sunday'
  ]).optional(),
  maintenanceTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  autoCleanupDays: z.number().min(1).max(365).optional()
})

export async function GET() {
  try {
    // Hole die aktuellen Einstellungen
    const settings = await db.get('SELECT * FROM settings LIMIT 1')

    if (!settings) {
      // Wenn keine Einstellungen existieren, erstelle Standardeinstellungen
      const defaultSettings = {
        maxBookingDuration: 60,
        advanceBookingPeriod: 14,
        maxSimultaneousBookings: 3,
        openingTime: '08:00',
        closingTime: '22:00',
        maintenanceDay: 'monday',
        maintenanceTime: '06:00',
        autoCleanupDays: 7
      }

      await db.run(`
        INSERT INTO settings (
          maxBookingDuration,
          advanceBookingPeriod,
          maxSimultaneousBookings,
          openingTime,
          closingTime,
          maintenanceDay,
          maintenanceTime,
          autoCleanupDays
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        defaultSettings.maxBookingDuration,
        defaultSettings.advanceBookingPeriod,
        defaultSettings.maxSimultaneousBookings,
        defaultSettings.openingTime,
        defaultSettings.closingTime,
        defaultSettings.maintenanceDay,
        defaultSettings.maintenanceTime,
        defaultSettings.autoCleanupDays
      ])

      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value
  if (!token) {
    return NextResponse.json(
        { error: 'Du bist nicht eingeloggt!' },
        { status: 401 }
    )
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }
    if (!decoded.isAdmin) {
      return NextResponse.json(
          { error: 'Nur Administratoren können Einstellungen ändern.' },
          { status: 403 }
      )
    }

    const data = await request.json()

    // Validiere die Einstellungen
    const result = settingsSchema.safeParse(data)
    if (!result.success) {
      return NextResponse.json(
          {
            error: 'Ungültige Einstellungen',
            details: result.error.flatten()
          },
          { status: 400 }
      )
    }

    const settings = result.data

    // Überprüfe zusätzliche Geschäftsregeln
    if (settings.openingTime && settings.closingTime &&
        settings.openingTime >= settings.closingTime) {
      return NextResponse.json(
          { error: 'Die Öffnungszeit muss vor der Schließzeit liegen.' },
          { status: 400 }
      )
    }

    // Aktualisiere die Einstellungen
    const existingSettings = await db.get('SELECT 1 FROM settings LIMIT 1')

    if (existingSettings) {
      // Update existing settings
      const updateColumns = Object.keys(settings)
          .map(key => `${key} = ?`)
          .join(', ')

      await db.run(
          `UPDATE settings SET ${updateColumns}`,
          Object.values(settings)
      )
    } else {
      // Insert new settings
      const columns = Object.keys(settings).join(', ')
      const placeholders = Object.keys(settings).map(() => '?').join(', ')

      await db.run(
          `INSERT INTO settings (${columns}) VALUES (${placeholders})`,
          Object.values(settings)
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Einstellungen erfolgreich aktualisiert'
    })
  } catch (error) {
    if ((error as any).name === 'TokenExpiredError') {
      return NextResponse.json(
          { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
          { status: 401 }
      )
    }

    console.error('Error updating settings:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}