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

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload CSV or Excel files.' },
        { status: 400 }
      )
    }

    // For now, return a mock response
    // In a real implementation, you would:
    // 1. Parse the CSV/Excel file
    // 2. Validate the data
    // 3. Process each row through the death check API
    // 4. Store results in database
    // 5. Return processed results

    // Create batch upload record
    const batch = await db.batchUpload.create({
      data: {
        userId: user.id,
        filename: file.name,
        status: 'processing'
      }
    })

    // Mock processing results
    const mockResults = [
      {
        fname: 'JOHN',
        lname: 'DOE',
        mname: 'MICHAEL',
        dob: '19850615',
        city: 'CHICAGO',
        state: 'IL',
        status: 'ok',
        result: {
          result: 'False',
          message: 'No death record found',
          confidence: 85
        }
      },
      {
        fname: 'JANE',
        lname: 'SMITH',
        mname: '',
        dob: '19901203',
        city: 'NEW YORK',
        state: 'NY',
        status: 'ok',
        result: {
          result: 'True',
          dod: '2023-05-15',
          dod_precision: 'exact',
          confidence: 95
        }
      }
    ]

    // Update batch status
    await db.batchUpload.update({
      where: { id: batch.id },
      data: { status: 'done' }
    })

    return NextResponse.json({
      success: true,
      batchId: batch.id,
      results: mockResults,
      message: 'File processed successfully (mock data)'
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
