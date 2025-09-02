#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testPasswordFlow() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Testing password flow on deployed app...');
    
    // 1. Create a test user with mustReset: true
    const testEmail = `test-${Date.now()}@example.com`;
    console.log(`📧 Creating test user: ${testEmail}`);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        firstName: 'Test',
        lastName: 'User',
        hashedPassword: '$2b$10$tempPasswordHash', // This will be replaced
        role: 'USER',
        isActive: true,
        mustReset: true
      }
    });
    
    console.log(`✅ Created user with ID: ${user.id}`);
    console.log(`🔄 User mustReset: ${user.mustReset}`);
    
    // 2. Test the flow
    console.log('\n🌐 Test flow:');
    console.log(`1. Login with: ${testEmail} / tempPassword`);
    console.log('2. Should redirect to /set-password');
    console.log('3. Set new password (12+ chars, mixed case, numbers, symbols)');
    console.log('4. Should redirect to /app');
    
    // 3. Check user status
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true, mustReset: true, isActive: true }
    });
    
    console.log(`\n👤 User status: mustReset=${updatedUser.mustReset}, isActive=${updatedUser.isActive}`);
    
    // 4. Clean up (optional - comment out to keep test user)
    // await prisma.user.delete({ where: { id: user.id } });
    // console.log('🗑️ Test user cleaned up');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPasswordFlow();
