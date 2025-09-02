import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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
    const user = await db.user.findUnique({
      where: { id: userIdCookie.value },
      select: { id: true, role: true, isActive: true }
    })

    if (!user || !user.isActive || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all users
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        mustReset: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      users: users
    })

  } catch (error) {
    console.error('Admin users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
