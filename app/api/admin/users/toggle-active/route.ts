import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
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

    const body = await request.json()
    const { userId, isActive } = body

    if (!userId || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid parameters' },
        { status: 400 }
      )
    }

    // Update user active status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        email: true,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    })

  } catch (error) {
    console.error('Toggle user active error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
