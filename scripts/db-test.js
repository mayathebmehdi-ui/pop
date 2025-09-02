const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()
  try {
    console.log('🔍 Test de connexion PostgreSQL...')
    
    // Test basique de connexion
    await prisma.$queryRawUnsafe('SELECT 1 as test;')
    console.log('✅ Connexion PostgreSQL OK')
    
    // Test des tables existantes
    const result = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `)
    
    console.log('📊 Tables disponibles:', result.map(r => r.table_name).join(', '))
    
    // Test de comptage des utilisateurs
    try {
      const userCount = await prisma.user.count()
      console.log(`👥 Nombre d'utilisateurs: ${userCount}`)
    } catch (e) {
      console.log('ℹ️  Table users pas encore créée ou pas accessible')
    }
    
  } catch (e) {
    console.error('❌ Échec connexion PostgreSQL:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
