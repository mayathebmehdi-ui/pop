import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.redirect(new URL('/login', request.url))
    
    // Delete the user-id cookie
    response.cookies.delete('user-id')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url))
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
