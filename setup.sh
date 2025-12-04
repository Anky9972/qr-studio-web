#!/bin/bash

# QR Studio Web - Quick Start Script
# This script helps set up the development environment

set -e

echo "🚀 QR Studio Web - Quick Start Setup"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local - Please edit it with your credentials"
    echo ""
    echo "⚠️  Required:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo ""
    echo "📖 For OAuth setup, see IMPLEMENTATION_STATUS.md"
    echo ""
    read -p "Press Enter after you've updated .env.local..."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Ask about database
echo ""
read -p "Do you want to run database migrations now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  Running database migrations..."
    npx prisma migrate dev --name init
    echo "✅ Database migrations completed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "   1. Make sure your DATABASE_URL is correct in .env.local"
echo "   2. Set up OAuth providers (see IMPLEMENTATION_STATUS.md)"
echo "   3. Run 'npm run dev' to start the development server"
echo ""
echo "🔗 URLs:"
echo "   - App: http://localhost:3000"
echo "   - Prisma Studio: npx prisma studio"
echo ""
echo "📖 For more info, see IMPLEMENTATION_STATUS.md"
