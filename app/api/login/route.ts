import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
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
    
    // Detect HTTPS via proxy headers
    const proto = (request.headers.get('x-forwarded-proto') || 'http').toLowerCase()
    const isHttps = proto === 'https'
    
    console.log('🍪 Setting cookie for host:', request.headers.get('host'))
    console.log('🍪 User ID to set:', user.id)
    console.log('🍪 Protocol detected:', proto, 'isHttps:', isHttps)
    
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
    
    // Set cookie - CLEAN VERSION with only one method
    response.cookies.set({
      name: 'user-id',
      value: String(user.id),
      httpOnly: false, // TEMPORARILY FALSE for debugging
      secure: isHttps, // false in HTTP, true in HTTPS
      sameSite: isHttps ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    
    // Prevent caching of auth response
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    console.log('🍪 Cookie set successfully')
    
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
