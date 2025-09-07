import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookie
    const cookieStore = cookies()
    const userIdCookie = cookieStore.get('user-id')
    
    if (!userIdCookie) {
      return NextResponse.json(
        { error: 'No session cookie' },
        { status: 401 }
      )
    }
    
    // Check if user exists and is active
    const user = await db.user.findUnique({
      where: { id: userIdCookie.value },
      select: { 
        id: true, 
        isActive: true, 
        role: true, 
        mustReset: true,
        approvalStatus: true,
        email: true,
        firstName: true,
        lastName: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      mustReset: user.mustReset,
      approvalStatus: user.approvalStatus
    })
    
  } catch (error) {
    console.error('Session validation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
