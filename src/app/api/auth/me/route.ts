// src/app/api/auth/me/route.ts
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {verify} from "jsonwebtoken";
import {cookies} from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number; isAdmin: boolean }

    const user = await db.get(
        'SELECT id, name, is_admin as isAdmin FROM users WHERE id = ?',
        [decoded.userId]
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('GET user error:', error)
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    )
  }
}