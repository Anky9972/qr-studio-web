# Troubleshooting Guide

Common issues and solutions for QR Studio.

---

## Installation Issues

### npm install fails

**Problem:** Dependencies fail to install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lockfile
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps

# Update npm
npm install -g npm@latest
```

### Prisma Client generation fails

**Problem:** `@prisma/client` not found

**Solutions:**
```bash
# Generate Prisma client
npx prisma generate

# If still fails, reinstall Prisma
npm uninstall @prisma/client prisma
npm install -D prisma
npm install @prisma/client
npx prisma generate
```

---

## Database Issues

### Cannot connect to database

**Problem:** `Error: P1001: Can't reach database server`

**Solutions:**

1. **Check connection string**
```env
# Correct format
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

2. **Test PostgreSQL connection**
```bash
psql -U user -h localhost -d database
```

3. **Check PostgreSQL is running**
```bash
# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS
brew services list
brew services start postgresql@14

# Windows
# Services → PostgreSQL → Start
```

4. **Check firewall**
```bash
# Allow PostgreSQL port
sudo ufw allow 5432/tcp
```

### Migration fails

**Problem:** `Migration ... failed to apply`

**Solutions:**

1. **Reset database (development only)**
```bash
npx prisma migrate reset
```

2. **Resolve manually**
```bash
# Check migration status
npx prisma migrate status

# Mark as applied
npx prisma migrate resolve --applied "migration_name"

# Roll back
npx prisma migrate resolve --rolled-back "migration_name"
```

3. **Fix schema conflicts**
```bash
# Push schema without migration
npx prisma db push --force-reset
```

### Prisma schema errors

**Problem:** Invalid schema syntax

**Solutions:**

1. **Validate schema**
```bash
npx prisma validate
```

2. **Format schema**
```bash
npx prisma format
```

3. **Common fixes:**
```prisma
# Missing @@index
model QRCode {
  userId String
  @@index([userId])  // Add this
}

# Wrong relation
model Scan {
  qrCodeId String
  qrCode   QRCode @relation(fields: [qrCodeId], references: [id])
  // Must have inverse relation in QRCode model
}
```

---

## Build & Runtime Issues

### Build fails with TypeScript errors

**Problem:** Type errors during build

**Solutions:**

1. **Check specific error**
```bash
npm run type-check
```

2. **Common type fixes:**
```typescript
// Fix: Property does not exist
interface Props {
  title?: string;  // Add optional property
}

// Fix: Type 'string | undefined' error
const value = prop ?? 'default';

// Fix: Object is possibly 'null'
if (user) {
  console.log(user.name);
}
```

3. **Ignore specific errors (last resort)**
```typescript
// @ts-expect-error Buffer type compatibility
const blob = new Blob([buffer]);
```

### Port already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Kill process on port
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev

# Find and kill manually (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module not found errors

**Problem:** `Cannot find module '@/components/...'`

**Solutions:**

1. **Check tsconfig paths**
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. **Restart dev server**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

3. **Reinstall dependencies**
```bash
rm -rf node_modules .next
npm install
```

### Environment variables not loading

**Problem:** `process.env.VARIABLE` is undefined

**Solutions:**

1. **Check file name**
- `.env.local` (highest priority)
- `.env.development`
- `.env.production`
- `.env`

2. **Restart server**
```bash
# Env variables are loaded at build time
npm run dev
```

3. **Use NEXT_PUBLIC_ prefix for client-side**
```env
# Server-side only
DATABASE_URL="..."

# Available in browser
NEXT_PUBLIC_APP_URL="..."
```

---

## Authentication Issues

### NextAuth session not working

**Problem:** User not authenticated after login

**Solutions:**

1. **Check NEXTAUTH_SECRET**
```env
# Generate new secret
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

2. **Check NEXTAUTH_URL**
```env
# Must match your domain
NEXTAUTH_URL="http://localhost:3000"
```

3. **Clear cookies**
```javascript
// Browser console
document.cookie.split(";").forEach(c => {
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
```

4. **Check database**
```sql
SELECT * FROM "Session" WHERE "userId" = 'user-id';
SELECT * FROM "Account" WHERE "userId" = 'user-id';
```

### OAuth providers not working

**Problem:** Google/GitHub login fails

**Solutions:**

1. **Check credentials**
```env
GOOGLE_CLIENT_ID="correct-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="correct-secret"
```

2. **Update redirect URIs**
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

3. **Check provider status**
- Google Cloud Console: APIs enabled?
- GitHub: OAuth App authorized users?

---

## API Issues

### 401 Unauthorized errors

**Problem:** API returns unauthorized

**Solutions:**

1. **Check authentication**
```typescript
const session = await getServerSession();
console.log('Session:', session);
```

2. **Verify API key**
```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  http://localhost:3000/api/qr-codes
```

3. **Check CORS (if calling from different origin)**
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};
```

### 500 Internal Server Error

**Problem:** API route crashes

**Solutions:**

1. **Check server logs**
```bash
# Development
npm run dev

# Production (PM2)
pm2 logs qr-studio

# Docker
docker-compose logs -f app
```

2. **Add error handling**
```typescript
export async function GET(req: NextRequest) {
  try {
    // Your code
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
```

3. **Check Sentry (if configured)**
- Go to Sentry dashboard
- View error details and stack trace

### Rate limit exceeded

**Problem:** `429 Too Many Requests`

**Solutions:**

1. **Implement exponential backoff**
```typescript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      await new Promise(resolve => 
        setTimeout(resolve, (retryAfter || (2 ** i)) * 1000)
      );
      continue;
    }
    
    return response;
  }
}
```

2. **Upgrade plan** (if using hosted version)

3. **Use caching**
```typescript
import { cache } from '@/lib/redis';

