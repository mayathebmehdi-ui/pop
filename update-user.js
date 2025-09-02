const { PrismaClient } = require('@prisma/client');

async function updateUser() {
  const db = new PrismaClient();
  
  try {
    const user = await db.user.update({
      where: { email: 'mehdi.lakhdhar2020@gmail.com' },
      data: { mustReset: false },
      select: { email: true, mustReset: true, isActive: true, role: true }
    });
    
    console.log('✅ Compte mis à jour:');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Must Reset:', user.mustReset);
    console.log('   Active:', user.isActive);
    console.log('');
    console.log('🔑 IDENTIFIANTS:');
    console.log('   Email: mehdi.lakhdhar2020@gmail.com');
    console.log('   Mot de passe: TZBCVCXvUbwE');
    console.log('   Login: http://localhost:3000/login');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await db.$disconnect();
  }
}

updateUser();
