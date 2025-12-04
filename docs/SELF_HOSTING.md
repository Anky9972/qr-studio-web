# Self-Hosting QR Studio

This guide will help you deploy QR Studio on your own infrastructure.

---

## Deployment Options

1. **Vercel** (Recommended) - Easiest deployment
2. **Docker** - Containerized deployment
3. **VPS/Cloud** - Traditional server deployment
4. **Railway/Render** - Alternative PaaS options

---

## Option 1: Deploy to Vercel

### Prerequisites
- Vercel account
- GitHub repository
- PostgreSQL database (Neon, Supabase, or Railway)

### Steps

1. **Push code to GitHub**
```bash
git remote add origin https://github.com/your-username/qr-studio.git
git push -u origin main
```

2. **Import project to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repository

3. **Configure Environment Variables**

Add these in Vercel dashboard:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

4. **Deploy**
- Click "Deploy"
- Wait for build to complete
- Visit your live site

5. **Set up Database**
```bash
# From your local machine
DATABASE_URL="your-production-db-url" npx prisma migrate deploy
```

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable

---

## Option 2: Docker Deployment

### Prerequisites
- Docker & Docker Compose
- PostgreSQL database
- Domain name (for production)

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/qr_studio
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=qr_studio
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

---

## Option 3: VPS/Cloud Deployment

### Prerequisites
- Ubuntu 22.04 LTS server
- Root or sudo access
- Domain name pointed to server IP

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE qr_studio;
CREATE USER qr_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE qr_studio TO qr_user;
\q
```

### 3. Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/qr-studio.git
cd qr-studio/qr-studio-web

# Install dependencies
sudo npm install

# Create environment file
sudo nano .env.production

# Add:
DATABASE_URL="postgresql://qr_user:your-password@localhost:5432/qr_studio"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"
REDIS_URL="redis://localhost:6379"

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# Build application
npm run build

# Start with PM2
pm2 start npm --name "qr-studio" -- start
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/qr-studio
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/qr-studio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is configured automatically
```

---

## Option 4: Railway Deployment

### Steps

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Initialize Project**
```bash
railway login
railway init
```

3. **Add PostgreSQL**
```bash
railway add --plugin postgresql
```

4. **Deploy**
```bash
railway up
```

5. **Set Environment Variables**
```bash
railway variables set NEXTAUTH_SECRET=your-secret-key
railway variables set NEXTAUTH_URL=https://your-app.railway.app
```

---

## Environment Variables Reference

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth (at least one)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

### Optional Variables

```env
# Redis (for caching)
REDIS_URL="redis://host:6379"

# Email
EMAIL_SERVER="smtp://user:password@smtp.example.com:587"
EMAIL_FROM="noreply@your-domain.com"

# Sentry (error tracking)
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-dsn"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# WebSocket
NEXT_PUBLIC_WS_URL="https://your-domain.com"

# Storage (if using S3)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket"
```

---

## Database Management

### Backup Database

```bash
# PostgreSQL backup
pg_dump -U user -h host database > backup.sql

# Restore backup
psql -U user -h host database < backup.sql
```

### Automated Backups

Create cron job:
```bash
crontab -e

# Daily backup at 2 AM
0 2 * * * pg_dump -U user database > /backups/db-$(date +\%Y\%m\%d).sql
```

---

## Monitoring & Maintenance

### Check Application Status

```bash
# PM2
pm2 status
pm2 logs qr-studio
pm2 monit

# Docker
docker-compose ps
docker-compose logs -f
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Check resources
htop
df -h
free -m
```

### Performance Optimization

1. **Enable Gzip Compression** (Nginx)
```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Set up Cloudflare** (CDN)
- Add domain to Cloudflare
- Update nameservers
- Enable caching and optimization

3. **Database Optimization**
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM ANALYZE;
```

---

## Security Best Practices

1. **Firewall Configuration**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Secure PostgreSQL**
```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change to:
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
```

3. **Regular Updates**
```bash
sudo apt update && sudo apt upgrade -y
pm2 update
```

4. **Secure Environment Variables**
- Never commit `.env` files
- Use secrets management (Vault, AWS Secrets Manager)
- Rotate credentials regularly

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs qr-studio --lines 100

# Check environment variables
pm2 env qr-studio

# Restart application
pm2 restart qr-studio
```

### Database Connection Issues

```bash
# Test connection
psql -U user -h host -d database

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

---

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer** (Nginx)
```nginx
upstream qr_studio {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}
```

2. **Multiple Instances** (PM2)
```bash
pm2 start npm --name "qr-studio" -i max -- start
```

### Database Scaling

1. **Read Replicas** - Separate read/write databases
2. **Connection Pooling** - Use PgBouncer
3. **Caching** - Redis for frequently accessed data

### CDN Integration

Use Cloudflare, AWS CloudFront, or similar for:
- Static assets
- QR code images
- Global distribution

---

## Backup & Recovery

### Full Backup Script

```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump -U user database > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/qr-studio/uploads

# Backup environment
cp /var/www/qr-studio/.env.production $BACKUP_DIR/env_$DATE

# Delete old backups (keep 30 days)
find $BACKUP_DIR -mtime +30 -delete

echo "Backup completed: $DATE"
```

---

## Support

For deployment assistance:
- Documentation: https://docs.qrstudio.com
- Community: https://discord.gg/qrstudio
- Email: support@qrstudio.com

---

## Checklist

Before going live:

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Firewall configured
- [ ] Domain DNS configured
- [ ] Email service tested
- [ ] OAuth providers configured
- [ ] Performance tested
- [ ] Security audit completed

🚀 Your QR Studio instance is ready!
