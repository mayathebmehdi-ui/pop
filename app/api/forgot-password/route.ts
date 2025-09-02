import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateTemporaryPassword, hashPassword } from '@/lib/auth'
import { sendTempPasswordEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true, 
        firstName: true,
        isActive: true 
      }
    })

    // Always return success for security (don't reveal if email exists)
    // But only send email if user exists and is active
    if (user && user.isActive) {
      try {
        // Generate new temporary password
        const tempPassword = generateTemporaryPassword()
        const hashedPassword = await hashPassword(tempPassword)

        // Update user with new temporary password
        await db.user.update({
          where: { id: user.id },
          data: {
            hashedPassword,
            mustReset: true // Force reset after using temp password
          }
        })

        // Send email with temporary password
        await sendTempPasswordEmail(user.email, tempPassword, user.firstName || undefined)
        console.log(`✅ Temporary password sent to: ${user.email}`)
      } catch (error) {
        console.error('❌ Failed to reset password for:', email, error)
      }
    } else {
      console.log(`⚠️ Password reset requested for non-existent/inactive email: ${email}`)
    }

    // Always return success message for security
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a temporary password has been sent.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
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
