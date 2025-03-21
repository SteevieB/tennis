import { NextResponse } from 'next/server'
import { hash } from 'bcrypt'
import { db } from '@/lib/db'
import { z } from 'zod'

// Schema für die Validierung der Registrierungsdaten
const registerSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Passwort muss mindestens 6 Zeichen haben')
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validiere die Eingabedaten
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
          { error: 'Ungültige Eingabedaten', details: result.error.flatten() },
          { status: 400 }
      )
    }

    const { name, email, password } = result.data

    // Prüfe, ob die E-Mail bereits existiert
    const existingUser = await db.get('SELECT 1 FROM users WHERE email = ?', [email])
    if (existingUser) {
      return NextResponse.json(
          { error: 'Diese E-Mail ist bereits registriert' },
          { status: 409 }
      )
    }

    // Passwort hashen
    const passwordHash = await hash(password, 10)

    // Neuen Benutzer erstellen (inaktiv bis zur Admin-Freischaltung)
    await db.run(
        'INSERT INTO users (name, email, password_hash, is_admin, is_active) VALUES (?, ?, ?, ?, ?)',
        [name, email, passwordHash, false, false]
    )

    return NextResponse.json({
      success: true,
      message: 'Registrierung erfolgreich. Warte auf Freischaltung durch einen Administrator.'
    })
  } catch (error) {
    console.error('Registrierungsfehler:', error)
    return NextResponse.json(
        { error: 'Interner Serverfehler bei der Registrierung' },
        { status: 500 }
    )
  }
}