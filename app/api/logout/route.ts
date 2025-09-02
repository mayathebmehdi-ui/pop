import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  // Clear session cookie
  response.cookies.set('user-id', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  })
  return response
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

