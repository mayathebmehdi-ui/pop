import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('🧪 COOKIE TEST - Headers received:')
  console.log('Host:', request.headers.get('host'))
  console.log('Cookie header:', request.headers.get('cookie'))
  
  // Lire tous les cookies reçus
  const allCookies = Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value]))
  console.log('Parsed cookies:', allCookies)
  
  // Créer une réponse avec un cookie de test
  const response = NextResponse.json({
    message: 'Cookie test',
    receivedCookies: allCookies,
    timestamp: new Date().toISOString()
  })
  
  // Définir un cookie de test
  response.cookies.set({
    name: 'test-cookie',
    value: 'test-' + Date.now(),
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600
  })
  
  response.headers.set('Cache-Control', 'no-store, max-age=0')
  
  console.log('🧪 Test cookie set')
  return response
}

export async function POST(request: NextRequest) {
  return GET(request) // Même logique pour POST
}
