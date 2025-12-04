# Contributing to QR Studio

Thank you for your interest in contributing to QR Studio! This document provides guidelines for contributing to the project.

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

**Positive behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior:**
- Harassment, trolling, or insulting comments
- Publishing others' private information
- Personal or political attacks
- Other conduct inappropriate in a professional setting

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git
- A GitHub account

### Development Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" button on GitHub
   git clone https://github.com/YOUR_USERNAME/qr-studio.git
   cd qr-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Initialize database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/add-analytics`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/api-routes`)
- `test/` - Tests (e.g., `test/add-qr-tests`)
- `chore/` - Maintenance (e.g., `chore/update-deps`)

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(qr): add QR code expiration feature

Implements time-based expiration for QR codes with automatic
deactivation and notification system.

Closes #123

---

fix(auth): resolve session timeout issue

Sessions were expiring too early due to incorrect TTL calculation.
Updated session middleware to use correct timestamp.

Fixes #456

---

docs(api): update authentication examples

Added curl examples for API key authentication and improved
error response documentation.
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

**Guidelines:**
- Use TypeScript for all new code
- Follow existing patterns and conventions
- Use functional components and hooks (React)
- Prefer async/await over promises
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

**TypeScript:**
```typescript
// Good
interface QRCodeData {
  url: string;
  title?: string;
  description?: string;
}

async function createQRCode(data: QRCodeData): Promise<QRCode> {
  // Implementation
}

// Avoid
function createQRCode(data: any) {
  // Implementation
}
```

### Testing

Write tests for new features and bug fixes:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.ts

# Run with coverage
npm run test:coverage
```

**Test structure:**
```typescript
import { describe, it, expect } from 'vitest';

describe('QRCode', () => {
  describe('creation', () => {
    it('should create a QR code with valid data', async () => {
      const qrCode = await createQRCode({
        url: 'https://example.com',
        title: 'Test QR',
      });
      
      expect(qrCode).toBeDefined();
      expect(qrCode.url).toBe('https://example.com');
    });
    
    it('should throw error with invalid URL', async () => {
      await expect(
        createQRCode({ url: 'invalid-url' })
      ).rejects.toThrow();
    });
  });
});
```

---

## Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

3. **Build successfully**
   ```bash
   npm run build
   ```

4. **Update documentation**
   - Update README if adding features
   - Add/update JSDoc comments
   - Update API documentation if needed

### Submitting

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to GitHub and click "New Pull Request"
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots for UI changes

3. **PR Title Format**
   ```
   feat(scope): brief description
   ```

4. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Related Issues
   Closes #123
   Related to #456
   
   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests added/updated
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   [Add screenshots]
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests pass locally
   - [ ] Dependent changes merged
   ```

### Review Process

1. **Automated checks**
   - CI/CD pipeline must pass
   - Code coverage must not decrease
   - Linting must pass

2. **Code review**
   - At least one maintainer approval required
   - Address all review comments
   - Re-request review after changes

3. **Merge**
   - Maintainer will merge after approval
   - Delete branch after merge

---

## Project Structure

```
qr-studio-web/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── (auth)/       # Auth pages
│   │   ├── (public)/     # Public pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── api/          # API routes
│   │   └── dashboard/    # User dashboard
│   ├── components/       # React components
│   │   ├── layout/       # Layout components
│   │   ├── pages/        # Page-specific components
│   │   ├── qr/           # QR code components
│   │   └── ui/           # UI components
│   ├── lib/              # Utility functions
│   │   ├── analytics/    # Analytics helpers
│   │   ├── auth/         # Auth utilities
│   │   └── db/           # Database helpers
│   ├── store/            # State management
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── public/               # Static assets
└── docs/                 # Documentation
```

---

## Common Tasks

### Adding a New Page

1. Create page file:
   ```typescript
   // src/app/new-page/page.tsx
   export default function NewPage() {
     return <div>New Page</div>;
   }
   ```

2. Add to navigation (if needed):
   ```typescript
   // src/components/layout/Navigation.tsx
   const navItems = [
     // ...existing items
     { href: '/new-page', label: 'New Page' },
   ];
   ```

