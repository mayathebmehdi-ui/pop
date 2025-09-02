import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Build correct URL using host header instead of request.url
    const host = request.headers.get('host') || '34.216.99.253:3000'
    const protocol = request.nextUrl.protocol === 'https:' ? 'https' : 'http'
    const loginUrl = `${protocol}://${host}/login`
    
    // Clear the session cookie
    const response = NextResponse.redirect(loginUrl)
    
    // Delete the user-id cookie
    response.cookies.delete('user-id')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, redirect to login
    const host = request.headers.get('host') || '34.216.99.253:3000'
    const protocol = request.nextUrl.protocol === 'https:' ? 'https' : 'http'
    const loginUrl = `${protocol}://${host}/login`
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('user-id')
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' })
    
    // Delete the user-id cookie
    response.cookies.delete('user-id')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
