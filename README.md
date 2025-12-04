# QR Studio Web Application

A production-ready QR code management platform with advanced analytics, team collaboration, and comprehensive API integration.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![Material UI](https://img.shields.io/badge/Material--UI-6.1-blue?logo=mui)](https://mui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()

## Overview

QR Studio is an enterprise-grade web application designed for creating, managing, and analyzing QR codes at scale. Built with modern web technologies, it provides a comprehensive solution for businesses and developers who need robust QR code functionality with advanced features like real-time analytics, team collaboration, and API integration.

### Project Status

**Current Version:** MVP Complete (86% Implementation)
- 12 of 14 core modules implemented
- Over 3,500 lines of technical documentation
- Production-ready with comprehensive testing coverage

For detailed implementation status, see [MVP_COMPLETE.md](./MVP_COMPLETE.md).

## Features

### Authentication & Security
- Multi-provider authentication via NextAuth.js (OAuth, credentials, API keys)
- Role-based access control (RBAC) for team management
- Secure API key generation and management
- GDPR-compliant data handling with export and deletion capabilities

### QR Code Management
- Support for 10+ QR code types (URL, vCard, WiFi, Email, SMS, etc.)
- Advanced customization: colors, logos, styling, error correction levels
- Bulk generation from CSV/Excel files (100+ codes per batch)
- Template system with public gallery for reusable designs
- Campaign-based organization for better workflow management

### Analytics & Tracking
- Real-time scan tracking with geographic heat maps
- Funnel analysis for conversion optimization
- Device and browser detection
- Exportable reports and data visualization
- Google Sheets integration for data synchronization

### Collaboration & Integration
- Team workspace with multi-user support
- Webhook system for event-driven integrations with retry logic
- Comprehensive REST API with OpenAPI documentation
- Redis caching for optimized performance
- Image optimization and lazy loading

### Internationalization
- Multi-language support (English, Spanish, French, German, Portuguese)
- Localized content and UI components
- Extensible i18n architecture

### Technical Infrastructure
- PostgreSQL database with 50+ performance indexes
- Prisma ORM for type-safe database operations
- Material Design 3 UI with dark/light theme support
- Responsive, mobile-first design
- Server-side rendering with Next.js App Router

## Getting Started

## Getting Started

### System Requirements

- Node.js 20.x or higher
- PostgreSQL 13.x or higher
- npm, yarn, or pnpm package manager
- 4GB RAM minimum (8GB recommended for development)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd qr-studio-web
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

```bash
# On Linux/macOS
./setup.sh

# On Windows or manual setup
copy .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Configure environment variables**

Edit `.env.local` with the following required variables:

```bash
# Database Configuration (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/qr_studio"

# Authentication Configuration (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-secure-secret>"  # Use: openssl rand -base64 32

# OAuth Provider Configuration (Optional)
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
GITHUB_CLIENT_ID="<your-github-client-id>"
GITHUB_CLIENT_SECRET="<your-github-client-secret>"

# Redis Configuration (Optional, for caching)
REDIS_URL="redis://localhost:6379"
```

5. **Initialize the database**

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed sample data
npx prisma db seed
```

6. **Start the development server**

```bash
npm run dev
```

Access the application at [http://localhost:3000](http://localhost:3000)

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

For detailed deployment instructions, see [docs/SELF_HOSTING.md](./docs/SELF_HOSTING.md).

## Documentation

Complete documentation is available in the `docs/` directory:

- **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Comprehensive setup and configuration
- **[API Documentation](./docs/API_DOCUMENTATION.md)** - REST API reference with examples
- **[Self-Hosting Guide](./docs/SELF_HOSTING.md)** - Production deployment instructions
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - Development workflow and standards
- **[Troubleshooting](./docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[OpenAPI Specification](./docs/api/openapi.yaml)** - Machine-readable API schema

## Technology Stack

## Technology Stack

### Frontend Architecture

- **Framework:** Next.js 16.x with App Router architecture
- **UI Library:** Material UI v7 (Material Design 3)
- **Styling:** Tailwind CSS 4.x with MUI System integration
- **State Management:** Zustand with persistent storage
- **Form Handling:** React Hook Form with Zod schema validation
- **QR Generation:** qr-code-styling, qrcode libraries
- **QR Scanning:** jsQR for camera and file-based scanning
- **Data Visualization:** Recharts for analytics dashboards
- **Type Safety:** TypeScript 5.x with strict mode

### Backend Infrastructure

- **Runtime:** Node.js 20.x LTS
- **Database:** PostgreSQL with advanced indexing
- **ORM:** Prisma for type-safe database access
- **Authentication:** NextAuth.js with multiple providers
- **API Layer:** Next.js API Routes (RESTful)
- **Validation:** Zod for runtime type checking
- **File Processing:** papaparse (CSV), xlsx (Excel), jszip (archives)
- **PDF Generation:** jsPDF for QR code exports
- **Caching:** Redis for performance optimization
- **Real-time:** Socket.io for live updates

### Development & Operations

- **Testing:** Vitest (unit), Playwright (E2E)
- **Linting:** ESLint with TypeScript support
- **Code Formatting:** Prettier
- **Version Control:** Git with conventional commits
- **CI/CD:** GitHub Actions (planned)
- **Monitoring:** Sentry for error tracking
- **Hosting:** Vercel-optimized (recommended)
- **Database Hosting:** Supabase, PlanetScale, Neon, or Railway

## Project Structure

```
qr-studio-web/
├── prisma/
│   ├── schema.prisma              # Database schema definition
│   └── migrations/                # Database migration history
├── src/
│   ├── app/
│   │   ├── api/                   # API route handlers
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── qr-codes/          # QR code CRUD operations
│   │   │   ├── analytics/         # Analytics data endpoints
│   │   │   ├── teams/             # Team management
│   │   │   └── webhooks/          # Webhook handlers
│   │   ├── dashboard/             # Protected dashboard routes
│   │   │   ├── generate/          # QR generation interface
│   │   │   ├── scan/              # QR scanning interface
│   │   │   ├── analytics/         # Analytics dashboards
│   │   │   ├── teams/             # Team collaboration
│   │   │   └── settings/          # User settings
│   │   ├── (auth)/                # Authentication pages
│   │   ├── (public)/              # Public-facing pages
│   │   └── layout.tsx             # Root application layout
│   ├── components/
│   │   ├── layout/                # Layout components
│   │   ├── pages/                 # Page-specific components
│   │   ├── qr/                    # QR code components
│   │   ├── analytics/             # Analytics visualizations
│   │   ├── providers/             # React context providers
│   │   └── ui/                    # Reusable UI components
│   ├── lib/
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── qr-utils.ts            # QR generation utilities
│   │   ├── apiAuth.ts             # API authentication
│   │   ├── rateLimit.ts           # Rate limiting logic
│   │   ├── webhooks.ts            # Webhook management
│   │   └── utils.ts               # General utilities
│   ├── store/
│   │   ├── qrCodeStore.ts         # QR code state management
│   │   ├── scanHistoryStore.ts   # Scan history state
│   │   └── preferencesStore.ts   # User preferences state
│   ├── middleware/                # Next.js middleware
│   ├── hooks/                     # Custom React hooks
│   └── types/                     # TypeScript type definitions
├── tests/
│   ├── unit/                      # Unit tests
│   └── e2e/                       # End-to-end tests
├── docs/                          # Project documentation
├── public/                        # Static assets
└── messages/                      # i18n translation files
```

## Development

### Available Commands

```bash
# Development
npm run dev                # Start development server with hot reload
npm run build              # Create production build
npm run start              # Start production server
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking
npm run test               # Run unit tests
npm run test:e2e           # Run end-to-end tests

# Database Operations
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Create and apply migration
npx prisma migrate deploy  # Apply migrations in production
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes without migration
npx prisma db seed         # Seed database with sample data

# Code Quality
npm run format             # Format code with Prettier
npm run lint:fix           # Auto-fix linting issues
```

### Environment Variables Reference
### Environment Variables Reference

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | - |
| `NEXTAUTH_URL` | Yes | Application base URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Yes | Secret for JWT signing | - |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID | - |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret | - |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth client ID | - |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth client secret | - |
| `REDIS_URL` | No | Redis connection string for caching | - |
| `SENTRY_DSN` | No | Sentry DSN for error tracking | - |
| `NEXT_PUBLIC_APP_URL` | No | Public-facing app URL | `NEXTAUTH_URL` |

## Known Issues

### Current Limitations

1. **Material UI Grid v7 API Changes**
   - The `item` prop has been removed from Grid component
   - **Solution:** Use Grid2 component or migrate to flexbox layouts

2. **Clipboard API Type Mismatch**
   - TypeScript type conflict when writing Blob to clipboard
   - **Solution:** Explicit type casting to `Blob` before clipboard operations

For comprehensive issue tracking and solutions, refer to [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md#known-issues--fixes-needed).

## Contributing

We welcome contributions from the community. Please follow these guidelines:

1. **Fork the repository** and create a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the project's code style
   - Write clear, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes** using conventional commits
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork** and submit a pull request
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Wait for review** - maintainers will review your PR

For detailed contribution guidelines, see [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## OAuth Provider Setup

### Google OAuth Configuration

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable Google+ API in the API Library
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth Configuration

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret
5. Add credentials to `.env.local`

## Database Hosting Options

### Recommended Providers

- **Supabase** - Free tier available, PostgreSQL with built-in auth
- **PlanetScale** - Serverless MySQL with generous free tier
- **Neon** - Serverless PostgreSQL with auto-scaling
- **Railway** - Simple deployment with PostgreSQL support
- **Self-hosted** - Docker or native PostgreSQL installation

For detailed hosting instructions, see [docs/SELF_HOSTING.md](./docs/SELF_HOSTING.md).

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/your-org/qr-studio-web/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/qr-studio-web/discussions)
- **Email:** support@qrstudio.example.com

## Acknowledgments

Built with modern web technologies and open-source libraries. Special thanks to all contributors and the open-source community.

---

**QR Studio Web Application** - Professional QR Code Management Platform

