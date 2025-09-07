import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, hashPassword, validatePasswordStrength, authenticateUser } from '@/lib/auth'
import { cookies as nextCookies } from 'next/headers'
import { sendAdminNotificationEmail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // DETAILED LOGGING FOR DEBUGGING
    console.log('=== SET-PASSWORD API DEBUG ===')
    console.log('Host:', request.headers.get('host'))
    console.log('User-Agent:', request.headers.get('user-agent'))
    console.log('Origin:', request.headers.get('origin'))
    console.log('Referer:', request.headers.get('referer'))
    
    // Get user from session - try multiple methods to read cookie
    let userId: string | null = null
    
    // Method 1: From request cookies
    const requestCookie = request.cookies.get('user-id')
    console.log('Method 1 - request.cookies.get("user-id"):', requestCookie)
    if (requestCookie) {
      userId = requestCookie.value
      console.log('✅ Found userId via Method 1:', userId)
    }
    
    // Method 2: From next/headers cookies (fallback)
    if (!userId) {
      const headersCookie = nextCookies().get('user-id')
      console.log('Method 2 - nextCookies().get("user-id"):', headersCookie)
      if (headersCookie) {
        userId = headersCookie.value
        console.log('✅ Found userId via Method 2:', userId)
      }
    }
    
    // Method 3: Parse raw cookie header (last resort)
    if (!userId) {
      const rawCookieHeader = request.headers.get('cookie')
      console.log('Method 3 - Raw cookie header:', rawCookieHeader)
      if (rawCookieHeader) {
        const userIdMatch = rawCookieHeader.match(/user-id=([^;]+)/)
        console.log('Method 3 - Regex match result:', userIdMatch)
        if (userIdMatch) {
          userId = userIdMatch[1]
          console.log('✅ Found userId via Method 3:', userId)
        }
      }
    }
    
    // Log all request cookies for debugging
    const allCookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
    console.log('All request cookies:', allCookies)
    
    // Read body for both cookie and fallback scenarios
    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body
    
    // Fallback: if no cookie, try email from query param + current password to authenticate
    let identifiedUserId = userId
    if (!identifiedUserId && currentPassword) {
      // Try to get email from URL params or body
      const url = new URL(request.url)
      const emailFromQuery = url.searchParams.get('email') || body.email
      
      if (emailFromQuery) {
        try {
          console.log('🔄 Attempting fallback auth with email:', emailFromQuery)
          const maybe = await authenticateUser(String(emailFromQuery), String(currentPassword))
          if (maybe && maybe.mustReset) {
            identifiedUserId = maybe.id
            console.log('✅ Identified user via email+currentPassword fallback:', identifiedUserId)
          } else if (maybe) {
            console.log('⚠️ User found but mustReset=false, rejecting fallback')
          }
        } catch (e) {
          console.log('❌ Fallback auth failed:', e)
        }
      }
    }
    
    if (!identifiedUserId) {
      console.error('❌ No user identified (no cookie, no fallback).')
      console.log('=== END DEBUG ===')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    console.log('✅ Final userId found:', userId)
    console.log('=== END DEBUG ===')

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: identifiedUserId },
      select: { 
        id: true, 
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        hashedPassword: true,
        isActive: true,
        mustReset: true
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // This endpoint is only for users who must reset their password
    if (!user.mustReset) {
      return NextResponse.json(
        { error: 'Password change not required' },
        { status: 400 }
      )
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'Current password, new password and confirmation are required' },
        { status: 400 }
      )
    }

    // Verify passwords match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New password and confirmation do not match' },
        { status: 400 }
      )
    }

    // Validate current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.hashedPassword)
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Validate new password strength (12+ chars, maj, min, chiffre, symbole)
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          details: passwordValidation.errors
        },
        { status: 400 }
      )
    }

    // Ensure new password is different from current
    const isSamePassword = await verifyPassword(newPassword, user.hashedPassword)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const newHashedPassword = await hashPassword(newPassword)

    // Update password in database, clear mustReset flag, and set pending approval
    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: newHashedPassword,
        mustReset: false, // User has now set their own password
        // approvalStatus: 'PENDING_APPROVAL' // TODO: Enable after DB migration
      }
    })

    console.log(`✅ First-time password set for user: ${user.email}`)

    // Send notification email to admin
    try {
      await sendAdminNotificationEmail({
        userEmail: user.email,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        userId: user.id
      })
      console.log(`📧 Admin notification email sent for user: ${user.email}`)
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError)
      // Don't fail the request if email fails
    }

    // Create response with user info for auto-login
    const response = NextResponse.json({
      success: true,
      message: 'Password set successfully. You can now use the application.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mustReset: false // Password has been reset
      }
    })

    // Set session cookie to keep user logged in
    response.cookies.set({
      name: 'user-id',
      value: String(user.id),
      httpOnly: false, // FALSE temporairement pour debug
      secure: false, // FALSE en HTTP
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    console.log('🍪 Session cookie set after password change')

    return response

  } catch (error) {
    console.error('Set password error:', error)
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
