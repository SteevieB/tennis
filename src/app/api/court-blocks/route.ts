import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Schema für die Validierung der Platzsperrungen
const courtBlockSchema = z.object({
  courtId: z.number().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(3).max(100)
})

interface TokenPayload {
  userId: number;
  isAdmin: boolean;
}

// GET: Hole alle Platzsperren
export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload
      if (!decoded.isAdmin) {
        return NextResponse.json({ error: 'Nur Administratoren können Platzsperren verwalten' }, { status: 403 })
      }

      // Alle Platzsperren holen
      const blocks = await db.all('SELECT * FROM court_blocks ORDER BY start_date DESC')
      return NextResponse.json(blocks)
    } catch (error) {
      return NextResponse.json({ error: 'Ungültiges Token' }, { status: 401 })
    }
  } catch (error) {
    console.error('GET court blocks error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}

// POST: Erstelle eine neue Platzsperre
export async function POST(request: Request) {
  try {
    const token = (await cookies()).get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload
      if (!decoded.isAdmin) {
        return NextResponse.json({ error: 'Nur Administratoren können Platzsperren hinzufügen' }, { status: 403 })
      }

      const body = await request.json()

      // Validiere die Daten
      const result = courtBlockSchema.safeParse(body)
      if (!result.success) {
        return NextResponse.json(
            { error: 'Ungültige Daten', details: result.error.flatten() },
            { status: 400 }
        )
      }

      const { courtId, startDate, endDate, reason } = result.data

      // Prüfe, ob das Startdatum vor dem Enddatum liegt
      if (new Date(startDate) > new Date(endDate)) {
        return NextResponse.json(
            { error: 'Das Startdatum muss vor dem Enddatum liegen' },
            { status: 400 }
        )
      }

      // Erstelle die Platzsperre
      const result2 = await db.run(
          `INSERT INTO court_blocks (court_id, start_date, end_date, reason) 
         VALUES (?, ?, ?, ?)`,
          [courtId, startDate, endDate, reason]
      )

      // Wenn kein lastID existiert, konnte der Insert fehlgeschlagen sein
      if (!result2.lastID) {
        throw new Error('Fehler beim Erstellen der Platzsperre')
      }

      // Hole die erstellte Platzsperre
      const createdBlock = await db.get(
          'SELECT * FROM court_blocks WHERE id = ?',
          [result2.lastID]
      )

      return NextResponse.json({
        success: true,
        message: 'Platzsperre erfolgreich erstellt',
        block: createdBlock
      })
    } catch (error) {
      const tokenError = error as Error & { name?: string };
      if (tokenError.name === 'TokenExpiredError') {
        return NextResponse.json(
            { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
            { status: 401 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('POST court block error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}

// DELETE: Lösche eine Platzsperre
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const blockId = searchParams.get('id')

    if (!blockId) {
      return NextResponse.json(
          { error: 'Block-ID fehlt' },
          { status: 400 }
      )
    }

    const token = (await cookies()).get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload
      if (!decoded.isAdmin) {
        return NextResponse.json({ error: 'Nur Administratoren können Platzsperren löschen' }, { status: 403 })
      }

      // Prüfe, ob die Platzsperre existiert
      const block = await db.get('SELECT 1 FROM court_blocks WHERE id = ?', [blockId])
      if (!block) {
        return NextResponse.json(
            { error: 'Platzsperre nicht gefunden' },
            { status: 404 }
        )
      }

      // Lösche die Platzsperre
      await db.run('DELETE FROM court_blocks WHERE id = ?', [blockId])

      return NextResponse.json({
        success: true,
        message: 'Platzsperre erfolgreich gelöscht'
      })
    } catch (error) {
      const tokenError = error as Error & { name?: string };
      if (tokenError.name === 'TokenExpiredError') {
        return NextResponse.json(
            { error: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.' },
            { status: 401 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('DELETE court block error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}