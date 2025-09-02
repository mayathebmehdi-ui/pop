const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

async function fixUser() {
  const db = new PrismaClient();
  
  try {
    // Supprimer ancien compte s'il existe
    await db.user.deleteMany({
      where: { email: "mehdi.lakhdhar2020@gmail.com" }
    });
    
    // Créer nouveau compte avec mot de passe connu
    const hashedPassword = await bcrypt.hash("TestPass123", 12);
    const user = await db.user.create({
      data: {
        email: "mehdi.lakhdhar2020@gmail.com",
        firstName: "Mehdi",
        lastName: "Lakhdhar",
        role: "USER",
        hashedPassword,
        isActive: true,
        mustReset: false
      }
    });
    
    console.log("✅ Nouveau compte créé:");
    console.log("   Email: mehdi.lakhdhar2020@gmail.com");
    console.log("   Mot de passe: TestPass123");
    console.log("   Active: true");
    console.log("   Must Reset: false");
    
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await db.$disconnect();
  }
}

fixUser();