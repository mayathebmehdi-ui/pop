import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get admin user from session
    const userIdCookie = request.cookies.get('user-id')
    if (!userIdCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify admin role
    const adminUser = await db.user.findUnique({
      where: { id: userIdCookie.value },
      select: { role: true, isActive: true }
    })

    if (!adminUser || !adminUser.isActive || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all users pending approval
    const pendingUsers = await db.user.findMany({
      where: {
        approvalStatus: 'PENDING_APPROVAL'
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        role: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      pendingUsers: pendingUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        role: user.role
      }))
    })

  } catch (error) {
    console.error('Get pending approvals error:', error)
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
