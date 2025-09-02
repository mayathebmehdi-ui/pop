import { NextRequest, NextResponse } from 'next/server'
import { createUserWithTempPassword, generateTemporaryPassword } from '@/lib/auth'
import { sendTempPasswordEmail } from '@/lib/mailer'

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
    
    // Create user with a temporary password and send email via SMTP
    try {
      const { user, tempPassword } = await createUserWithTempPassword({ email: normalizedEmail })
      await sendTempPasswordEmail(user.email, tempPassword)
      console.log('✅ Temp password email queued/sent to:', user.email)
    } catch (err) {
      console.error('❌ Failed to create user in DB:', err)
      // Fallback: still email a temporary password even if DB is unavailable
      try {
        const tempPassword = generateTemporaryPassword()
        await sendTempPasswordEmail(normalizedEmail, tempPassword)
        console.log('✅ Temp password emailed without DB user creation (fallback).')
      } catch (mailErr) {
        console.error('❌ Failed to send fallback email:', mailErr)
      }
    }
    
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

