# 🚀 Déploiement AWS - Guide Rapide

## ✅ Configuration Terminée

- **Base PostgreSQL RDS** : `databasetest.cjmaw0g6w38o.us-west-2.rds.amazonaws.com`
- **Admin créé** : `mehdi@tonexora.com` / `Admin123!`
- **Build réussi** : Application prête pour production

## 🎯 Options de Déploiement

### Option 1: AWS Amplify (Recommandé - Plus Simple)

1. **Aller sur AWS Amplify Console**
2. **"Host your web app"** → Connecter GitHub
3. **Variables d'environnement** :
   ```
   DATABASE_URL=postgresql://postgres:Mehdi%26eya22330920@databasetest.cjmaw0g6w38o.us-west-2.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require
   NODE_ENV=production
   NEXTAUTH_SECRET=votre_secret_32_chars_minimum
   RESEND_API_KEY=votre_resend_api_key
   DEATH_CHECK_API_URL=https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one
   DEATH_CHECK_API_KEY=votre_death_check_api_key
   NEXT_PUBLIC_APP_URL=https://votre-app.amplifyapp.com
   ```
4. **Deploy** → URL fournie automatiquement

### Option 2: AWS EC2 (Plus de Contrôle)

1. **Lancer EC2 t2.micro** (Free tier)
2. **Installer Node.js 18+, PM2, Nginx**
3. **Cloner le repo et configurer**
4. **PM2 + Nginx reverse proxy**

### Option 3: Docker + ECS (Production Avancée)

1. **Build Docker image**
2. **Push vers ECR**
3. **Deploy sur ECS Fargate**

## 🔐 Variables d'Environnement à Configurer

```env
# Base de données (DÉJÀ CONFIGURÉ)
DATABASE_URL=postgresql://postgres:Mehdi%26eya22330920@databasetest.cjmaw0g6w38o.us-west-2.rds.amazonaws.com:5432/postgres?schema=public&sslmode=require

# Auth (GÉNÉRER)
NEXTAUTH_SECRET=generer_une_cle_de_32_caracteres_minimum

# Email (À CONFIGURER)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# API Death Check (À CONFIGURER)
DEATH_CHECK_API_URL=https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one
DEATH_CHECK_API_KEY=xxxxxxxxxxxxxxxx

# App (SERA FOURNI PAR AWS)
NEXT_PUBLIC_APP_URL=https://votre-domaine-aws.com
NODE_ENV=production
```

## 🎯 Recommandation

**Commencez par AWS Amplify** - Le plus rapide et simple :
1. Connecter GitHub repo
2. Ajouter les variables d'env
3. Deploy automatique
4. URL HTTPS fournie
5. SSL et CDN inclus

Voulez-vous que je vous guide pour Amplify ou préférez-vous EC2 ?
