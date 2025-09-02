import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing cookie on host:', request.headers.get('host'))
    
    // Read existing test cookie
    const existingCookie = request.cookies.get('test-cookie')
    console.log('🧪 Existing test-cookie:', existingCookie)
    
    // Create response with a test cookie
    const response = NextResponse.json({
      message: 'Cookie test',
      host: request.headers.get('host'),
      existingCookie: existingCookie ? existingCookie.value : null,
      timestamp: new Date().toISOString()
    })
    
    // Set a simple test cookie
    response.cookies.set('test-cookie', 'test-value-' + Date.now(), {
      httpOnly: false, // Allow JS access for testing
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 // 1 hour
    })
    
    console.log('🧪 Test cookie set')
    
    return response
    
  } catch (error) {
    console.error('Test cookie error:', error)
    return NextResponse.json({ error: 'Test failed' }, { status: 500 })
  }
}
