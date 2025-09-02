import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Authenticate user
    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Account not activated. Please contact an administrator.' },
        { status: 403 }
      )
    }
    
    // Set session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mustReset: user.mustReset
      }
    })
    
    // Set HTTP-only cookie for session (30 days for better persistence)
    // Use secure=true only when NEXT_PUBLIC_APP_URL starts with https
    const reqHost = request.headers.get('host') || ''
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (reqHost ? `http://${reqHost}` : '')
    const isHttps = appUrl.startsWith('https://') || request.nextUrl.protocol === 'https:'
    response.cookies.set('user-id', user.id, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
