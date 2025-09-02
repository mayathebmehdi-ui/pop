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

    // Extract search parameters
    const { searchParams } = new URL(request.url)
    const fname = searchParams.get('fname')
    const lname = searchParams.get('lname')
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const dob = searchParams.get('dob')
    const mname = searchParams.get('mname')

    // Validate required parameters
    if (!fname || !lname || !city || !state || !dob) {
      return NextResponse.json(
        { error: 'Missing required parameters: fname, lname, city, state, dob' },
        { status: 400 }
      )
    }

    // Normalize DOB if needed (YYYY-MM-DD → YYYYMMDD)
    let normalizedDob = dob
    if (dob.includes('-')) {
      const [year, month, day] = dob.split('-')
      normalizedDob = `${year}${month}${day}`
    }

    // Prepare search payload
    const searchPayload = {
      fname: fname.toUpperCase(),
      lname: lname.toUpperCase(),
      city: city.toUpperCase(),
      state: state.toUpperCase(),
      dob: normalizedDob,
      ...(mname && { mname: mname.toUpperCase() })
    }

    // Call external death check API
    const apiUrl = process.env.DEATH_CHECK_API_URL
    const apiKey = process.env.DEATH_CHECK_API_KEY

    if (!apiUrl) {
      return NextResponse.json(
        { error: 'Death check API not configured' },
        { status: 500 }
      )
    }

    let apiResult = null
    let searchStatus = 'error'
    
    if (apiKey) {
      try {
        const apiParams = new URLSearchParams(searchPayload)
        const apiResponse = await fetch(`${apiUrl}?${apiParams}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          // Add timeout
          signal: AbortSignal.timeout(30000)
        })

        if (apiResponse.ok) {
          apiResult = await apiResponse.json()
          searchStatus = 'ok'
        } else {
          apiResult = {
            error: `API returned ${apiResponse.status}: ${apiResponse.statusText}`,
            status: apiResponse.status
          }
        }
      } catch (error) {
        console.error('Death check API error:', error)
        apiResult = {
          error: error instanceof Error ? error.message : 'API request failed',
          timeout: error instanceof Error && error.name === 'TimeoutError'
        }
      }
    } else {
      // Mock response for development
      apiResult = {
        result: "False",
        message: "No API key configured - mock response",
        confidence: 0,
        mock: true
      }
      searchStatus = 'ok'
    }

    // Store search request in database
    try {
      const searchRequest = await db.searchRequest.create({
        data: {
          userId: user.id,
          payload: searchPayload,
          status: searchStatus,
          result: apiResult,
        }
      })

      console.log(`Search request created: ${searchRequest.id}`)
    } catch (dbError) {
      console.error('Database error:', dbError)
      // Continue even if DB storage fails
    }

    // Return the result
    return NextResponse.json({
      success: true,
      payload: searchPayload,
      result: apiResult,
      status: searchStatus,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Death check search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed. Use GET.' },
    { status: 405 }
  )
}
