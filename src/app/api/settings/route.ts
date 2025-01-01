import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export async function GET() {
  const settings = await db.all('SELECT * FROM settings')
  const formattedSettings = settings.reduce((acc: any, setting: any) => {
    acc[setting.key] = setting.value
    return acc
  }, {})
  return NextResponse.json(formattedSettings)
}

export async function POST(request: Request) {
  const token = cookies().get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: number, isAdmin: boolean }
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()
    const updatePromises = Object.entries(settings).map(([key, value]) =>
      db.run(
        'INSERT OR REPLACE INTO settings (key, value, updated_at, updated_by) VALUES (?, ?, datetime("now"), ?)',
        [key, value, decoded.userId]
      )
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