3. Add tests:
   ```typescript
   // src/app/new-page/page.test.tsx
   import { render, screen } from '@testing-library/react';
   
   describe('NewPage', () => {
     it('renders correctly', () => {
       render(<NewPage />);
       expect(screen.getByText('New Page')).toBeInTheDocument();
     });
   });
   ```

### Adding an API Route

1. Create route file:
   ```typescript
   // src/app/api/new-endpoint/route.ts
   import { NextRequest, NextResponse } from 'next/server';
   import { getServerSession } from '@/lib/auth';
   
   export async function GET(req: NextRequest) {
     const session = await getServerSession();
     
     if (!session) {
       return NextResponse.json(
         { error: 'Unauthorized' },
         { status: 401 }
       );
     }
     
     try {
       // Your logic here
       return NextResponse.json({ data: 'result' });
     } catch (error) {
       console.error('API Error:', error);
       return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
       );
     }
   }
   ```

2. Add to API documentation:
   ```markdown
   # docs/API_DOCUMENTATION.md
   
   ### GET /api/new-endpoint
   Description of endpoint
   
   **Response:**
   ```json
   {
     "data": "result"
   }
   ```

3. Add tests:
   ```typescript
   // src/app/api/new-endpoint/route.test.ts
   import { GET } from './route';
   
   describe('GET /api/new-endpoint', () => {
     it('requires authentication', async () => {
       const response = await GET(mockRequest);
       expect(response.status).toBe(401);
     });
   });
   ```

### Adding a Database Model

1. Update Prisma schema:
   ```prisma
   // prisma/schema.prisma
   model NewModel {
     id        String   @id @default(cuid())
     field     String
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
     
     @@index([field])
   }
   ```

2. Create migration:
   ```bash
   npx prisma migrate dev --name add_new_model
   ```

3. Generate types:
   ```bash
   npx prisma generate
   ```

4. Update seed (if needed):
   ```typescript
   // prisma/seed.ts
   await prisma.newModel.createMany({
     data: [/* seed data */],
   });
   ```

### Adding a Component

1. Create component file:
   ```typescript
   // src/components/NewComponent.tsx
   interface NewComponentProps {
     title: string;
     onAction?: () => void;
   }
   
   export function NewComponent({ title, onAction }: NewComponentProps) {
     return (
       <div>
         <h2>{title}</h2>
         {onAction && <button onClick={onAction}>Action</button>}
       </div>
     );
   }
   ```

2. Add Storybook story (if applicable):
   ```typescript
   // src/components/NewComponent.stories.tsx
   import type { Meta, StoryObj } from '@storybook/react';
   import { NewComponent } from './NewComponent';
   
   const meta: Meta<typeof NewComponent> = {
     component: NewComponent,
   };
   
   export default meta;
   type Story = StoryObj<typeof NewComponent>;
   
   export const Default: Story = {
     args: {
       title: 'Example Title',
     },
   };
   ```

3. Add tests:
   ```typescript
   // src/components/NewComponent.test.tsx
   import { render, screen, fireEvent } from '@testing-library/react';
   
   describe('NewComponent', () => {
     it('renders title', () => {
       render(<NewComponent title="Test" />);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
     
     it('calls onAction when button clicked', () => {
       const onAction = vi.fn();
       render(<NewComponent title="Test" onAction={onAction} />);
       
       fireEvent.click(screen.getByText('Action'));
       expect(onAction).toHaveBeenCalledTimes(1);
     });
   });
   ```

---

## Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Material-UI Documentation](https://mui.com)

### Tools
- [VS Code](https://code.visualstudio.com) - Recommended editor
- [GitHub Desktop](https://desktop.github.com) - Git GUI
- [Postman](https://www.postman.com) - API testing
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI

### Community
- GitHub Discussions - Ask questions
- Discord Server - Real-time chat
- Twitter - Follow for updates

---

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search GitHub Issues
3. Ask in GitHub Discussions
4. Reach out on Discord

Thank you for contributing to QR Studio! 🎉
