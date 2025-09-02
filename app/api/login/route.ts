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
    // Configure for EC2 IP address and HTTP - CRITICAL SETTINGS
    console.log('🍪 Setting cookie for host:', request.headers.get('host'))
    console.log('🍪 User ID to set:', user.id)
    
    response.cookies.set('user-id', user.id, {
      httpOnly: false, // TEMPORARILY FALSE for debugging - allows JS access
      secure: false, // Always false for HTTP on EC2
      sameSite: 'lax',
      path: '/',
      // NO domain restriction for IP addresses
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
    console.log('🍪 Cookie set in response')
    
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
