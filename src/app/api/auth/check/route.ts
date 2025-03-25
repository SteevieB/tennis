// /src/app/api/auth/check/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
      return NextResponse.json({ error: 'No token found' }, { status: 401 })
    }

    verify(token.value, process.env.JWT_SECRET!)
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}