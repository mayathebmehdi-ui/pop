import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email = 'mehdi@tonexora.com', password = 'Admin123!' } = await request.json().catch(() => ({}))
    
    console.log('=== ACTIVATION ADMIN ===')
    console.log('Email:', email)
    
    // Chercher l'utilisateur
    const user = await db.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('❌ Utilisateur non trouvé, création...')
      
      // Créer l'admin s'il n'existe pas
      const hashedPassword = await hashPassword(password)
      const newAdmin = await db.user.create({
        data: {
          email,
          firstName: 'Mehdi',
          lastName: 'Admin',
          role: 'ADMIN',
          hashedPassword,
          isActive: true,
          mustReset: false
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'Admin créé et activé',
        user: {
          id: newAdmin.id,
          email: newAdmin.email,
          role: newAdmin.role,
          isActive: newAdmin.isActive
        }
      })
    }
    
    // Mettre à jour l'utilisateur existant
    const hashedPassword = await hashPassword(password)
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        role: 'ADMIN',
        isActive: true,
        mustReset: false,
        hashedPassword
      }
    })
    
    console.log('✅ Admin activé:', updatedUser.email)
    
    return NextResponse.json({
      success: true,
      message: 'Admin activé avec succès',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive
      }
    })
    
  } catch (error) {
    console.error('Erreur activation admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation admin' },
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
