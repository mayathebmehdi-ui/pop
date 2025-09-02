# 🚀 Guide de Déploiement AWS - Deceased Status App

## PARTIE 1: Configuration de l'Infrastructure AWS

### 📋 Prérequis
- Compte AWS actif
- AWS CLI installé et configuré
- Domaine (optionnel mais recommandé)

---

## 🗄️ 1. Configuration AWS RDS (PostgreSQL)

### Étape 1.1: Créer la base de données RDS
```bash
# Via AWS CLI
aws rds create-db-instance \
    --db-instance-identifier deceased-status-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username dbadmin \
    --master-user-password "VotreMotDePasse123!" \
    --allocated-storage 20 \
    --storage-type gp2 \
    --vpc-security-group-ids sg-xxxxxxxxx \
    --db-subnet-group-name default \
    --backup-retention-period 7 \
    --multi-az false \
    --publicly-accessible true \
    --storage-encrypted \
    --deletion-protection false
```

### Étape 1.2: Via Console AWS (Plus facile)
1. **Aller sur AWS RDS Console**
2. **Créer une base de données** :
   - Engine: PostgreSQL
   - Version: 15.4 ou plus récent
   - Template: Free tier (pour commencer)
   - DB instance identifier: `deceased-status-db`
   - Master username: `dbadmin`
   - Master password: `VotreMotDePasse123!`
   - DB instance class: `db.t3.micro` (Free tier)
   - Storage: 20 GB GP2
   - **⚠️ IMPORTANT**: Publicly accessible: `Yes`
   - VPC security group: Créer nouveau ou utiliser default

3. **Configurer Security Group**:
   - Nom: `deceased-status-db-sg`
   - Inbound rules:
     - Type: PostgreSQL
     - Port: 5432
     - Source: 0.0.0.0/0 (pour test, à restreindre en prod)

### Étape 1.3: Obtenir l'URL de connexion
```bash
# Après création, récupérer l'endpoint
aws rds describe-db-instances --db-instance-identifier deceased-status-db

# L'URL sera du format:
# postgresql://dbadmin:VotreMotDePasse123!@deceased-status-db.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres
```

---

## 🔴 2. Configuration AWS ElastiCache (Redis)

### Étape 2.1: Via Console AWS
1. **Aller sur ElastiCache Console**
2. **Créer un cluster Redis**:
   - Engine: Redis
   - Location: AWS Cloud
   - Cluster mode: Disabled
   - Name: `deceased-status-redis`
   - Node type: `cache.t3.micro` (Free tier)
   - Number of replicas: 0
   - Subnet group: default
   - Security groups: Créer nouveau

3. **Configurer Security Group Redis**:
   - Nom: `deceased-status-redis-sg`
   - Inbound rules:
     - Type: Custom TCP
     - Port: 6379
     - Source: Security group de votre application

### Étape 2.2: Obtenir l'URL Redis
```bash
# Récupérer l'endpoint Redis
aws elasticache describe-cache-clusters --cache-cluster-id deceased-status-redis --show-cache-node-info

# L'URL sera du format:
# redis://deceased-status-redis.xxxxx.cache.amazonaws.com:6379
```

---

## 🔐 3. Configuration des Variables d'Environnement AWS

### Fichier de production AWS
Créer `.env.production`:

```env
# Base de données AWS RDS PostgreSQL
DATABASE_URL="postgresql://dbadmin:VotreMotDePasse123!@deceased-status-db.xxxxx.us-east-1.rds.amazonaws.com:5432/postgres"

# Redis AWS ElastiCache
REDIS_URL="redis://deceased-status-redis.xxxxx.cache.amazonaws.com:6379"

# Authentification
NEXTAUTH_SECRET="votre_secret_super_securise_minimum_32_caracteres"

# Email - Resend API
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxx"

# API Death Check
DEATH_CHECK_API_URL="https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one"
DEATH_CHECK_API_KEY="votre_api_key_death_check"

# Application
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
NODE_ENV="production"
```

---

## 🛡️ 4. Configuration Sécurité et VPC

### Étape 4.1: Créer un VPC dédié (Optionnel mais recommandé)
```bash
# Créer VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=deceased-status-vpc}]'

# Créer subnets
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxxxxxxxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b
```

### Étape 4.2: Configuration Security Groups
```bash
# Security Group pour RDS
aws ec2 create-security-group \
    --group-name deceased-status-db-sg \
    --description "Security group for RDS PostgreSQL" \
    --vpc-id vpc-xxxxxxxxx

# Autoriser connexions PostgreSQL
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 5432 \
    --cidr 10.0.0.0/16
```

---

## 📊 5. Estimation des Coûts AWS (Free Tier)

### Services gratuits (12 mois):
- **RDS**: db.t3.micro, 20GB storage, 750h/mois
- **ElastiCache**: cache.t3.micro, 750h/mois
- **EC2**: t2.micro, 750h/mois (pour l'app)
- **S3**: 5GB storage
- **CloudFront**: 50GB transfer

### Coûts après Free Tier (~$15-30/mois):
- RDS t3.micro: ~$13/mois
- ElastiCache t3.micro: ~$11/mois
- EC2 t2.micro: ~$8/mois
- Autres services: ~$5/mois

---

## ✅ Checklist Configuration
- [ ] RDS PostgreSQL créé et accessible
- [ ] ElastiCache Redis configuré
- [ ] Security Groups configurés
- [ ] Variables d'environnement préparées
- [ ] Tester connexions depuis local
- [ ] Prêt pour déploiement

---

**Prochaine étape**: PARTIE 2 - Déploiement de l'application
