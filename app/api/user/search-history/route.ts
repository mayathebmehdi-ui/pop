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

    // Validate user exists and is active
    const user = await db.user.findUnique({
      where: { id: userIdCookie.value },
      select: { id: true, isActive: true }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    // Get user's search history
    const searches = await db.searchRequest.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        payload: true,
        status: true,
        result: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to recent 100 searches
    })

    // Parse JSON strings back to objects
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
    console.error('User search history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
