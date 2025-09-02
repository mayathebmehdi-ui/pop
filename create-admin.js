const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function createAdmin() {
  const db = new PrismaClient();
  
  try {
    // Vérifier si admin existe déjà
    const existingAdmin = await db.user.findUnique({
      where: { email: "mehdi@tonexora.com" }
    });
    
    if (existingAdmin) {
      console.log("✅ Admin existe déjà:", existingAdmin.email);
      console.log("   Role:", existingAdmin.role);
      console.log("   Active:", existingAdmin.isActive);
      return;
    }
    
    // Créer admin
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    const admin = await db.user.create({
      data: {
        email: "mehdi@tonexora.com",
        firstName: "Mehdi",
        lastName: "Lakhdhar", 
        role: "ADMIN",
        hashedPassword,
        isActive: true,
        mustReset: false
      }
    });
    
    console.log("✅ Utilisateur admin créé:");
    console.log("   Email: mehdi@tonexora.com");
    console.log("   Mot de passe: Admin123!");
    console.log("   Role: ADMIN");
    console.log("   Active: true");
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
