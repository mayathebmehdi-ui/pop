import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateTemporaryPassword, hashPassword } from '@/lib/auth'
import { sendTempPasswordEmail } from '@/lib/mailer'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get user from session
    const cookieStore = cookies()
    const userIdCookie = cookieStore.get('user-id')
    
    if (!userIdCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate user is admin
    const adminUser = await db.user.findUnique({
      where: { id: userIdCookie.value },
      select: { id: true, role: true, isActive: true }
    })

    if (!adminUser || !adminUser.isActive || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        firstName: true,
        lastName: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new temporary password
    const tempPassword = generateTemporaryPassword()
    const hashedPassword = await hashPassword(tempPassword)

    // Update user with new temporary password
    await db.user.update({
      where: { id: targetUser.id },
      data: {
        hashedPassword,
        mustReset: true
      }
    })

    // Send email with temporary password
    try {
      await sendTempPasswordEmail(targetUser.email, tempPassword, targetUser.firstName || undefined)
      console.log(`✅ Temporary password sent to: ${targetUser.email}`)
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      // Continue even if email fails - password is still updated
      console.log(`🔑 Temporary password for ${targetUser.email}: ${tempPassword}`)
    }

    return NextResponse.json({
      success: true,
      message: `Temporary password sent to ${targetUser.email}`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        mustReset: true
      }
    })

  } catch (error) {
    console.error('Resend password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
