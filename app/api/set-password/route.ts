import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPassword, hashPassword, validatePasswordStrength } from '@/lib/auth'
import { cookies as nextCookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get user from session - try multiple methods to read cookie
    let userId: string | null = null
    
    // Method 1: From request cookies
    const requestCookie = request.cookies.get('user-id')
    if (requestCookie) {
      userId = requestCookie.value
    }
    
    // Method 2: From next/headers cookies (fallback)
    if (!userId) {
      const headersCookie = nextCookies().get('user-id')
      if (headersCookie) {
        userId = headersCookie.value
      }
    }
    
    // Method 3: Parse raw cookie header (last resort)
    if (!userId) {
      const rawCookieHeader = request.headers.get('cookie')
      if (rawCookieHeader) {
        const userIdMatch = rawCookieHeader.match(/user-id=([^;]+)/)
        if (userIdMatch) {
          userId = userIdMatch[1]
        }
      }
    }
    
    if (!userId) {
      console.error('No user-id cookie found in set-password API')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true,
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

    const body = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

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

    // Update password in database and clear mustReset flag
    await db.user.update({
      where: { id: user.id },
      data: {
        hashedPassword: newHashedPassword,
        mustReset: false // User has now set their own password
      }
    })

    console.log(`✅ First-time password set for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Password set successfully. You can now use the application.'
    })

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
