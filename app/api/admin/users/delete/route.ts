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

    // Prevent admin from deleting themselves
    if (userId === adminUser.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      )
    }

    // Get target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        role: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Delete user and all related data (CASCADE will handle search_requests and batch_uploads)
    await db.user.delete({
      where: { id: targetUser.id }
    })

    console.log(`✅ User deleted: ${targetUser.email} (${targetUser.role})`)

    return NextResponse.json({
      success: true,
      message: `User ${targetUser.email} has been deleted successfully`
    })

  } catch (error) {
    console.error('Delete user error:', error)
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
