import { NextRequest, NextResponse } from 'next/server'
import { cookies as nextCookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Method 1: From request.cookies
    const requestCookie = request.cookies.get('user-id')
    
    // Method 2: From next/headers cookies()
    const headersCookie = nextCookies().get('user-id')
    
    // Method 3: From raw headers
    const rawCookieHeader = request.headers.get('cookie')
    
    // Method 4: Parse manually
    const cookieString = rawCookieHeader || ''
    const userIdMatch = cookieString.match(/user-id=([^;]+)/)
    const manualCookie = userIdMatch ? userIdMatch[1] : null

    const debug = {
      timestamp: new Date().toISOString(),
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent'),
      
      cookies: {
        method1_request: requestCookie ? {
          name: requestCookie.name,
          value: requestCookie.value
        } : null,
        
        method2_headers: headersCookie ? {
          name: headersCookie.name, 
          value: headersCookie.value
        } : null,
        
        method3_raw: rawCookieHeader,
        
        method4_manual: manualCookie,
        
        allRequestCookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
      }
    }

    return NextResponse.json(debug, { status: 200 })
    
  } catch (error) {
    console.error('Debug cookies error:', error)
    return NextResponse.json({ 
      error: 'Debug failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