const data = await cache('key', fetchData, 300);
```

---

## Performance Issues

### Slow page load

**Problem:** Pages take too long to load

**Solutions:**

1. **Enable production mode**
```bash
npm run build
npm start
```

2. **Analyze bundle**
```bash
npm install -D @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({});

# Analyze
ANALYZE=true npm run build
```

3. **Optimize images**
```typescript
import Image from 'next/image';

<Image 
  src="/image.png" 
  width={500} 
  height={300}
  loading="lazy"
/>
```

4. **Add Redis caching**
```typescript
import { cache, CacheTTL } from '@/lib/redis';

const data = await cache('key', fetchData, CacheTTL.medium);
```

### High memory usage

**Problem:** Application uses too much RAM

**Solutions:**

1. **Increase Node memory limit**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

2. **Enable streaming**
```typescript
// For large responses
return new Response(stream, {
  headers: { 'Content-Type': 'application/json' }
});
```

3. **Optimize database queries**
```typescript
// Bad: Loading all data
const qrCodes = await prisma.qRCode.findMany({
  include: { scans: true }
});

// Good: Pagination + limited includes
const qrCodes = await prisma.qRCode.findMany({
  take: 10,
  skip: page * 10,
  include: {
    scans: {
      take: 5,
      orderBy: { scannedAt: 'desc' }
    }
  }
});
```

### Slow database queries

**Problem:** Queries take too long

**Solutions:**

1. **Add indexes**
```sql
CREATE INDEX idx_qrcode_userid ON "QRCode"("userId");
CREATE INDEX idx_scan_qrcodeid_scannedat ON "Scan"("qrCodeId", "scannedAt");
```

2. **Use explain analyze**
```sql
EXPLAIN ANALYZE SELECT * FROM "QRCode" WHERE "userId" = 'user-id';
```

3. **Optimize queries**
```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});

// Use aggregation
const count = await prisma.scan.count({
  where: { qrCodeId: 'id' }
});
```

---

## Redis Issues

### Cannot connect to Redis

**Problem:** Redis connection fails

**Solutions:**

1. **Check Redis is running**
```bash
# Linux
sudo systemctl status redis
sudo systemctl start redis

# macOS
brew services list
brew services start redis

# Docker
docker-compose ps redis
```

2. **Test connection**
```bash
redis-cli ping
# Should return: PONG
```

3. **Check connection string**
```env
REDIS_URL="redis://localhost:6379"
# or with password
REDIS_URL="redis://:password@localhost:6379"
```

4. **Fallback gracefully**
```typescript
// Redis should degrade gracefully
try {
  return await getCached(key);
} catch (error) {
  console.warn('Redis unavailable, fetching directly');
  return await fetchDirectly();
}
```

---

## WebSocket Issues

### Socket.IO not connecting

**Problem:** Real-time updates not working

**Solutions:**

1. **Check WebSocket URL**
```typescript
const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3000', {
  path: '/api/socket',
  transports: ['websocket', 'polling']
});
```

2. **Enable WebSocket in Nginx**
```nginx
location /api/socket {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

3. **Check firewall**
```bash
sudo ufw allow 3001/tcp
```

---

## Email Issues

### Emails not sending

**Problem:** Email delivery fails

**Solutions:**

1. **Check SMTP settings**
```env
EMAIL_SERVER="smtp://user:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@yourdomain.com"
```

2. **Test SMTP connection**
```typescript
// Add to API route
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);
await transporter.verify();
```

3. **Check spam filters**
- Verify SPF/DKIM/DMARC records
- Use dedicated email service (SendGrid, Postmark)

---

## Production Issues

### Application crashes on startup

**Problem:** PM2/Docker container keeps restarting

**Solutions:**

1. **Check logs**
```bash
# PM2
pm2 logs qr-studio --lines 100

# Docker
docker-compose logs -f app
```

2. **Common causes:**
- Missing environment variables
- Database connection fails
- Port already in use
- Memory limit exceeded

3. **Verify environment**
```bash
# PM2
pm2 env qr-studio

# Docker
docker-compose exec app env
```

### SSL certificate errors

**Problem:** HTTPS not working

**Solutions:**

1. **Renew certificate**
```bash
sudo certbot renew
sudo systemctl reload nginx
```

2. **Check certificate**
```bash
sudo certbot certificates
```

3. **Test SSL**
```bash
openssl s_client -connect yourdomain.com:443
```

---

## Getting Help

If you can't resolve an issue:

1. **Check logs**
   - Browser console
   - Server logs
   - Database logs

2. **Search documentation**
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Material-UI Docs](https://mui.com)

3. **Community support**
   - GitHub Issues
   - Discord Server
   - Stack Overflow

4. **Provide details**
   - Error message
   - Stack trace
   - Steps to reproduce
   - Environment (OS, Node version, etc.)

---

## Quick Debugging Checklist

- [ ] Clear browser cache
- [ ] Restart dev server
- [ ] Check environment variables
- [ ] Verify database connection
- [ ] Check server logs
- [ ] Test in incognito mode
- [ ] Try different browser
- [ ] Check network tab
- [ ] Verify API endpoints
- [ ] Test with curl/Postman
