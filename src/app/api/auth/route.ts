// /src/app/api/auth/route.ts
import { NextResponse } from 'next/server'
// @ts-expect-error
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.is_active) {
      return NextResponse.json({
        error: 'Dein Account wurde noch nicht aktiviert. Bitte warte auf die Freischaltung durch einen Administrator.'
      }, { status: 403 })
    }

    const passwordMatch = await compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = sign(
        { userId: user.id, email: user.email, isAdmin: user.is_admin },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    );

    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}