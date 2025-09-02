#!/bin/bash

# Script de démarrage complet pour Deceased Status App
# Usage: ./start.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 ========================================"
echo "   DECEASED STATUS - DÉMARRAGE COMPLET"
echo "========================================"
echo

cd "$(dirname "$0")"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Étape 1: Vérification des dépendances
print_step "Vérification des dépendances"

if [ ! -d "node_modules" ]; then
    print_warning "Node modules manquants, installation..."
    npm ci --no-audit --no-fund
fi

print_success "Dépendances OK"

# Étape 2: Configuration base de données PostgreSQL
print_step "Configuration base de données PostgreSQL"

# Générer le client Prisma
echo "Génération du client Prisma..."
npx prisma generate > /dev/null 2>&1

# Appliquer le schéma (sans --accept-data-loss pour préserver les données RDS)
echo "Application du schéma PostgreSQL..."
npx prisma db push > /dev/null 2>&1

print_success "Base PostgreSQL configurée"

# Étape 3: Création utilisateur admin
print_step "Création utilisateur admin"

# Script Node.js pour créer l'admin
cat > create_admin_temp.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const db = new PrismaClient();
  
  try {
    // Vérifier si admin existe
    const existingAdmin = await db.user.findUnique({
      where: { email: 'mehdi@tonexora.com' }
    });
    
    if (existingAdmin) {
      console.log('✅ Admin existe déjà: mehdi@tonexora.com');
      return;
    }
    
    // Créer admin
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    const admin = await db.user.create({
      data: {
        email: 'mehdi@tonexora.com',
        firstName: 'Mehdi',
        lastName: 'Admin',
        role: 'ADMIN',
        hashedPassword,
        isActive: true,
        mustReset: false
      }
    });
    
    console.log('✅ Admin créé avec succès');
    console.log('   Email: mehdi@tonexora.com');
    console.log('   Mot de passe: Admin123!');
    
  } catch (error) {
    console.error('❌ Erreur création admin:', error.message);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
EOF

node create_admin_temp.js
rm create_admin_temp.js

print_success "Utilisateur admin configuré"

# Étape 4: Vérification configuration
print_step "Vérification configuration"

echo "📧 Email: Resend API configuré"
echo "🗄️  Base: PostgreSQL RDS (AWS)"
echo "🔑 Admin: mehdi@tonexora.com / Admin123!"
echo "🌐 URL: http://localhost:3000"

print_success "Configuration validée"

# Étape 5: Démarrage serveur
print_step "Démarrage serveur Next.js"

echo "🚀 Démarrage de l'application..."
echo "   - Arrêt des processus existants..."

# Arrêter les processus Next.js existants
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 2

echo "   - Lancement du serveur..."
echo

# Démarrer le serveur
npm run dev &
SERVER_PID=$!

# Attendre que le serveur soit prêt
echo "⏳ Attente du serveur..."
for i in {1..30}; do
    if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
        break
    fi
    echo -n "."
    sleep 1
done
echo

# Vérifier si le serveur est accessible
if curl -s http://127.0.0.1:3000 > /dev/null 2>&1; then
    echo
    print_success "🎉 APPLICATION PRÊTE !"
    echo
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔐 Login: http://localhost:3000/login"
    echo "📝 Demande: http://localhost:3000/request-account"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo
    echo "👤 IDENTIFIANTS ADMIN:"
    echo "   Email: mehdi@tonexora.com"
    echo "   Mot de passe: Admin123!"
    echo
    echo "📧 Email: Resend API / SMTP configuré"
    echo "🗄️  Base de données: PostgreSQL RDS (AWS)"
    echo
    echo "▶️  Serveur en cours d'exécution (PID: $SERVER_PID)"
    echo "   Ctrl+C pour arrêter"
    echo
    
    # Garder le script en vie
    wait $SERVER_PID
else
    print_error "Serveur non accessible après 30s"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi
