# QR Studio - Developer Getting Started Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- Code editor (VS Code recommended)

---

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/qr-studio.git
cd qr-studio/qr-studio-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/qr_studio"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis (Optional - for caching)
REDIS_URL="redis://localhost:6379"

# Email (for notifications)
EMAIL_SERVER="smtp://user:password@smtp.example.com:587"
EMAIL_FROM="noreply@qrstudio.com"

# Sentry (Optional - for error tracking)
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"

# WebSocket (for real-time analytics)
NEXT_PUBLIC_WS_URL="http://localhost:3001"

# App Settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="QR Studio"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

---

## Project Structure

```
qr-studio-web/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (public)/          # Public pages
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── analytics/        # Analytics components
│   │   ├── layout/           # Layout components
│   │   ├── qr/               # QR code components
│   │   └── ui/               # UI components
│   ├── lib/                   # Utility libraries
│   │   ├── analytics/        # Analytics helpers
│   │   ├── prisma.ts         # Prisma client
│   │   ├── redis.ts          # Redis client
│   │   ├── webhooks.ts       # Webhook utilities
│   │   └── email.ts          # Email utilities
│   ├── store/                 # Zustand stores
│   └── theme/                 # Material-UI theme
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static files
├── docs/                      # Documentation
└── tests/                     # Test files
```

---

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the project conventions:
- Use TypeScript for type safety
- Follow ESLint rules
- Write tests for new features
- Update documentation

### 3. Run Tests
```bash
npm test                  # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### 4. Build & Check
```bash
npm run build            # Production build
npm run lint             # Lint check
npm run type-check       # TypeScript check
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat: add your feature"
```

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build/tooling changes

### 6. Push & Create PR
```bash
git push origin feature/your-feature-name
```

---

## Common Development Tasks

### Adding a New API Route

1. Create route file:
```typescript
// src/app/api/your-route/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Your logic here
  return NextResponse.json({ data: 'success' });
}
```

2. Test the route:
```bash
curl http://localhost:3000/api/your-route
```

### Adding a New Database Model

1. Update Prisma schema:
```prisma
// prisma/schema.prisma
model YourModel {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_your_model
```

3. Update Prisma client:
```bash
npx prisma generate
```

### Adding a New Component

1. Create component file:
```typescript
// src/components/YourComponent.tsx
'use client';

import { Box, Typography } from '@mui/material';

interface YourComponentProps {
  title: string;
}

export default function YourComponent({ title }: YourComponentProps) {
  return (
    <Box>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
}
```

2. Use the component:
```typescript
import YourComponent from '@/components/YourComponent';

<YourComponent title="Hello" />
```

### Adding a New Store

1. Create store file:
```typescript
// src/store/yourStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface YourState {
  items: any[];
  addItem: (item: any) => void;
}

export const useYourStore = create<YourState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ 
        items: [...state.items, item] 
      })),
    }),
    {
      name: 'your-storage',
    }
  )
);
```

2. Use the store:
```typescript
import { useYourStore } from '@/store/yourStore';

const { items, addItem } = useYourStore();
```

---

## Database Operations

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Deploy Migrations
```bash
npx prisma migrate deploy
```

---

## Debugging

### Enable Debug Logs

Add to `.env.local`:
```env
DEBUG=*
NEXT_PUBLIC_DEBUG=true
```

### Debug API Routes

```typescript
console.log('Request:', req.method, req.url);
console.log('Body:', await req.json());
```

### Debug React Components

```typescript
console.log('Props:', props);
console.log('State:', state);
```

### Use VS Code Debugger

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

---

## Testing

### Unit Tests (Jest)

```typescript
// src/lib/__tests__/utils.test.ts
import { yourFunction } from '../utils';

describe('yourFunction', () => {
  it('should return expected value', () => {
    expect(yourFunction('input')).toBe('output');
  });
});
```

Run tests:
```bash
npm test
```

### API Tests

```typescript
// src/app/api/__tests__/route.test.ts
import { GET } from '../route';

describe('/api/your-route', () => {
  it('should return 200', async () => {
    const req = new Request('http://localhost:3000/api/your-route');
    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});
```

---

## Performance Optimization

### 1. Use Redis Caching

```typescript
import { cache, CacheKeys, CacheTTL } from '@/lib/redis';

const data = await cache(
  CacheKeys.qrCodes(userId),
  async () => fetchData(),
  CacheTTL.medium
);
```

### 2. Optimize Database Queries

```typescript
// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// Use include carefully
const qrCodes = await prisma.qRCode.findMany({
  include: {
    scans: {
      take: 10,
      orderBy: { scannedAt: 'desc' },
    },
  },
});
```

### 3. Use Next.js Image Component

```typescript
import Image from 'next/image';

<Image
  src="/image.png"
  width={500}
  height={300}
  alt="Description"
  priority // For above-the-fold images
/>
```

### 4. Lazy Load Components

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client Issues
```bash
# Regenerate client
npx prisma generate

# Clear cache
rm -rf node_modules/.prisma
npm install
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Clear Next.js cache
rm -rf .next
npm run dev
```

### Build Errors
```bash
# Clear all caches
rm -rf .next node_modules
npm install
npm run build
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Material-UI Docs](https://mui.com/material-ui/getting-started/)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)

### Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Postman](https://www.postman.com/) - API testing
- [VS Code Extensions](https://marketplace.visualstudio.com/)
  - Prisma
  - ESLint
  - Prettier
  - GitLens

### Community
- GitHub Discussions
- Discord Server
- Stack Overflow

---

## Next Steps

1. ✅ Set up development environment
2. ✅ Explore the codebase
3. ✅ Run the application
4. 📚 Read the [Architecture Guide](./ARCHITECTURE.md)
5. 🔧 Make your first contribution
6. 🚀 Deploy to production

Happy coding! 🎉
