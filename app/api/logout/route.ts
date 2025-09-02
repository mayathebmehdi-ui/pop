import { NextResponse } from 'next/server'

export async function POST() {
  console.log('🚪 Logout API called')
  
  const response = NextResponse.json({ 
    success: true, 
    message: 'Logged out successfully' 
  })
  
  // Clear session cookie - SAME CONFIG as login for consistency
  response.cookies.set('user-id', '', {
    httpOnly: false, // Same as login for consistency
    secure: false, // FALSE en HTTP
    sameSite: 'lax',
    expires: new Date(0), // Expire immediately
    path: '/',
  })
  
  console.log('✅ Session cookie cleared')
  return response
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

