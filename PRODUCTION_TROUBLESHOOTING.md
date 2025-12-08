# Production API Troubleshooting Guide

## Common 500 Error Causes for `/api/auth/signup`

### 1. Database Connection Issues ❌

**Symptoms:**
- 500 Internal Server Error
- "Can't reach database server" in logs

**Solutions:**

#### Check Vercel Environment Variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `DATABASE_URL` is set correctly:
   ```
   postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require
   ```

#### Common DATABASE_URL Issues:
- ❌ Missing `?sslmode=require` for cloud databases (Neon, Supabase, etc.)
- ❌ Wrong credentials (username/password)
- ❌ Database host not accessible from Vercel
- ❌ Database doesn't exist
- ❌ Connection pooling not configured

#### Recommended Format (for Neon/Supabase):
```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

#### For Connection Pooling (Neon):
```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true"
```

### 2. Missing Database Migrations ❌

**Symptoms:**
- "Table does not exist" error (P2021)
- User creation fails

**Solutions:**

#### Run Migrations in Production:
```bash
# Generate Prisma Client
npx prisma generate

# Apply migrations
npx prisma migrate deploy

# Verify schema
npx prisma db push
```

#### Vercel Build Command:
Update in `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 3. Environment Variables Not Set ❌

**Required Environment Variables in Vercel:**

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://..."

# NextAuth (REQUIRED)
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secure-random-secret-min-32-chars"

# App URL (REQUIRED)
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Prisma Client Not Generated ❌

**Symptoms:**
- "@prisma/client did not initialize yet" error
- Module not found errors

**Solutions:**

#### Add to package.json:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

#### Vercel Configuration:
```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "installCommand": "npm install && prisma generate"
}
```

### 5. Database Permissions ❌

**Symptoms:**
- "Permission denied" errors
- Cannot create/read users

**Solutions:**

#### Grant Proper Permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE dbname TO username;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO username;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO username;
```

### 6. Region/Latency Issues ❌

**Symptoms:**
- Timeout errors
- Slow response times

**Solutions:**

#### Optimize Prisma Connection:
```typescript
// src/lib/prisma.ts
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
})
```

#### Use Connection Pooling:
- Enable PgBouncer in your DATABASE_URL
- Use Prisma Data Proxy for better edge performance
- Consider Neon serverless driver

### 7. CORS/Cookie Issues ❌

**Symptoms:**
- Cookie not being set
- Authentication fails after signup

**Solutions:**

#### Check domain configuration:
```typescript
// Update NEXTAUTH_URL to match production domain
NEXTAUTH_URL="https://qrstudio.live"

// Not http://localhost:3000
```

## Debugging Steps

### Step 1: Check Vercel Logs
```bash
vercel logs --follow
```

### Step 2: Test Database Connection
Create `/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'Database connected ✅' })
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Database connection failed ❌',
      error: error.message 
    }, { status: 500 })
  }
}
```

### Step 3: Verify Environment Variables
Create `/api/test-env/route.ts`:
```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    DATABASE_URL: !!process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL ? '✅ Set' : '❌ Missing',
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? '✅ Set' : '❌ Missing',
    NODE_ENV: process.env.NODE_ENV,
  })
}
```

### Step 4: Check Prisma Schema
```bash
npx prisma validate
npx prisma format
```

### Step 5: Redeploy with Verbose Logging
```bash
# Enable detailed logs in production temporarily
vercel env add PRISMA_QUERY_LOG_LEVEL production
# Set value: info

# Redeploy
git push
```

## Quick Fix Checklist ✅

- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] DATABASE_URL includes `?sslmode=require` for SSL connections
- [ ] NEXTAUTH_URL matches your production domain (https://qrstudio.live)
- [ ] NEXTAUTH_SECRET is set and at least 32 characters
- [ ] Prisma migrations have been run (`prisma migrate deploy`)
- [ ] Prisma client is generated (`prisma generate`)
- [ ] Database user has proper permissions
- [ ] All required environment variables are set for "Production" environment
- [ ] Vercel functions region matches database region (if possible)
- [ ] Build logs show no errors
- [ ] Database accepts connections from Vercel IPs

## Contact Support

If issues persist:
1. Check Vercel deployment logs
2. Check database provider logs (Neon/Supabase dashboard)
3. Enable debug logging temporarily
4. Test with `/api/test-db` endpoint
5. Verify schema with `prisma studio`

## Common Vercel-Specific Issues

### Issue: Environment Variables Not Loading
**Solution:** Make sure variables are set for the "Production" environment in Vercel, not just "Preview"

### Issue: Build Succeeds but Runtime Fails
**Solution:** Database connection might be blocked. Check firewall rules and allowed IPs

### Issue: Works in Preview, Fails in Production
**Solution:** Check if environment variables differ between Preview and Production environments
