const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

async function fixPeterAdmin() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔧 Fixing Peter admin account...')
    
    const email = 'peter@publichealthresearch.net'
    const password = 'DHSDHS123$'
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (user) {
      // Update existing user
      console.log('📝 Updating existing Peter admin account...')
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: email.toLowerCase(),
          hashedPassword,
          firstName: 'Peter',
          lastName: 'Admin',
          role: 'ADMIN',
          isActive: true,
          mustReset: false // No need to reset password
        }
      })
      console.log('✅ Peter admin account updated!')
    } else {
      // Create new user
      console.log('➕ Creating new Peter admin account...')
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          hashedPassword,
          firstName: 'Peter',
          lastName: 'Admin',
          role: 'ADMIN',
          isActive: true,
          mustReset: false // No need to reset password
        }
      })
      console.log('✅ Peter admin account created!')
    }
    
    console.log('')
    console.log('🎯 LOGIN DETAILS:')
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`👤 Role: ADMIN`)
    console.log(`✅ Active: true`)
    console.log(`🔄 Must Reset: false`)
    console.log('')
    console.log('🌐 Login URL: http://34.216.99.253:3000/login')
    console.log('🛠️  Admin Panel: http://34.216.99.253:3000/admin')
    console.log('')
    
  } catch (error) {
    console.error('❌ Error fixing Peter admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

fixPeterAdmin()
