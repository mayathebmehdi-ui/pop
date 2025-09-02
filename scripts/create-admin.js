const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

async function createAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔧 Création de l\'utilisateur admin...')
    
    const email = 'mehdi@tonexora.com'
    const password = 'Admin123!'
    
    // Vérifier si l'admin existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      console.log('⚠️  L\'utilisateur admin existe déjà')
      
      // Mettre à jour avec le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.update({
        where: { email },
        data: {
          hashedPassword,
          role: 'ADMIN',
          isActive: true,
          mustReset: false
        }
      })
      console.log('✅ Utilisateur admin mis à jour')
    } else {
      // Créer le nouvel admin
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          email,
          hashedPassword,
          firstName: 'Mehdi',
          lastName: 'Admin',
          role: 'ADMIN',
          isActive: true,
          mustReset: false
        }
      })
      console.log('✅ Utilisateur admin créé avec l\'ID:', user.id)
    }
    
    console.log('📧 Email:', email)
    console.log('🔑 Mot de passe:', password)
    console.log('👑 Rôle: ADMIN')
    console.log('🟢 Statut: Actif')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
