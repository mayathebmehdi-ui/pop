# 🚀 PARTIE 2: Déploiement AWS - Deceased Status App

## Options de Déploiement AWS

### 🎯 Option 1: AWS Amplify (Recommandé - Le plus simple)
### 🐳 Option 2: AWS ECS avec Docker 
### ☁️ Option 3: AWS EC2 traditionnel

---

## 🎯 OPTION 1: AWS Amplify (Recommandé)

### Avantages d'Amplify:
- ✅ Déploiement automatique depuis Git
- ✅ SSL/HTTPS automatique
- ✅ CDN global intégré
- ✅ Builds automatiques
- ✅ Variables d'environnement faciles
- ✅ Scaling automatique
- ✅ Free tier généreux

### Étape 1.1: Préparer le projet pour Amplify

#### Créer le fichier de build
```json
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

#### Modifier package.json pour la production
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npx prisma generate && next build",
    "start": "next start",
    "postbuild": "npx prisma db push"
  }
}
```

### Étape 1.2: Déployer sur Amplify

#### Via Console AWS Amplify:
1. **Aller sur AWS Amplify Console**
2. **"Host your web app"**
3. **Connecter votre repository GitHub**
4. **Configurer les settings**:
   - App name: `deceased-status-app`
   - Environment: `production`
   - Build settings: Auto-detect ou upload `amplify.yml`

5. **Ajouter les variables d'environnement**:
   ```
   DATABASE_URL = postgresql://dbadmin:pass@rds-endpoint:5432/postgres
   REDIS_URL = redis://elasticache-endpoint:6379
   NEXTAUTH_SECRET = votre_secret_32_chars
   RESEND_API_KEY = votre_resend_key
   DEATH_CHECK_API_URL = https://93e08lwg2l.execute-api.us-east-1.amazonaws.com/version_one
   DEATH_CHECK_API_KEY = votre_death_check_key
   NEXT_PUBLIC_APP_URL = https://votre-app.amplifyapp.com
   NODE_ENV = production
   ```

6. **Deploy!**

### Étape 1.3: Configuration post-déploiement
```bash
# Test de la base de données
curl -X POST https://votre-app.amplifyapp.com/api/health

# Créer l'utilisateur admin
curl -X POST https://votre-app.amplifyapp.com/api/activate-admin \
  -H "Content-Type: application/json" \
  -d '{"email":"mehdi@tonexora.com","password":"Admin123!"}'
```

---

## 🐳 OPTION 2: AWS ECS avec Docker

### Étape 2.1: Créer le Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Étape 2.2: Configurer ECS
```bash
# Créer ECR repository
aws ecr create-repository --repository-name deceased-status-app

# Build et push Docker image
docker build -t deceased-status-app .
docker tag deceased-status-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/deceased-status-app:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/deceased-status-app:latest

# Créer ECS cluster
aws ecs create-cluster --cluster-name deceased-status-cluster

# Créer task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### Task Definition (task-definition.json):
```json
{
  "family": "deceased-status-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "deceased-status-container",
      "image": "123456789.dkr.ecr.us-east-1.amazonaws.com/deceased-status-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://dbadmin:pass@rds-endpoint:5432/postgres"
        },
        {
          "name": "REDIS_URL", 
          "value": "redis://elasticache-endpoint:6379"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/deceased-status",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## ☁️ OPTION 3: AWS EC2 Traditionnel

### Étape 3.1: Lancer une instance EC2
```bash
# Créer une instance t2.micro (Free tier)
aws ec2 run-instances \
    --image-id ami-0c02fb55956c7d316 \
    --count 1 \
    --instance-type t2.micro \
    --key-name your-key-pair \
    --security-group-ids sg-xxxxxxxxx \
    --subnet-id subnet-xxxxxxxxx \
    --associate-public-ip-address
```

### Étape 3.2: Configuration de l'instance
```bash
# Se connecter à l'instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Installer Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Installer PM2 pour la gestion des processus
sudo npm install -g pm2

# Installer Git
sudo yum install -y git

# Cloner le projet
git clone https://github.com/votre-username/deceased-status-app.git
cd deceased-status-app

# Installer les dépendances
npm ci

# Créer le fichier .env.production
nano .env.production
# (Copier les variables d'environnement AWS)

# Générer Prisma et build
npx prisma generate
npm run build

# Démarrer avec PM2
pm2 start npm --name "deceased-status" -- start
pm2 save
pm2 startup
```

### Étape 3.3: Configuration Nginx (Reverse Proxy)
```bash
# Installer Nginx
sudo yum install -y nginx

# Configuration Nginx
sudo nano /etc/nginx/conf.d/deceased-status.conf
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Démarrer Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

---

## 🔐 Configuration SSL/HTTPS

### Pour Amplify: Automatique ✅

### Pour ECS: Application Load Balancer + ACM
```bash
# Demander un certificat SSL
aws acm request-certificate \
    --domain-name votre-domaine.com \
    --validation-method DNS
```

### Pour EC2: Certbot + Let's Encrypt
```bash
# Installer Certbot
sudo yum install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.com

# Auto-renewal
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 Comparaison des Options

| Feature | Amplify | ECS | EC2 |
|---------|---------|-----|-----|
| Simplicité | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Coût | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Contrôle | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Scaling | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Maintenance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

---

## 🎯 Recommandation

**Pour débuter: AWS Amplify** ⭐
- Plus simple et rapide
- Moins de configuration
- SSL automatique
- Free tier généreux

**Pour la production avancée: ECS**
- Plus de contrôle
- Scaling professionnel
- Intégration AWS complète

Quelle option préférez-vous ? Je peux vous guider étape par étape ! 🚀
