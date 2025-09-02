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
    console.log('🔐 Attempting login for email:', email.toLowerCase())
    const user = await authenticateUser(email, password)
    
    if (!user) {
      console.log('❌ Authentication failed for:', email.toLowerCase())
      console.log('❌ Either user not found or password incorrect')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }
    
    console.log('✅ User authenticated successfully:', user.email, 'Role:', user.role)
    
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
    
    // Set cookie - OPTIMIZED for HTTP on IP address
    response.cookies.set({
      name: 'user-id',
      value: String(user.id),
      httpOnly: false, // FALSE pour debug - remettre true une fois que ça marche
      secure: false, // TOUJOURS FALSE en HTTP (même si proxy HTTPS)
      sameSite: 'lax', // LAX fonctionne mieux que 'none' en HTTP
      path: '/',
      // PAS de domain pour les adresses IP
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
