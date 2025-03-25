// /src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    (await cookies()).delete('token')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
        { error: 'Logout failed' },
        { status: 500 }
    )
  }
}