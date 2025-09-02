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
    const host = request.headers.get('host') || ''
    console.log('🍪 Setting cookie for host:', host)
    console.log('🍪 User ID to set:', user.id)
    
    // Set cookie with explicit domain for IP addresses
    const cookieOptions = {
      httpOnly: false, // TEMPORARILY FALSE for debugging - allows JS access
      secure: false, // Always false for HTTP on EC2
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      // For IP addresses, don't set domain at all
    }
    
    response.cookies.set('user-id', user.id, cookieOptions)
    
    // Also try setting via Set-Cookie header directly as fallback
    const cookieValue = `user-id=${user.id}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
    response.headers.append('Set-Cookie', cookieValue)
    
    console.log('🍪 Cookie set in response with options:', cookieOptions)
    console.log('🍪 Also set via Set-Cookie header:', cookieValue)
    
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
