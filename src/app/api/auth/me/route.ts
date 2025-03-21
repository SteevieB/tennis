// src/app/api/auth/me/route.ts
import {NextResponse} from "next/server";
import {db} from "@/lib/db";
import {verify, TokenExpiredError, JsonWebTokenError} from "jsonwebtoken";
import {cookies} from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET!) as { userId: number; isAdmin: boolean }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return NextResponse.json({ error: 'Token expired' }, { status: 401 })
      }
      if (err instanceof JsonWebTokenError) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }
      throw err; // Andere unerwartete Fehler weiterwerfen
    }

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