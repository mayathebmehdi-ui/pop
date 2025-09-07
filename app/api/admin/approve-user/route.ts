import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendApprovalStatusEmail } from '@/lib/mailer'

export async function POST(request: NextRequest) {
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

    const { userId, action, reason } = await request.json()

    if (!userId || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    // Get user to approve/reject
    const userToUpdate = await db.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        firstName: true, 
        lastName: true,
        approvalStatus: true
      }
    })

    if (!userToUpdate) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userToUpdate.approvalStatus !== 'PENDING_APPROVAL') {
      return NextResponse.json(
        { error: 'User is not pending approval' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED'
    const userName = `${userToUpdate.firstName || ''} ${userToUpdate.lastName || ''}`.trim() || userToUpdate.email

    // Update user status
    await db.user.update({
      where: { id: userId },
      data: {
        approvalStatus: newStatus,
        isActive: action === 'approve' // Activate if approved
      }
    })

    // Send notification email to user
    try {
      await sendApprovalStatusEmail({
        userEmail: userToUpdate.email,
        userName,
        status: newStatus as 'APPROVED' | 'REJECTED',
        reason
      })
      console.log(`📧 ${newStatus} notification sent to ${userToUpdate.email}`)
    } catch (emailError) {
      console.error('Failed to send approval notification email:', emailError)
      // Don't fail the request if email fails
    }

    console.log(`✅ User ${userToUpdate.email} ${action}d by admin`)

    return NextResponse.json({
      success: true,
      message: `User ${action}d successfully`,
      user: {
        id: userToUpdate.id,
        email: userToUpdate.email,
        status: newStatus
      }
    })

  } catch (error) {
    console.error('User approval error:', error)
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
