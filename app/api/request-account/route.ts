import { NextRequest, NextResponse } from 'next/server'
import { createUserWithTempPassword, generateTemporaryPassword } from '@/lib/auth'
import { sendTempPasswordEmail, sendAdminAccountRequestEmail } from '@/lib/mailer'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { company, email, useCase, expectedVolume, message } = body
    
    if (!company || !email || !useCase || !expectedVolume) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const normalizedEmail = String(email).trim().toLowerCase()
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Log the request (in production, this would be sent to your CRM/notification system)
    console.log('=== NEW ACCOUNT REQUEST ===')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Company:', company)
    console.log('Email:', normalizedEmail)
    console.log('Use Case:', useCase)
    console.log('Expected Volume:', expectedVolume)
    console.log('Message:', message || 'No additional message')
    console.log('IP Address:', request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown')
    console.log('User Agent:', request.headers.get('user-agent') || 'Unknown')
    console.log('===========================')
    
    // Prevent duplicate accounts (unique email)
    const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json(
        { error: 'Account is already created with this email' },
        { status: 409 }
      )
    }

    // Create user with a temporary password and send email via SMTP
    let userCreated = false
    let tempPasswordUsed = ''

    try {
      console.log('🔧 Creating user with temp password for:', normalizedEmail)
      const { user, tempPassword } = await createUserWithTempPassword({ email: normalizedEmail })
      tempPasswordUsed = tempPassword

      console.log('✅ User created in DB:', user.id)
      console.log('🔑 Temp password generated:', tempPassword)

      // Try to send email with timeout, but don't fail account creation if email fails
      try {
        await Promise.race([
          sendTempPasswordEmail(user.email, tempPassword),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email timeout')), 10000)
          )
        ])
        console.log('✅ Temp password email sent to:', user.email)
      } catch (emailErr) {
        console.error('⚠️ Email sending failed, but account created:', emailErr)
        // Don't fail the whole process if email fails
      }
      userCreated = true
    } catch (err) {
      console.error('❌ Failed to create user in DB:', err)
      return NextResponse.json(
        { error: 'Failed to create account. Please try again or contact support.' },
        { status: 500 }
      )
    }
    
    if (!userCreated) {
      console.error('💥 CRITICAL: No user was created!')
      return NextResponse.json(
        { error: 'Account creation failed. Please contact support.' },
        { status: 500 }
      )
    }
    
    // Notify admin about the new account request (with details) - fire-and-forget
    ;(async () => {
      try {
        await Promise.race([
          sendAdminAccountRequestEmail({
            company,
            email: normalizedEmail,
            useCase,
            expectedVolume,
            message,
            userId: (await db.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }))?.id || null,
            ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
            userAgent: request.headers.get('user-agent') || null,
            createdAt: new Date().toISOString(),
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Admin email timeout')), 8000)),
        ])
        console.log('✅ Admin notification for account request sent')
      } catch (notifyErr) {
        console.error('❌ Failed to notify admin about account request:', notifyErr)
      }
    })()

    // Small delay for UX consistency
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json(
      { 
        ok: true, 
        message: 'Account request submitted successfully',
        submittedAt: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing account request:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

