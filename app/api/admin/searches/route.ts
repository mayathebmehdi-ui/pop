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

    // Get recent searches with user info
    const searches = await db.searchRequest.findMany({
      select: {
        id: true,
        userId: true,
        payload: true,
        status: true,
        result: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 searches
    })

    // Format searches (payload and result are already Json type, no parsing needed)
    const formattedSearches = searches.map(search => ({
      ...search,
      payload: search.payload,
      result: search.result
    }))

    return NextResponse.json({
      success: true,
      searches: formattedSearches
    })

  } catch (error) {
    console.error('Admin searches API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
