import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for public routes and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/' ||
    pathname === '/request-account' ||
    pathname === '/forgot-password' ||
    pathname === '/set-password' ||
    pathname === '/reset-password' ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }
  
  // Get user ID from session cookie
  const userIdCookie = request.cookies.get('user-id')

  // If user is trying to access the login page and already has a session,
  // validate and redirect them into the app instead of showing login
  if (pathname === '/login') {
    if (!userIdCookie) {
      return NextResponse.next()
    }
    try {
      const validateResponse = await fetch(new URL('/api/validate-session', request.url), {
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        }
      })
      if (!validateResponse.ok) {
        if (validateResponse.status === 401) {
          const resp = NextResponse.next()
          resp.cookies.delete('user-id')
          return resp
        }
        return NextResponse.next()
      }
      const user = await validateResponse.json()
      if (!user.isActive) {
        return NextResponse.redirect(new URL('/inactive', request.url))
      }
      const target = user.role === 'ADMIN' ? '/admin' : '/app'
      return NextResponse.redirect(new URL(target, request.url))
    } catch {
      return NextResponse.next()
    }
  }
  
  if (!userIdCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    // Validate user via API call (Edge Runtime compatible)
    const validateResponse = await fetch(new URL('/api/validate-session', request.url), {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      }
    })
    
    if (!validateResponse.ok) {
      // Only redirect to login if it's actually an authentication error
      // Network errors or temporary issues shouldn't force logout
      if (validateResponse.status === 401) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('user-id')
        return response
      } else {
        // For other errors (500, network issues), let the request continue
        // This prevents unnecessary logouts due to temporary server issues
        console.warn('Session validation failed with non-auth error:', validateResponse.status)
        return NextResponse.next()
      }
    }
    
    const user = await validateResponse.json()
    
    // Optional: redirect to reset password if mustReset is true (but allow access)
    // Users can still access the app even if mustReset is true
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.redirect(new URL('/inactive', request.url))
    }
    
    // Check admin routes
    if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/app/search', request.url))
    }
    
    // Add user info to headers for downstream use
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', user.role)
    
    // Automatically renew session cookie to maintain persistence
    // This extends the session each time the user makes a request
    response.cookies.set('user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    })
    
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // For network errors or other exceptions, allow the request to continue
    // rather than forcing a logout. Only redirect to login if there's no session cookie
    // This prevents disconnections due to temporary network issues
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
