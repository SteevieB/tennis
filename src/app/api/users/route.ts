import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { hash } from 'bcrypt'

export async function GET() {
  const users = await db.all('SELECT id, email, name, is_admin, is_active FROM users')
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const token = (await cookies()).get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, name, password, isAdmin } = await request.json()
    const passwordHash = await hash(password, 10)

    await db.run(
      'INSERT INTO users (email, name, password_hash, is_admin, is_active) VALUES (?, ?, ?, ?, ?)',
      [email, name, passwordHash, isAdmin, true]
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

export async function PUT(request: Request) {
  const token = (await cookies()).get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, email, name, isAdmin, isActive } = await request.json()

    await db.run(
      'UPDATE users SET email = ?, name = ?, is_admin = ?, is_active = ? WHERE id = ?',
      [email, name, isAdmin, isActive, id]
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

